import { Schema, ArraySchema, type } from "@colyseus/schema";

export class Card extends Schema {

  constructor(num: number, suit: number) {
    super();
    this.num = num;
    this.suit = suit;
  }

  @type("uint8") num: number = 0;
  @type("uint8") suit: number = 0;
}

export class Cards extends Schema {

  @type([ Card ])
  cards = new ArraySchema<Card>();

  constructor(generateDeck = false) {
    super();
    if (generateDeck) {
      for (let suit = 0; suit < 4; suit++) {
        for (let num = 1; num <= 13; num++) {
          this.cards.push(new Card(num, suit));
        }
      }
    }
  }

  public shuffle(): void {
    const shuffled = new ArraySchema<Card>();

    while (this.cards.length > 0) {
      const nextIndex = Math.floor(Math.random() * this.cards.length);
      shuffled.push(this.cards.splice(nextIndex, 1)[0]);
    }

    this.cards = shuffled;
  }
}

export class Player extends Schema {
  @type('string')
  name: string;

  @type(Cards)
  cards = new Cards;

  @type('uint16')
  score = 0;
}

export class GameState extends Schema {
  @type([ Player ])
  players = new ArraySchema<Player>();

  @type(Cards)
  commonCards = new Cards();

  @type(Cards)
  deck = new Cards(true);
}
