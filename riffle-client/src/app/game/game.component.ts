import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GameConstants, RiffleState, GameView, Player } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  public gameId: Observable<string>;
  public state: RiffleState;
  public GameView = GameView;
  public GameConstants = GameConstants;

  public get selfPlayer(): Player {
    return this.state.players.get(this.colyseus.room.sessionId);
  }

  constructor(
    private router: Router,
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
  ) { }

  ngOnInit(): void {
    if (this.colyseus.room === undefined) {
      // no handle on this game; redirect to the lobby
      this.router.navigate(['lobby']);
    }

    // start with default state to prevent undefined errors before the state is downloaded initially
    this.state = new RiffleState();
    this.state.gameView = GameView.GameLobby;

    this.colyseus.room$.pipe(
      take(1)
    ).subscribe(room => {
      room.onStateChange((state: RiffleState) => {
        this.state = state;
      });
    });
  }

}
