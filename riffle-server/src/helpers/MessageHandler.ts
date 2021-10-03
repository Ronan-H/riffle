import { DeckManager } from "./DeckManager";
import { RiffleRoom } from "../RiffleRoom";
import { GameView, RiffleState, RoundOptions } from "../RiffleSchema";
import { ScoringManager } from "./ScoringManager";

export class MessageHandler {
  private room: RiffleRoom;
  private state: RiffleState;
  private deckManager: DeckManager;
  private scoringManager: ScoringManager;

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
  }

  public registerCallbacks(): void {
    this.room.onMessage("start-game", (client) => {
      if (
        this.state.gameView === GameView.GameLobby &&
        this.state.players.get(client.sessionId).isHost
      ) {
        this.state.roundNum = 0;
        this.state.roundsRemaining = this.state.roundOptions.numRounds;

        this.room.startRound();
      }
    });

    this.room.onMessage("swap-cards", (client, message) => {
      const commonIndex: number = message.commonIndex;
      const handIndex: number = message.handIndex;

      const player = this.state.players.get(client.sessionId);
      const common = this.state.commonCards;
      const hand = player.cards;

      // perform the swap
      const temp = common[commonIndex];
      common[commonIndex] = hand[handIndex];
      hand[handIndex] = temp;

      this.scoringManager.updateCurrentHand(player);

      this.room.syncClientState();
    });

    this.room.onMessage("next-round-vote", (client) => {
      if (!this.state.players.get(client.sessionId).votedNextRound) {
        this.state.players.get(client.sessionId).votedNextRound = true;
        this.state.numVotedNextRound++;
        this.room.syncClientState();

        this.room.startNextRoundIfEnoughVotes();
      }
    });

    this.room.onMessage("sort-hand", (client) => {
      this.deckManager.sortPlayersHand(this.state.players.get(client.id));
      this.room.syncClientState();
    });

    this.room.onMessage(
      "update-round-options",
      (client, roundOptions: Partial<RoundOptions>) => {
        const isHost = this.state.players.get(client.sessionId).isHost;
        if (!isHost) {
          return;
        }

        this.state.roundOptions = new RoundOptions(roundOptions.numRounds);

        this.room.syncClientState();
      }
    );
  }
}
