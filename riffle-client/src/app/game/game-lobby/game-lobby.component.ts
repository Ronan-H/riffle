import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ColyseusService } from 'src/app/colyseus.service';
import { ResourceService } from 'src/app/resource.service';
import { GameConstants, Player, RiffleState, RoundOptions } from '../../../../../riffle-server/src/RiffleSchema';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit, OnDestroy {
  private subs: Subscription;
  public optionsForm: UntypedFormGroup;

  public get selfPlayer(): Player {
    return this.colyseus.state.players.get(this.colyseus.room.sessionId);
  }

  public get playersAsArray(): Player[] {
    const arr = [];
    this.colyseus.state.players.forEach((player) => arr.push(player));
    return arr;
  }

  constructor(
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.subs = new Subscription();

    this.subs.add(
      this.colyseus.state$.subscribe(state => {
        if (!this.selfPlayer.isHost) {
          this.optionsForm.controls['numRounds'].setValue(state.roundOptions.numRounds);
        }
      })
    );

    this.colyseus.gamePasscode$.pipe(
      filter(pass => pass !== null),
    ).subscribe(pass => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { pass },
        // preserve the existing query params in the route
        queryParamsHandling: 'merge',
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

        // prevent floating point values, by rounding to the nearest whole number
        this.optionsForm.controls['numRounds'].setValue(
          Math.round(roundOptions.numRounds),
          { emitEvent: false }
        );

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

  ngOnDestroy(): void {
      this.subs.unsubscribe();
  }

}
