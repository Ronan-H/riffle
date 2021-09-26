import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounce, take } from 'rxjs/operators';
import { ColyseusService } from '../colyseus.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResourceService } from '../resource.service';
import { NavbarService } from '../navbar/navbar.service';
import { Subscription, timer } from 'rxjs';
import { TutorialModalComponent } from '../tutorial-modal/tutorial-modal.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public joinForm: FormGroup;
  public lobbyForm: FormGroup;
  private modalRef: NgbModalRef;
  public wrongPasscode: boolean;
  public isLoading: boolean;
  private subs: Subscription;

  constructor(
    private resourceService: ResourceService, // eagerly load card spritesheet
    private router: Router,
    public colyseus: ColyseusService,
    private fb: FormBuilder,
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
      username:  [localStorage.getItem('username') || '', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      createForm: this.createForm,
      joinForm: this.joinForm,
    })

    this.subs.add(
      this.joinForm.get('passcode').valueChanges.subscribe(() => {
        this.wrongPasscode = false;
      })
    );

    this.subs.add(
      this.lobbyForm.get('username').valueChanges.pipe(
        debounce(()  => timer(1000)),
      ).subscribe((username) => {
        localStorage.setItem('username', username);
      })
    );

    // TODO remove this, temporary while debugging
    this.lobbyForm.setValue({
      username: 'Ronan',
      createForm: {
        roomName: 'Test room',
      },
      joinForm: {
        roomId: 'ABCDEF',
        passcode: ''
      }
    });
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

  public tryOpenPasscodeModal(content: TemplateRef<any>, roomId: string): void {
    this.joinForm.controls['roomId'].setValue(roomId);

    if (this.lobbyForm.get('username').valid) {
      this.modalRef = this.modalService.open(content);

      this.modalRef.dismissed.pipe(take(1)).subscribe(() => {
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
    }).pipe(take(1)).subscribe(room => {
      room.onMessage('passcode-accepted', () => {
        this.modalRef.close();
        this.router.navigate(['game', room.id]);
      });

      room.onMessage('passcode-rejected', () => {
        this.wrongPasscode = true;
        this.isLoading = false;
      });
    });
  }
}
