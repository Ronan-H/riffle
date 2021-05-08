import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ColyseusService } from '../colyseus.service';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  public createForm: FormGroup;
  public joinForm: FormGroup;
  public lobbyForm: FormGroup;
  private modalRef: NgbModalRef;
  public wrongPassword: boolean;

  constructor(
    private router: Router,
    public colyseus: ColyseusService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.createForm = this.fb.group({
      roomName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });

    this.joinForm = this.fb.group({
      roomId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]]
    });

    this.lobbyForm = this.fb.group({
      username:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      createForm: this.createForm,
      joinForm: this.joinForm,
    })

    // TODO remove this, temporary while debugging
    this.lobbyForm.setValue({
      username: 'Ronan',
      createForm: {
        roomName: 'Test room',
        password: 'qwerty123'
      },
      joinForm: {
        roomId: 'ABCDEF',
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

  public openPasswordModal(content: TemplateRef<any>, roomId: string): void {
    this.joinForm.controls['roomId'].setValue(roomId);

    if (this.lobbyForm.get('username').valid) {
      this.modalRef = this.modalService.open(content);

      this.modalRef.dismissed.pipe(take(1)).subscribe(() => {
        this.wrongPassword = false;
      });
    }
  }

  public tryJoinRoom(): void {
    const roomId = this.joinForm.get('roomId').value;
    const password = this.joinForm.get('password').value;

    this.colyseus.joinGame(roomId, password).pipe(take(1)).subscribe(room => {
      room.onMessage('password-accepted', () => {
        this.modalRef.close();
        this.router.navigate(['game', room.id]);
      });

      room.onMessage('password-rejected', () => {
        this.wrongPassword = true;
      });
    });
  }
}
