import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";

export enum GameView {
  GameLobby,
  Swapping,
  Showdown
}

export const GameConstants = {
  roundTimeMS: 20 * 1000,
};

export class Card extends Schema {
  @type("uint8") num: number = 0;
  @type("uint8") suit: number = 0;

  constructor(num: number, suit: number) {
    super();
    this.num = num;
    this.suit = suit;
  }

  // converts to format compatible with pokersolver library
  // E.g. [num=1, suit=0] -> Ace of Spades -> 'As'
  public asPokersolverString(): string {
    const suit = {
      0: 'c',
      1: 'd',
      2: 'h',
      3: 's'
    }[this.suit];

    let num: string;
    switch (this.num) {
      case 1:
        num = 'A';
        break;
      case 10:
        num = 'T';
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
        num = this.num.toString();
    }

    return num + suit;
  }
}

export class Player extends Schema {
  @type('string')
  name: string;

  @type('string')
  id: string;

  @type([ Card ])
  cards = new ArraySchema<Card>();

  @type('uint16')
  score = 0;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export class ShowdownResult extends Schema{
  @type('string')
  playerId: string;

  @type('string')
  hand: string;

  @type('uint8')
  rank: number

  constructor(playerId: string, hand: string, rank: number) {
    super();
    this.playerId = playerId;
    this.hand = hand;
    this.rank = rank;
  }
}

export class RiffleState extends Schema {
  @type('uint8')
  gameView: GameView;

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type([ Card ])
  commonCards = new ArraySchema<Card>();

  @type([ Card ])
  deck = new ArraySchema<Card>();

  @type([ ShowdownResult ])
  showdownResults: ShowdownResult[];
}
