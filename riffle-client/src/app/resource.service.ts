import { Injectable } from '@angular/core';
import { CardSpritesheetMap } from 'src/data/card-spritesheet-map';
import { Card } from '../../../riffle-server/src/RiffleSchema';
import { SpritesheetMetadata } from './types/spritesheet-metadata';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  public spritesheet: HTMLImageElement;

  constructor() {
    this.spritesheet = new Image();
    this.spritesheet.src = 'assets/playingCards.png';
  }

  public getCardSpritesheetMedata(card: Card): SpritesheetMetadata {
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

    const metadataKey = `${suit}${num}`;
    return CardSpritesheetMap[metadataKey];
  }
}
