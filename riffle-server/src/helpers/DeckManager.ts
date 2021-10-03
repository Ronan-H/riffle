import { Card, Player, RiffleState } from "../RiffleSchema";
import { ArraySchema } from "@colyseus/schema";
import * as Utils from "./Utils";

export class DeckManager {
  private state: RiffleState;

  constructor(state: RiffleState) {
    this.state = state;
  }

  public resetAndDeal(): void {
    this.resetCards();
    this.populateDeck();
    Utils.shuffleInPlace(this.state.deck);
    this.deal();
  }

  public dealHand(player: Player): void {
    for (let i = 0; i < 5; i++) {
      player.cards.push(this.state.deck.pop());
    }
  }

  public sortPlayersHand(player: Player): void {
    player.cards = player.cards.sort((a, b) => a.num - b.num);
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
    this.state.players.forEach((player) => {
      player.cards = new ArraySchema<Card>();
    });
  }

  private deal(): void {
    for (let i = 0; i < 5; i++) {
      this.state.commonCards.push(this.state.deck.pop());
    }

    this.state.players.forEach((player: Player) => {
      this.dealHand(player);
    });
  }
  
}
