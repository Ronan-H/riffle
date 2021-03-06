import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';

export enum GameView {
  GameLobby,
  Swapping,
  Showdown
}

export const GameConstants = {
  maxGamePlayers: 8,
  defaultNumRounds: 15,
  roundTimeMS: 25 * 1000,
  roundWinnerMultiplier: 2,
};

export class Card extends Schema {
  @type('uint8') num: number = 0;
  @type('uint8') suit: number = 0;

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

    return num.concat(suit);
  }
}

export class Player extends Schema {
  @type('string')
  id: string;

  @type('string')
  name: string;

  @type('string')
  colour: string;

  @type([ Card ])
  cards = new ArraySchema<Card>();

  @type('int8')
  selectedCommonIndex: number = -1;

  @type('string')
  currentHandDesc: string;

  @type('number')
  currentHandScore: number;

  @type('boolean')
  isCurrentlyWinning: boolean;

  @type('uint16')
  score = 0;

  @type('boolean')
  votedNextRound: boolean = false;

  @type('boolean')
  isHost: boolean = false;

  constructor(id: string, name: string, colour: string, isHost: boolean) {
    super();
    this.id = id;
    this.name = name;
    this.colour = colour;
    this.isHost =  isHost;
  }
}

export class ShowdownResult extends Schema {
  @type('string')
  playerId: string;

  @type(Player)
  player: Player;

  @type('string')
  hand: string;

  @type('uint16')
  handScore: number;

  @type('uint32')
  totalScore: number;

  @type('boolean')
  isWinningHand: boolean;

  constructor(
    playerId: string,
    player: Player,
    hand: string,
    handScore: number,
    totalScore: number,
    isWinningHand: boolean,
  ) {
    super();
    this.playerId = playerId;
    this.player = player;
    this.hand = hand;
    this.handScore = handScore;
    this.totalScore = totalScore;
    this.isWinningHand = isWinningHand;
  }
}

export class RoundOptions extends Schema {
  @type('number')
  numRounds: number;

  constructor(numRounds = GameConstants.defaultNumRounds) {
    super();
    this.numRounds = numRounds;
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
  deck: ArraySchema<Card>;

  @type([ ShowdownResult ])
  handResults: ShowdownResult[];

  @type([ ShowdownResult ])
  leaderboardResults: ShowdownResult[];

  @type('uint8')
  roundNum: number;

  @type('uint8')
  roundsRemaining: number;

  @type('uint8')
  numVotedNextRound: number;

  @type('uint8')
  nextRoundVotesRequired: number;

  @type(RoundOptions)
  roundOptions: RoundOptions = new RoundOptions();

  @type([ Player ])
  gameWinners: ArraySchema<Player>;

  @type('string')
  roomName: string;
}
