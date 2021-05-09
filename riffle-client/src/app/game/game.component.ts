import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Card, GameConstants, RiffleState, GameView, ShowdownResult } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public gameId: Observable<string>;
  public commonCards: Card[];
  public handCards: Card[];
  public selectedCommonIndex = -1;
  public selectedHandIndex = -1;
  public GameView = GameView;
  public gameView: GameView;

  public GameConstants = GameConstants;
  public roundTimeRemainingMS: number;
  private roundTimeInterval: any;
  private roundTimeDeltaMS = 15;

  public showdownResults: ShowdownResult[];
  public isNextRoundClicked: boolean;
  public numVotedNextRound: number;
  public nextRoundVotesRequired: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private colyseus: ColyseusService,
  ) { }
  
  ngOnInit(): void {
    if (this.colyseus.room === undefined) {
      // no handle on this game; redirect to the lobby
      this.router.navigate(['lobby']);
    }

    this.gameId = this.route.params.pipe(
      map((params => params['id'])),
    );

    this.colyseus.room$.pipe(take(1)).subscribe(room => {
      room.onStateChange((state: RiffleState) => {
        this.gameView = state.gameView;
        this.commonCards = state.commonCards;
        this.handCards = state.players.get(room.sessionId).cards;

        this.showdownResults = state.showdownResults;
        this.numVotedNextRound = state.numVotedNextRound;
        this.nextRoundVotesRequired = state.nextRoundVotesRequired;
      });

      room.onMessage('game-view-changed', (newGameView: GameView) => {
        switch (newGameView) {
          case GameView.Swapping:
            // start the round timer
            this.roundTimeRemainingMS = GameConstants.roundTimeMS;

            this.roundTimeInterval = setInterval(() => {
              this.roundTimeRemainingMS -= this.roundTimeDeltaMS;
            }, this.roundTimeDeltaMS);
            break;
          case GameView.Showdown:
            this.isNextRoundClicked = false;

            clearInterval(this.roundTimeInterval);
            break;
        }
      });
    });
  }

  public selectCommonCard(index: number): void {
    if (this.selectedCommonIndex === index) {
      this.selectedCommonIndex = -1;
    }
    else {
      this.selectedCommonIndex = index;
      this.swapIfBothSelected();
    }
  }

  public selectHandCard(index: number): void {
    if (this.selectedHandIndex === index) {
      this.selectedHandIndex = -1;
    }
    else {
      this.selectedHandIndex = index;
      this.swapIfBothSelected();
    }
  }

  private swapIfBothSelected(): void {
    if (this.selectedCommonIndex !== -1 && this.selectedHandIndex !== -1) {
      this.colyseus.swapCards(this.selectedCommonIndex, this.selectedHandIndex);

      this.selectedCommonIndex = -1;
      this.selectedHandIndex = -1;
    }
  }

  public onNextRoundClicked(): void {
    this.isNextRoundClicked = true;
    this.colyseus.room.send('next-round-vote');
  }

  public cardToImagePath(card: Card): string {
    const suit = {
      0: 'Clubs',
      1: 'Diamonds',
      2: 'Hearts',
      3: 'Spades'
    }[card.suit];

    let num: string;
    switch (card.num) {
      case 1:
        num = 'A';
        break;
      case 11:
        num = 'J';
        break;
      case 12:
        num = 'Q';
        break;
      case 13:
        num = 'K';
        break;
      default:
        num = card.num.toString();
    }

    return `assets/card${suit}${num}.png`;
  }
}
