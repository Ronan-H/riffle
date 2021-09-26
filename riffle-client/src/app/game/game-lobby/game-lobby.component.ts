import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColyseusService } from 'src/app/colyseus.service';
import { ResourceService } from 'src/app/resource.service';
import { GameConstants, Player, RiffleState, RoundOptions } from '../../../../../riffle-server/src/RiffleSchema';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {
  @Input()
  public state: RiffleState;

  public optionsForm: FormGroup;

  public get selfPlayer(): Player {
    return this.state.players.get(this.colyseus.room.sessionId);
  }

  public get playersAsArray(): Player[] {
    const arr = [];
    this.state.players.forEach((player) => arr.push(player));
    return arr;
  }

  constructor(
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.colyseus.room$.subscribe(room => {
      this.state = room.state;
      room.onStateChange((state: RiffleState) => {
        this.state = state;

        if (!this.selfPlayer.isHost) {
          this.optionsForm.controls['numRounds'].setValue(state.roundOptions.numRounds);
        }
      });
    });

    this.optionsForm = this.fb.group({
      numRounds:  [GameConstants.defaultNumRounds],
    });

    this.optionsForm.valueChanges.subscribe((roundOptions: Partial<RoundOptions>) => {
      // enforce min/max round number as 1/100, if out of bounds
      if (roundOptions.numRounds !== null) {
        if (roundOptions.numRounds < 1) {
          this.optionsForm.controls['numRounds'].setValue(1, { emitEvent: false });
          roundOptions.numRounds = 1;
        }
        if (roundOptions.numRounds > 100) {
          this.optionsForm.controls['numRounds'].setValue(100, { emitEvent: false });
          roundOptions.numRounds = 100;
        }

        this.colyseus.updateRoundOptions(roundOptions);
      }
      else {
        this.colyseus.updateRoundOptions({
          numRounds: 1
        });
      }
    });
  }

  public startGame(): void {
    this.colyseus.startGame();
  }

  public onOptionsInputFocusOut(): void {
    if (this.optionsForm.controls['numRounds'].value === null) {
      this.optionsForm.controls['numRounds'].setValue(1);
    }
  }

}
