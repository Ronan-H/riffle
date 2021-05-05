import { Room, Client } from "colyseus";
import { GameState, Card, Player } from "./schema/MyRoomState";

export class MyRoom extends Room {

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

      const common = this.state.commonCards.cards;
      const hand = this.state.players.get(client.sessionId).cards.cards;

      // perform the swap
      const temp = common[commonIndex];
      common[commonIndex] = hand[handIndex];
      hand[handIndex] = temp;
    });

    // this.setSimulationInterval(() => this.state.update());
  }

  private startRound() {
    this.state.deck.shuffle();
    this.deal();
  }

  private deal(): void {
    for (let i = 0; i < 5; i++) {
      this.state.commonCards.cards.push(this.state.deck.cards.pop());
    }

    this.state.players.forEach((player: Player) => {
      for (let i = 0; i < 5; i++) {
        player.cards.cards.push(this.state.deck.cards.pop());
      }
    });
  }

  onJoin (client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    this.startRound();
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }
}
