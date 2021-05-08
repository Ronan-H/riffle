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
        password: 'test',
        ...options
      })
    ).pipe(
        tap(room => {
          this.room = room;

          room.onMessage('debug', (obj) => {
            console.log('DEBUG:', obj);
          });
        }),
      );

    return this.room$;
  }

  public joinGame(roomId: string, password: string): Observable<Room> {
    this.room$ = from(
      this.client.joinById(roomId, {
        password
      })
    ).pipe(
        tap(room => {
          this.room = room;

          room.onMessage('debug', (obj) => {
            console.log('DEBUG:', obj);
          });
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
