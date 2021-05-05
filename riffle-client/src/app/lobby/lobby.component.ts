import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Client as ColyseusClient, Room } from 'colyseus.js';
import { take } from 'rxjs/operators';
import { ColyseusService } from '../colyseus.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {

  constructor(
    private router: Router,
    public colyseus: ColyseusService,
  ) { }

  public createRoom(): void {
    this.colyseus.createRoom().pipe(take(1)).subscribe(room => {
      console.log('joinOrCreate sub');

      this.router.navigate(['game', room.id]);
    });
  }

  public joinGame(roomId: string): void {
    console.log('Joining game by Room ID:', roomId);

    this.colyseus.joinGame(roomId).pipe(take(1)).subscribe(room => {
      console.log('joinOrCreate sub');

      this.router.navigate(['game', room.id]);
    });
  }
}
