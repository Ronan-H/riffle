import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Card, GameConstants, RiffleState, GameView, ShowdownResult, Player } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';
import { ResourceService } from '../resource.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @ViewChild('cardCanvas')
  myCanvas: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;

  public gameId: Observable<string>;
  public commonCards: Card[];
  public handCards: Card[];
  public selectedCommonIndex;
  public selectedHandIndex;
  public GameView = GameView;
  public gameView: GameView;

  public GameConstants = GameConstants;
  public roundTimeRemainingMS: number;
  private roundTimeInterval: any;
  private roundTimeDeltaMS = 15;

  public showdownResults: ShowdownResult[];
  public showdownWinner: Player;
  public isNextRoundClicked: boolean;
  public numVotedNextRound: number;
  public nextRoundVotesRequired: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private colyseus: ColyseusService,
    public resourceService: ResourceService,
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
        this.showdownWinner = state.showdownWinner;
        this.numVotedNextRound = state.numVotedNextRound;
        this.nextRoundVotesRequired = state.nextRoundVotesRequired;

        this.drawCards();
      });

      room.onMessage('game-view-changed', (newGameView: GameView) => {
        switch (newGameView) {
          case GameView.Swapping:
            // reset
            this.selectedCommonIndex = -1;
            this.selectedHandIndex = -1;

            // start the round timer
            this.roundTimeRemainingMS = GameConstants.roundTimeMS;

            this.roundTimeInterval = setInterval(() => {
              this.roundTimeRemainingMS -= this.roundTimeDeltaMS;
            }, this.roundTimeDeltaMS);
            break;
          case GameView.Showdown:
            // reset
            this.isNextRoundClicked = false;

            clearInterval(this.roundTimeInterval);
            break;
        }
      });
    });
  }

  private drawCards(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.fillRect(10,10,10,10)

    const spritesheet = this.resourceService.spritesheet;
    this.commonCards.forEach((card, index) => {
      const metadata = this.resourceService.getCardSpritesheetMedata(card);
      const cardWidth = 100;
      const cardHeight = 135;
      const offsetX = cardWidth * index;
      const offsetY = 0;
      this.ctx.drawImage(
        spritesheet,
        metadata.x,
        metadata.y,
        metadata.width,
        metadata.height,
        offsetX,
        offsetY,
        cardWidth,
        cardHeight
      );
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
}
