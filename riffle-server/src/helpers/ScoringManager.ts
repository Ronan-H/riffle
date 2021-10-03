import { Player, RiffleState, ShowdownResult } from "../RiffleSchema";
import { BaseHandScores } from "../BaseHandScores";
import { ArraySchema } from "@colyseus/schema";

var Hand = require("pokersolver").Hand;

export class ScoringManager {
  private state: RiffleState;

  constructor(state: RiffleState) {
    this.state = state;
  }

  public getScoreForHand(hand: any): number {
    return Math.round(BaseHandScores[hand.rank]);
  }

  public solveHands(): {
    playerHands: any[];
    winnerHand: any;
  } {
    const playerHands: any[] = [];
    this.state.players.forEach((player) => {
      const hand = Hand.solve(
        player.cards.map((card) => card.asPokersolverString())
      );
      // store the player reference in the hand object, so we can tell which player has won
      // just from the returned hand object from calling Hand.winners(...)
      hand.player = player;
      playerHands.push(hand);
    });

    // find winning hand
    let winnerHand = Hand.winners(playerHands);
    if (winnerHand.length > 1) {
      // TODO: handle ties properly, just picking a random player for now
      const randomWinnerIndex = Math.floor(Math.random() * winnerHand.length);
      winnerHand = winnerHand[randomWinnerIndex];
    } else {
      winnerHand = winnerHand[0];
    }

    return {
      playerHands,
      winnerHand,
    };
  }

  public updateCurrentHand(player: Player): void {
    const hand = Hand.solve(
      player.cards.map((card) => card.asPokersolverString())
    );
    player.currentHandDesc = hand.descr;
    player.currentHandScore = this.getScoreForHand(hand);

    this.state.players.forEach((player) => {
      player.isCurrentlyWinning =
        this.solveHands().winnerHand.player.id === player.id;
    });
  }

  public generateShowdownResults(): void {
    const { playerHands, winnerHand } = this.solveHands();

    const player = winnerHand.player as Player;
    const handScore = this.getScoreForHand(winnerHand);
    player.score += handScore;
    winnerHand.score = handScore;

    // populate round results
    const leaderboardResults: ShowdownResult[] = [];
    const handResults: ShowdownResult[] = [];
    this.state.players.forEach((player) => {
      // TODO optimise this
      const hand = playerHands.find((hand) => hand.player.id === player.id);
      const result = new ShowdownResult(
        player.id,
        player.name,
        hand.descr,
        this.getScoreForHand(hand),
        player.score,
        player.id === winnerHand.player.id
      );
      leaderboardResults.push(result);
      handResults.push(result);
    });

    leaderboardResults.sort((a, b) => b.totalScore - a.totalScore);
    handResults.sort((a, b) => b.handScore - a.handScore);
    this.state.leaderboardResults = leaderboardResults;
    this.state.handResults = handResults;

    if (this.state.roundsRemaining > 0) {
      // prepare for next round
      this.state.numVotedNextRound = 0;
      this.state.players.forEach((player) => {
        player.votedNextRound = false;
      });
    } else {
      // game over, record winner(s)
      this.state.gameWinners = new ArraySchema<string>();
      const highestScore = leaderboardResults[0].totalScore;
      for (
        let i = 0;
        i < leaderboardResults.length &&
        leaderboardResults[i].totalScore === highestScore;
        ++i
      ) {
        this.state.gameWinners.push(leaderboardResults[i].playerName);
      }
    }
  }

}
