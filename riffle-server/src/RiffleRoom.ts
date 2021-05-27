import { Room, Client } from "colyseus";
import { RiffleState, Card, Player, GameView, GameConstants, ShowdownResult } from "./RiffleSchema";
import { ArraySchema } from "@colyseus/schema";
var Hand = require('pokersolver').Hand;

export class RiffleRoom extends Room<RiffleState> {
  // this can be set to true to indicate that a patch of the state
  // should be sent to each client during the next clock interval
  private isStateDirty: boolean;

  onCreate (options: any) {
    // disable automatic patches
    this.setPatchRate(null);

    // ensure clock timers are enabled
    this.setSimulationInterval(() => {});

    this.clock.setInterval(() => {
        if (this.isStateDirty) {
            this.broadcastPatch();
            this.isStateDirty = false;
        }
    }, 100);

    this.setMetadata({
      ...this.metadata,
      ...options
    });

    this.setState(new RiffleState());

    this.onMessage('swap-cards', (client, message) => {
      const commonIndex: number = message.commonIndex;
      const handIndex: number = message.handIndex;

      this.broadcast('common-index-swapped', commonIndex);

      const common = this.state.commonCards;
      const hand = this.state.players.get(client.sessionId).cards;

      // perform the swap
      const temp = common[commonIndex];
      common[commonIndex] = hand[handIndex];
      hand[handIndex] = temp;

      this.syncClientState();
    });

    this.onMessage('next-round-vote', (client, message) => {
      if (!this.state.players.get(client.sessionId).votedNextRound) {
        this.state.players.get(client.sessionId).votedNextRound = true;
        this.state.numVotedNextRound++;
        this.syncClientState();

        if (this.state.numVotedNextRound >= this.state.nextRoundVotesRequired) {
          // enough players voted to continue; start new round
          this.startRound();
        }
      }
    });
  }

  private syncClientState(): void {
    this.isStateDirty = true;
  }

  private startRound() {
    this.resetCards();
    this.populateDeck();
    this.shuffle(this.state.deck);
    this.deal();

    this.updateGameView(GameView.Swapping);

    this.syncClientState();

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

  private shuffle(cards: ArraySchema<Card>): void {
    // Fisher–Yates shuffle -- https://bost.ocks.org/mike/shuffle/
    let m = cards.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      t = cards[m];
      cards[m] = cards[i];
      cards[i] = t;
    }
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
    // solve hands
    const playerHands: any[] = [];
    this.state.players.forEach(player => {
      const hand = Hand.solve(player.cards.map(card => card.asPokersolverString()));
      // store the player reference in the hand object, so we can tell which player has won
      // just from the returned hand object from calling Hand.winners(...)
      hand.player = player;
      playerHands.push(hand);
    });

    const scoreModifier = (rank: number) => Math.pow(rank, 2);

    playerHands.forEach((hand) => {
      const player = hand.player as Player;
      const handScore = scoreModifier(hand.rank);
      player.score += handScore;
      hand.score = handScore;
    });

    // populate round results
    const showdownSeq: ShowdownResult[] = [];
    this.state.players.forEach(player => {
      // TODO optimise this
      const hand = playerHands.find(hand => hand.player.id === player.id);
      showdownSeq.push(new ShowdownResult(player.id, player.name, hand.descr, hand.score, player.score));
    });

    showdownSeq.sort((a, b) => b.totalScore - a.totalScore);
    this.state.showdownResults = showdownSeq;

    this.state.numVotedNextRound = 0;
    this.state.players.forEach(player => {
      player.votedNextRound = false;
    });
    this.state.nextRoundVotesRequired = (Math.floor(this.state.players.size / 2) + 1);

    this.syncClientState();
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
      this.syncClientState();

      // TODO remove this temporary hack to take the room capacity from the last digit of the password
      const roomCapacity = parseInt(this.metadata.password[this.metadata.password.length - 1]);

      if (this.state.players.size === roomCapacity) {
        this.startRound();
      }
    }
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }
}
