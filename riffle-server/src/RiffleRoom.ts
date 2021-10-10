import { Room, Client } from "colyseus";
import {
  RiffleState,
  GameView,
  GameConstants,
} from "./RiffleSchema";
import { DeckManager } from "./helpers/DeckManager";
import { ScoringManager } from "./helpers/ScoringManager";
import { MessageHandler } from "./helpers/MessageHandler";
import { PlayerAdmission } from "./helpers/PlayerAdmission";

export class RiffleRoom extends Room<RiffleState> {
  // this can be set to true to indicate that a patch of the state
  // should be sent to each client during the next clock interval
  private isStateDirty: boolean;
  private showdownInterval: NodeJS.Timeout;

  private deckManager: DeckManager;
  private scoringManager: ScoringManager;
  private messageHandler: MessageHandler;
  private playerAdmission: PlayerAdmission;

  onCreate(options: any) {
    this.setPatchRate(1000);

    // ensure clock timers are enabled
    this.setSimulationInterval(() => {});

    this.clock.setInterval(() => {
      if (this.isStateDirty) {
        this.broadcastPatch();
        this.isStateDirty = false;
      }
    }, 50);

    this.maxClients = GameConstants.maxGamePlayers;

    this.setMetadata({
      ...this.metadata,
      ...options,
      passcode: this.generateRandomPasscode(4),
      createdBy: options.username,
    });

    this.setState(new RiffleState());
    // copy room metadata into the state
    this.state.roomName = this.metadata.roomName;

    // init helper objects
    this.deckManager = new DeckManager(this.state);
    this.scoringManager = new ScoringManager(this.state);
    this.playerAdmission = new PlayerAdmission(
      this,
      this.state,
      this.deckManager,
      this.scoringManager
    );
    this.messageHandler = new MessageHandler(
      this,
      this.state,
      this.deckManager,
      this.scoringManager
    );
    this.messageHandler.registerCallbacks();

    this.updateGameView(GameView.GameLobby);
  }

  onJoin(client: Client, options: any) {
    this.playerAdmission.onJoin(client, options);
    this.syncClientState();
  }

  onLeave(client: Client, consented: boolean) {
    this.playerAdmission.onLeave(client, consented);
    this.syncClientState();
  }

  public startRound() {
    ++this.state.roundNum;
    --this.state.roundsRemaining;

    this.deckManager.resetAndDeal();

    this.state.players.forEach(player => this.scoringManager.updateCurrentHand(player));
    this.state.players.forEach(player => this.deckManager.sortPlayersHand(player));

    this.updateGameView(GameView.Swapping);
    this.playerAdmission.onRoundStart();

    this.syncClientState();

    this.showdownInterval = setTimeout(() => {
      clearTimeout(this.showdownInterval);
      this.scoringManager.generateShowdownResults();
      this.calcNextRoundVotesRequired();
      this.clearSelectedPlayerCards();
      this.updateGameView(GameView.Showdown);
      this.syncClientState();
    }, GameConstants.roundTimeMS);
  }

  public calcNextRoundVotesRequired(): void {
    this.state.nextRoundVotesRequired =
      Math.floor(this.state.players.size / 2) + 1;
  }

  private clearSelectedPlayerCards(): void {
    this.state.players.forEach(player => {
      player.selectedCommonIndex = -1;
    });
  }

  public startNextRoundIfEnoughVotes(): void {
    if (this.state.numVotedNextRound >= this.state.nextRoundVotesRequired) {
      this.startRound();
    }
  }

  private updateGameView(nextGameView: GameView): void {
    this.state.gameView = nextGameView;
    this.syncClientState();
  }

  private generateRandomPasscode(length: number): string {
    return new Array(length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10).toString())
      .join("");
  }

  public syncClientState(): void {
    this.isStateDirty = true;
  }

  private clearTimers(): void {
    if (this.showdownInterval) clearTimeout(this.showdownInterval);
  }

  onDispose() {
    this.playerAdmission.onDispose();
    this.clearTimers();
  }
}
