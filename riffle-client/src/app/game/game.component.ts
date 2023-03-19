import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { GameConstants, RiffleState, GameView } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  public GameView = GameView;
  public gameView: GameView;
  public GameConstants = GameConstants;

  constructor(
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.colyseus.room$ && this.colyseus.room) {
      //
    }
    else {
      // The user must have navigated to this game by URL.
      // Try to join the game using stored username/password.
      this.route.queryParams.subscribe(params => {
        const roomId = this.route.snapshot.params.id;
        const username = (localStorage.getItem('username') || '').trim();
        const passcode = params.pass;

        const isUsernameValid = username && username.length >= 2 && username.length <= 16;
        const isPasscodeValid = passcode && passcode.length === 4;

        if (isUsernameValid && isPasscodeValid) {
          this.colyseus.joinGame(roomId, {
            username,
            passcode,
          }).subscribe(room => {
            room.onMessage('passcode-accepted', () => {
              return;
            });
      
            room.onMessage('passcode-rejected', () => {
              this.router.navigate(['lobby']);
              return;
            });
          });
        }
        else {
          // No handle on this game; redirect to the lobby
          this.router.navigate(['lobby']);
          return;
        }
      });
    }
  }

}
