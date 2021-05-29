import { Injectable } from '@angular/core';
import { Client as ColyseusClient, Room, RoomAvailable } from 'colyseus.js';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService {
  public allRooms: RoomAvailable[];
  private client: ColyseusClient;
  public room: Room;
  public room$: Observable<Room>;
  public gamePasscode: string;
  public isHost: boolean;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    this.client = new ColyseusClient('ws://localhost:2567');
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
      tap(room => {
        this.room = room;
        this.isHost = true;

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
      tap(room => {
        this.room = room;
        this.isHost = false;

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

  public swapCards(commonIndex: number, handIndex: number): void {
    this.room.send('swap-cards', {
      handIndex,
      commonIndex
    });
  }

  public sortHand(): void {
    this.room.send('sort-hand');
  }
}
