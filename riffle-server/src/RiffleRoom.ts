import { Room, Client } from "colyseus";
import { GameState, Card, Player, GameView } from "./RiffleSchema";
import { ArraySchema } from "@colyseus/schema";

export class RiffleRoom extends Room {

  onCreate (options: any) {
    // this.setPrivate();

    this.setState(new GameState());

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
  }

  private startRound() {
    this.state.gameView = GameView.Swapping;
    this.populateDeck();
    this.state.deck = this.shuffle(this.state.deck);
    this.deal();

    this.broadcast('game-view-changed', this.state.gameView);
  }

  private populateDeck(): void {
    for (let suit = 0; suit < 4; suit++) {
      for (let num = 1; num <= 13; num++) {
        this.state.deck.push(new Card(num, suit));
      }
    }
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

  onJoin (client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    
    // assume only 2 players will join for now
    if (this.state.players.size === 1) {
      this.startRound();
    }
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }
}
