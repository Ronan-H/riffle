import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Client as ColyseusClient, Room, RoomAvailable } from 'colyseus.js';
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
}
