import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameConstants, RiffleState, GameView } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  public state: RiffleState;
  public GameView = GameView;
  public GameConstants = GameConstants;

  constructor(
    private router: Router,
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
  ) {
    if (!this.colyseus.room$ || !this.colyseus.room) {
      // no handle on this game; redirect to the lobby
      this.router.navigate(['lobby']);
      return;
    }
  }

  ngOnInit(): void {
    // start with default state to prevent undefined errors before the state is downloaded initially
    this.state = new RiffleState();
    this.state.gameView = GameView.GameLobby;

    this.colyseus.room$.subscribe(room => {
      this.state = room.state;
      room.onStateChange((state: RiffleState) => {
        this.state = state;
      });
    });
  }

}
