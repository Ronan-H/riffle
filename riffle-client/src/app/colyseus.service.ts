import { Injectable } from '@angular/core';
import { Client as ColyseusClient, Room, RoomAvailable } from 'colyseus.js';
import { from, Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { RoundOptions } from '../../../riffle-server/src/RiffleSchema';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService {
  public allRooms: RoomAvailable[];
  private client: ColyseusClient;
  public room: Room;
  public room$: Observable<Room>;
  public gamePasscode: string;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const host = window.document.location.host.replace(/:.*/, '');
    const protocol = location.protocol.replace("http", "ws");
    const serverUrl = `${protocol}//${host}${(environment.colyseusPort ? ':' + environment.colyseusPort : '')}`;

    this.client = new ColyseusClient(serverUrl);

    this.client.joinOrCreate('lobby').then(lobby => {
      lobby.onMessage("rooms", (rooms) => {
        this.allRooms = rooms;
      });

      lobby.onMessage("+", ([roomId, room]) => {
        const roomIndex = this.allRooms.findIndex((room) => room.roomId === roomId);
        if (roomIndex !== -1) {
          this.allRooms[roomIndex] = room;
        } else {
          this.allRooms.push(room);
        }
      });

      lobby.onMessage("-", (roomId) => {
        this.allRooms = this.allRooms.filter((room) => room.roomId !== roomId);
      });
    });
  }

  public createRoom(options: any): Observable<Room> {
    this.room$ = from(
      this.client.create('riffle_room', {
        ...options
      })
    ).pipe(
      first(),
      tap(room => {
        this.room = room;

        room.onMessage('debug', (debugInfo) => {
          console.log('DEBUG:', debugInfo);
        });

        room.onMessage('passcode', (passcode) => {
          this.gamePasscode = passcode;
        });
      }),
    );

    return this.room$;
  }

  public joinGame(roomId: string, options: any): Observable<Room> {
    this.room$ = from(
      this.client.joinById(roomId, { ...options })
    ).pipe(
      first(),
      tap(room => {
        this.room = room;

        room.onMessage('debug', (debugInfo) => {
          console.log('DEBUG:', debugInfo);
        });

        room.onMessage('passcode', (passcode) => {
          this.gamePasscode = passcode;
        });
      }),
    );

    return this.room$;
  }

  public startGame(): void {
    this.room.send('start-game');
  }

  public leaveGame(): void {
    this.room.leave();
  }

  public setSelectedCommonIndex(commonIndex: number): void {
    this.room.send('select-common-index', commonIndex);
  }

  public swapCards(commonIndex: number, handIndex: number): void {
    this.room.send('swap-cards', {
      handIndex,
      commonIndex
    });
  }

  public sortHand(): void {
    this.room.send('sort-hand');
  }

  public updateRoundOptions(roundOptions: Partial<RoundOptions>): void {
    this.room.send('update-round-options', roundOptions);
  }
}
