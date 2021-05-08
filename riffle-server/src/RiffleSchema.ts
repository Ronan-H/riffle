import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";

export enum GameView {
  GameLobby,
  Swapping,
  Showdown
}

export class Card extends Schema {
  @type("uint8") num: number = 0;
  @type("uint8") suit: number = 0;

  constructor(num: number, suit: number) {
    super();
    this.num = num;
    this.suit = suit;
  }
}

export class Player extends Schema {
  @type('string')
  name: string;

  @type([ Card ])
  cards = new ArraySchema<Card>();

  @type('uint16')
  score = 0;
}

export class GameState extends Schema {
  @type('uint8')
  gameView: GameView;

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type([ Card ])
  commonCards = new ArraySchema<Card>();

  @type([ Card ])
  deck = new ArraySchema<Card>();
}
