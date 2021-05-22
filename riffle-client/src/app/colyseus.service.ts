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

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const host = window.document.location.host.replace(/:.*/, '');
    const serverUrl = location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':'+ location.port : '');

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
        password: 'test',
        ...options
      })
    ).pipe(
        tap(room => {
          this.room = room;
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
        }),
      );

    return this.room$;
  }

  public swapCards(commonIndex: number, handIndex: number): void {
    this.room.send('swap-cards', {
      handIndex,
      commonIndex
    });
  }
}
