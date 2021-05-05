import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Client as ColyseusClient, Room, RoomAvailable } from 'colyseus.js';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService {
  public allRooms: RoomAvailable[];
  private client: ColyseusClient;
  private room: Room;
  public room$: Observable<Room>;

  constructor(
    private router: Router,
  ) {
    this.initClient();
  }

  private initClient(): void {
    this.client = new ColyseusClient('ws://localhost:2567');
    this.client.joinOrCreate('lobby').then(lobby => {
      console.log('Joined the lobby');
      lobby.onMessage("rooms", (rooms) => {
        this.allRooms = rooms;
        console.log('Got rooms from lobby');
      });
      
      lobby.onMessage("+", ([roomId, room]) => {
        const roomIndex = this.allRooms.findIndex((room) => room.roomId === roomId);
        if (roomIndex !== -1) {
          this.allRooms[roomIndex] = room;
        } else {
          this.allRooms.push(room);
        }
        console.log('Room added');
      });
      
      lobby.onMessage("-", (roomId) => {
        this.allRooms = this.allRooms.filter((room) => room.roomId !== roomId);
        console.log('Room removed');
      });
    });
  }

  public createRoom(): Observable<Room> {
    this.room$ = from(
      this.client.create('my_room', {
        password: 'test'
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

  public joinGame(roomId: string): Observable<Room> {
    this.room$ = from(
      this.client.joinById(roomId, {
        password: 'test'
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
