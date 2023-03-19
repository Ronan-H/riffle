import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounce, take } from 'rxjs/operators';
import { ColyseusService } from '../colyseus.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResourceService } from '../resource.service';
import { NavbarService } from '../navbar/navbar.service';
import { Subscription, timer } from 'rxjs';
import { TutorialModalComponent } from '../tutorial-modal/tutorial-modal.component';
import { GameConstants } from '../../../../riffle-server/src/RiffleSchema';
import { RoomAvailable } from 'colyseus.js';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  public createForm: UntypedFormGroup;
  public joinForm: UntypedFormGroup;
  public lobbyForm: UntypedFormGroup;
  private modalRef: NgbModalRef;
  public wrongPasscode: boolean;
  public isLoading: boolean;
  private subs: Subscription;
  public GameConstants = GameConstants;

  constructor(
    private resourceService: ResourceService, // eagerly load card spritesheet
    private router: Router,
    public colyseus: ColyseusService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private navbarService: NavbarService,
  ) { }

  ngOnInit() {
    this.subs = new Subscription();
    this.isLoading = false;
    this.navbarService.setMessage('Lobby');

    this.createForm = this.fb.group({
      roomName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });

    this.joinForm = this.fb.group({
      roomId: ['', [Validators.required]],
      passcode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });

    this.lobbyForm = this.fb.group({
      username:  [
        localStorage.getItem(
          'username') || '',
            [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(16),
              // match anything that doesn't have leading or trailing whitespace
              Validators.pattern('(?! )[A-Za-z0-9\\s]+(?<! )'),
            ]],
      createForm: this.createForm,
      joinForm: this.joinForm,
    })

    this.subs.add(
      this.lobbyForm.get('username').valueChanges.subscribe((username: string) => {
        const trimmedUsername = username.trim();

        if (trimmedUsername.length === 0) {
          // remove whitespace when entered by itself
          this.lobbyForm.controls['username'].setValue('', { emitEvent: false });
        }
        else {
          localStorage.setItem('username', username);
        }
      })
    );

    this.subs.add(
      this.joinForm.get('passcode').valueChanges.subscribe(() => {
        this.wrongPasscode = false;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public createRoom(): void {
    this.isLoading = true;

    this.colyseus.createRoom({
      username: this.lobbyForm.get('username').value,
      roomName: this.lobbyForm.get(['createForm', 'roomName']).value,
    }).pipe(take(1)).subscribe(room => {
      this.router.navigate(['game', room.id]);
    });
  }

  public openTutorialModal() {
      this.modalService.open(TutorialModalComponent);
  }

  public isRoomFull(room: RoomAvailable) {
    return room.clients >= room.maxClients;
  }

  public tryOpenPasscodeModal(content: TemplateRef<any>, room: RoomAvailable): void {
    if (this.isRoomFull(room)) {
      return;
    }

    this.joinForm.controls['roomId'].setValue(room.roomId);

    if (this.lobbyForm.get('username').valid) {
      this.modalRef = this.modalService.open(content);

      this.modalRef.dismissed.subscribe(() => {
        this.wrongPasscode = false;
        this.isLoading = false;
      });
    }
    else {
      // trigger field validation prompts (E.g. "Please enter a valid username")
      this.lobbyForm.markAllAsTouched();
    }
  }

  public tryJoinRoom(): void {
    if (this.isLoading) {
      return;
    }

    if (this.joinForm.invalid) {
      this.wrongPasscode = true;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    const username = this.lobbyForm.get('username').value;
    const roomId = this.joinForm.get('roomId').value;
    const passcode = this.joinForm.get('passcode').value;

    this.colyseus.joinGame(roomId, {
      username,
      passcode,
    }).subscribe(room => {
      room.onMessage('passcode-accepted', () => {
        this.modalRef.close();
        this.router.navigate(['game', room.id], { queryParams: { pass: passcode } });
      });

      room.onMessage('passcode-rejected', () => {
        this.wrongPasscode = true;
        this.isLoading = false;
      });
    });
  }
}
