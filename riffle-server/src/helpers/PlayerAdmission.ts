import { GameView, Player, RiffleState, ShowdownResult } from "../RiffleSchema";
import { Client } from "colyseus";
import { RiffleRoom } from "../RiffleRoom";
import { DeckManager } from "./DeckManager";
import { ScoringManager } from "./ScoringManager";
import * as Utils from "./Utils";

export class PlayerAdmission {
  private room: RiffleRoom;
  private state: RiffleState;
  private deckManager: DeckManager;
  private scoringManager: ScoringManager;

  private roundStartTimeMS: number;
  private rejectTimeout: NodeJS.Timeout;

  private remainingColours: Array<string>;

  constructor(
    room: RiffleRoom,
    state: RiffleState,
    deckManager: DeckManager,
    scoringManager: ScoringManager
  ) {
    this.room = room;
    this.state = state;
    this.deckManager = deckManager;
    this.scoringManager = scoringManager;

    this.remainingColours = this.generateRandomisedColourStack();
  }

  public onJoin(client: Client, options: any): void {
    // validate passcode
    if (
      this.state.players.size > 0 &&
      options.passcode !== this.room.metadata.passcode
    ) {
      // server error if leave() is called straight away
      this.rejectTimeout = setTimeout(() => {
        client.send("passcode-rejected");
        client.leave();
      }, 1000);
    } else {
      client.send("passcode-accepted");
      client.send("passcode", this.room.metadata.passcode);

      const player = new Player(
        client.sessionId,
        options.username,
        this.getNextPlayerColour(),
        this.state.players.size === 0
      );
      this.state.players.set(client.sessionId, player);

      if (this.state.gameView === GameView.Swapping) {
        this.deckManager.dealHand(player);
        this.scoringManager.updateCurrentHand(player);

        client.send(
          "round-time-elapsed-ms",
          Date.now() - this.roundStartTimeMS
        );
      } else if (this.state.gameView === GameView.Showdown) {
        this.room.calcNextRoundVotesRequired();
      }
    }
  }

  public onLeave(client: Client, consented: boolean): void {
    const playerId = client.sessionId;
    const player = this.state.players.get(playerId)
    const wasHost = player.isHost;

    this.deletePlayer(player);

    if (wasHost && this.state.players.size > 0) {
      // transfer host status to the next player
      const nextHost = this.state.players.values().next().value as Player;
      nextHost.isHost = true;
    }
  }

  private deletePlayer(player: Player): void {
    this.state.players.delete(player.id);

    // add player's colour back to the stack
    this.remainingColours.unshift(player.colour);

    if (
      this.state.gameView === GameView.Showdown &&
      this.state.roundsRemaining > 0
    ) {
      // delete player's showdown results
      const removePlayerFilter = (result: ShowdownResult) =>
        result.playerId !== player.id;
      this.state.handResults =
        this.state.handResults.filter(removePlayerFilter);
      this.state.leaderboardResults =
        this.state.handResults.filter(removePlayerFilter);

      // recalculate next round votes
      this.room.calcNextRoundVotesRequired();
      this.state.numVotedNextRound = 0;
      this.state.players.forEach((player) => {
        if (player.votedNextRound) {
          this.state.numVotedNextRound++;
        }
      });

      this.room.startNextRoundIfEnoughVotes();
    } else if (this.state.gameView === GameView.Swapping) {
      this.state.players.forEach(player => this.scoringManager.updateCurrentHand(player));
      this.deckManager.addPlayerCardsBackToDeck(player);
    }
  }

  private generateRandomisedColourStack(): Array<string> {
    return Utils.shuffleInPlace([
      '#ff0000', // red
      '#ffa500', // orange
      '#00f000', // green
      '#0000ff', // blue
      '#4b0082', // indifo
      '#ee82ee', // violet
      '#666666', // gray
      '#000000', // black
    ]);
  }

  private getNextPlayerColour(): string {
    return this.remainingColours.pop();
  }

  public onRoundStart(): void {
    this.roundStartTimeMS = Date.now();
  }

  private clearTimers(): void {
    if (this.rejectTimeout) clearTimeout(this.rejectTimeout);
  }

  public onDispose(): void {
    this.clearTimers();
  }
}
