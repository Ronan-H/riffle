import { Injectable } from '@angular/core';
import { Card } from '../../../riffle-server/src/RiffleSchema';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  // access: cardImages[suit][number]
  private cardImages: HTMLImageElement[][];

  constructor() {
    this.cardImages = [];
    
    // loading the images sources here effectively preloads/caches them
    for (let suit = 0; suit <= 3; suit++) {
      this.cardImages[suit] = [];
      for (let num = 1; num <= 13; num++) {
        const imgPath = this.cardToImagePath(new Card(num, suit));
        const cardImg = new Image();
        cardImg.src = imgPath;
        this.cardImages[suit].push(cardImg);
      }
    }
  }

  private cardToImagePath(card: Card): string {
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

  public cardToImage(card: Card): HTMLImageElement {
    // TODO: why is the card image sometimes undefined?
    return this.cardImages[card.suit][card.num] ?? new Image();
  }
}
