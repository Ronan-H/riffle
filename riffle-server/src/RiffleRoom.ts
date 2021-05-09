import { Room, Client } from "colyseus";
import { RiffleState, Card, Player, GameView, GameConstants, ShowdownResult } from "./RiffleSchema";
import { ArraySchema } from "@colyseus/schema";
var Hand = require('pokersolver').Hand;

export class RiffleRoom extends Room<RiffleState> {
  
  onCreate (options: any) {
    this.setMetadata({
      ...this.metadata,
      ...options
    });

    this.setState(new RiffleState());

    this.onMessage('swap-cards', (client, message) => {
      client.send('debug', {
        id: client.id,
        sessionId: client.sessionId,
      });

      const commonIndex: number = message.commonIndex;
      const handIndex: number = message.handIndex;

      const common = this.state.commonCards;
      const hand = this.state.players.get(client.sessionId).cards;

      // perform the swap
      const temp = common[commonIndex];
      common[commonIndex] = hand[handIndex];
      hand[handIndex] = temp;
    });

    this.onMessage('next-round-vote', (client, message) => {
      if (!this.state.players.get(client.sessionId).votedNextRound) {
        this.state.players.get(client.sessionId).votedNextRound = true;
        this.state.numVotedNextRound++;

        if (this.state.numVotedNextRound >= this.state.nextRoundVotesRequired) {
          // enough players voted to continue; start new round
          this.startRound();
        }
      }
    });
  }

  private startRound() {
    this.resetCards();
    this.populateDeck();
    this.state.deck = this.shuffle(this.state.deck);
    this.deal();

    this.updateGameView(GameView.Swapping);

    setTimeout(() => {
      this.updateGameView(GameView.Showdown);
      this.startShowdown();
    }, GameConstants.roundTimeMS);
  }

  private updateGameView(nextGameView: GameView): void {
    this.state.gameView = nextGameView;
    this.broadcast('game-view-changed', nextGameView);
  }

  private populateDeck(): void {
    for (let suit = 0; suit < 4; suit++) {
      for (let num = 1; num <= 13; num++) {
        this.state.deck.push(new Card(num, suit));
      }
    }
  }

  private resetCards(): void {
    this.state.deck = new ArraySchema<Card>();
    this.state.commonCards = new ArraySchema<Card>();
    this.state.players.forEach(player => {
      player.cards = new ArraySchema<Card>();
    });
  }

  private shuffle(cards: ArraySchema<Card>): ArraySchema<Card> {
    // Fisher–Yates shuffle -- https://bost.ocks.org/mike/shuffle/
    let m = cards.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }

    return cards;
  }

  private deal(): void {
    for (let i = 0; i < 5; i++) {
      this.state.commonCards.push(this.state.deck.pop());
    }

    this.state.players.forEach((player: Player) => {
      for (let i = 0; i < 5; i++) {
        player.cards.push(this.state.deck.pop());
      }
    });
  }

  private startShowdown(): void {
    // build showdown sequence
    const showdownSeq: ShowdownResult[] = [];
    this.state.players.forEach(player => {
      const hand = Hand.solve(player.cards.map(card => card.asPokersolverString()));

      showdownSeq.push(new ShowdownResult(player.id, player.name, hand.descr, 0));
    });

    showdownSeq.sort((a, b) => b.rank - a.rank);
    this.state.showdownResults = showdownSeq;

    this.state.numVotedNextRound = 0;
    this.state.players.forEach(player => {
      player.votedNextRound = false;
    });
    this.state.nextRoundVotesRequired = (Math.floor(this.state.players.size / 2) + 1);
  }

  onJoin (client: Client, options: any) {
    client.send('debug', {
      optionsPass: options.password,
      metaPass: this.metadata.password,
    });

    // validate password
    if (options.password !== this.metadata.password) {
      client.send('password-rejected');

      // server error if leave() is called straight away
      setTimeout(() => {
        client.leave();
      }, 500);
    }
    else {
      client.send('password-accepted');

      this.state.players.set(client.sessionId, new Player(client.sessionId, options.username));
    
      // assume only 2 players will join for now
      if (this.state.players.size === 2) {
        this.startRound();
      }
    }
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }
}
