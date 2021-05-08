import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Card, GameState } from '../../../../riffle-server/src/RiffleSchema';
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

  constructor(
    private route: ActivatedRoute,
    private colyseus: ColyseusService,
  ) { }
  
  ngOnInit(): void {
    this.gameId = this.route.params.pipe(
      map((params => params['id'])),
    );

    this.colyseus.room$.pipe(take(1)).subscribe(room => {
      room.onStateChange((state: GameState) => {
        this.commonCards = state.commonCards;
        this.handCards = state.players.get(room.sessionId).cards;
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
