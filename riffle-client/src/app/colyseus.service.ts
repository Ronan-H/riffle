import { Injectable } from '@angular/core';
import { Client as ColyseusClient, Room, RoomAvailable } from 'colyseus.js';
import { BehaviorSubject, from, Observable, Observer } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { RoundOptions, RiffleState, GameView } from '../../../riffle-server/src/RiffleSchema';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService {
  public allRooms: RoomAvailable[];
  private client: ColyseusClient;
  public room: Room;
  public room$: Observable<Room>;
  public state: RiffleState;
  public state$: Observable<RiffleState>;
  public gamePasscode$: BehaviorSubject<string>;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const host = window.document.location.host.replace(/:.*/, '');
    const protocol = location.protocol.replace("http", "ws");
    const serverUrl = `${protocol}//${host}${(environment.colyseusPort ? ':' + environment.colyseusPort : '')}`;

    this.client = new ColyseusClient(serverUrl);

    this.gamePasscode$ = new BehaviorSubject(null);

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
    // start with default state to prevent undefined errors before the state is downloaded initially
    this.state = new RiffleState();

    this.room$ = from(
      this.client.create('riffle_room', {
        ...options
      })
    ).pipe(
      first(),
      tap((state) => this.onNewRoom(state)),
    );

    return this.room$;
  }

  public joinGame(roomId: string, options: any): Observable<Room> {
    // start with default state to prevent undefined errors before the state is downloaded initially
    this.state = new RiffleState();

    this.room$ = from(
      this.client.joinById(roomId, { ...options })
    ).pipe(
      first(),
      tap((state) => this.onNewRoom(state)),
    );

    return this.room$;
  }

  private onNewRoom(room: Room): void {
    this.room = room;
    const roomState = room.state as RiffleState;
    this.state = roomState;

    this.state$ = new Observable((observer) => {
      observer.next(roomState);
      
      room.onStateChange((state: RiffleState) => {
        this.state = state;
        observer.next(state);
      });
    });

    room.onMessage('debug', (debugInfo) => {
      console.log('DEBUG:', debugInfo);
    });

    room.onMessage('passcode', (passcode) => {
      this.gamePasscode$.next(passcode);
    });
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
