import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ColyseusService } from '../colyseus.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  public lobbyForm: FormGroup;
  public createForm: FormGroup;

  constructor(
    private router: Router,
    public colyseus: ColyseusService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm = this.fb.group({
      roomName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });

    this.lobbyForm = this.fb.group({
      username:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      createForm: this.createForm
    })

    // TODO remove this, temporary while debugging
    this.lobbyForm.setValue({
      username: 'Ronan',
      createForm: {
        roomName: 'Test room',
        password: 'qwerty123'
      }
    });
  }

  public createRoom(): void {
    this.colyseus.createRoom({
      username: this.lobbyForm.get('username').value,
      roomName: this.lobbyForm.get(['createForm', 'roomName']).value,
      password: this.lobbyForm.get(['createForm', 'password']).value
    }).pipe(take(1)).subscribe(room => {
      this.router.navigate(['game', room.id]);
    });
  }

  public joinGame(roomId: string): void {
    if (this.lobbyForm.get('username').valid) {
      this.colyseus.joinGame(roomId).pipe(take(1)).subscribe(room => {
        this.router.navigate(['game', room.id]);
      });
    }
  }
}
