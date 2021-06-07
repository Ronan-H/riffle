"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiffleRoom = void 0;
const colyseus_1 = require("colyseus");
const RiffleSchema_1 = require("./RiffleSchema");
const schema_1 = require("@colyseus/schema");
const hand_odds_1 = require("./hand-odds");
var Hand = require('pokersolver').Hand;
class RiffleRoom extends colyseus_1.Room {
    generateRandomPasscode(length) {
        return new Array(length).fill(0).map(() => Math.floor(Math.random() * 10).toString()).join('');
    }
    onCreate(options) {
        this.setPatchRate(1000);
        // ensure clock timers are enabled
        this.setSimulationInterval(() => { });
        this.clock.setInterval(() => {
            if (this.isStateDirty) {
                this.broadcastPatch();
                this.isStateDirty = false;
            }
        }, 50);
        this.setMetadata(Object.assign(Object.assign(Object.assign({}, this.metadata), options), { passcode: this.generateRandomPasscode(4) }));
        this.setState(new RiffleSchema_1.RiffleState());
        this.updateGameView(RiffleSchema_1.GameView.GameLobby);
        this.onMessage('start-game', (client) => {
            if (this.state.gameView === RiffleSchema_1.GameView.GameLobby &&
                this.state.players.get(client.sessionId).isHost) {
                this.startRound();
            }
        });
        this.onMessage('swap-cards', (client, message) => {
            const commonIndex = message.commonIndex;
            const handIndex = message.handIndex;
            this.broadcast('common-index-swapped', commonIndex);
            const player = this.state.players.get(client.sessionId);
            const common = this.state.commonCards;
            const hand = player.cards;
            // perform the swap
            const temp = common[commonIndex];
            common[commonIndex] = hand[handIndex];
            hand[handIndex] = temp;
            this.updateCurrentHand(player);
            this.syncClientState();
        });
        this.onMessage('next-round-vote', (client) => {
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
        this.onMessage('sort-hand', (client) => {
            this.sortPlayersHand(this.state.players.get(client.id));
            this.syncClientState();
        });
    }
    syncClientState() {
        this.isStateDirty = true;
    }
    startRound() {
        this.resetCards();
        this.populateDeck();
        this.shuffle(this.state.deck);
        this.deal();
        this.state.players.forEach(this.updateCurrentHand.bind(this));
        this.state.players.forEach(this.sortPlayersHand.bind(this));
        this.updateGameView(RiffleSchema_1.GameView.Swapping);
        this.syncClientState();
        this.state.roundTimeRemainingMS = RiffleSchema_1.GameConstants.roundTimeMS;
        this.showdownInterval = setInterval(() => {
            this.state.roundTimeRemainingMS -= 1000;
            if (this.state.roundTimeRemainingMS <= 0) {
                clearTimeout(this.showdownInterval);
                this.updateGameView(RiffleSchema_1.GameView.Showdown);
                this.startShowdown();
            }
            else {
                this.syncClientState();
            }
        }, 1000);
    }
    updateGameView(nextGameView) {
        this.state.gameView = nextGameView;
        this.syncClientState();
    }
    sortPlayersHand(player) {
        player.cards = player.cards.sort((a, b) => a.num - b.num);
    }
    updateCurrentHand(player) {
        const hand = Hand.solve(player.cards.map(card => card.asPokersolverString()));
        player.currentHandDesc = hand.descr;
        player.currentHandScore = this.getScoreForHand(hand);
        this.state.players.forEach((player) => {
            player.isCurrentlyWinning = (this.solveHands().winnerHand.player.id === player.id);
        });
    }
    getScoreForHand(hand) {
        const modifier = 2;
        return Math.round(hand_odds_1.HandOdds[hand.rank] * modifier);
    }
    populateDeck() {
        for (let suit = 0; suit < 4; suit++) {
            for (let num = 1; num <= 13; num++) {
                this.state.deck.push(new RiffleSchema_1.Card(num, suit));
            }
        }
    }
    resetCards() {
        this.state.deck = new schema_1.ArraySchema();
        this.state.commonCards = new schema_1.ArraySchema();
        this.state.players.forEach(player => {
            player.cards = new schema_1.ArraySchema();
        });
    }
    shuffle(cards) {
        // Fisher–Yates shuffle -- https://bost.ocks.org/mike/shuffle/
        let m = cards.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = cards[m];
            cards[m] = cards[i];
            cards[i] = t;
        }
    }
    dealHand(player) {
        for (let i = 0; i < 5; i++) {
            player.cards.push(this.state.deck.pop());
        }
    }
    deal() {
        for (let i = 0; i < 5; i++) {
            this.state.commonCards.push(this.state.deck.pop());
        }
        this.state.players.forEach((player) => {
            this.dealHand(player);
        });
    }
    solveHands() {
        const playerHands = [];
        this.state.players.forEach(player => {
            const hand = Hand.solve(player.cards.map(card => card.asPokersolverString()));
            // store the player reference in the hand object, so we can tell which player has won
            // just from the returned hand object from calling Hand.winners(...)
            hand.player = player;
            playerHands.push(hand);
        });
        // find winning hand
        let winnerHand = Hand.winners(playerHands);
        if (winnerHand.length > 1) {
            // it's a tie!
            this.broadcast('debug', 'Showdown tie between ' + winnerHand.length + ' players');
            // TODO: handle ties properly, just picking a random player for now
            const randomWinnerIndex = Math.floor(Math.random() * winnerHand.length);
            this.broadcast('debug', '...randomly chose hand at index ' + randomWinnerIndex + ' as the winner');
            winnerHand = winnerHand[randomWinnerIndex];
        }
        else {
            winnerHand = winnerHand[0];
        }
        return {
            playerHands,
            winnerHand
        };
    }
    startShowdown() {
        const { playerHands, winnerHand } = this.solveHands();
        const player = winnerHand.player;
        const handScore = this.getScoreForHand(winnerHand);
        player.score += handScore;
        winnerHand.score = handScore;
        // populate round results
        const showdownSeq = [];
        this.state.players.forEach(player => {
            // TODO optimise this
            const hand = playerHands.find(hand => hand.player.id === player.id);
            showdownSeq.push(new RiffleSchema_1.ShowdownResult(player.id, player.name, hand.descr, hand.score, player.score, player.id === winnerHand.player.id));
        });
        showdownSeq.sort((a, b) => b.totalScore - a.totalScore);
        this.state.showdownResults = showdownSeq;
        this.state.numVotedNextRound = 0;
        this.state.players.forEach(player => {
            player.votedNextRound = false;
        });
        this.calcNextRoundVotesRequired();
        this.syncClientState();
    }
    calcNextRoundVotesRequired() {
        this.state.nextRoundVotesRequired = (Math.floor(this.state.players.size / 2) + 1);
    }
    onJoin(client, options) {
        // validate passcode
        if (this.state.players.size > 0 && options.passcode !== this.metadata.passcode) {
            // server error if leave() is called straight away
            this.rejectTimeout = setTimeout(() => {
                client.send('passcode-rejected');
                client.leave();
            }, 1000);
        }
        else {
            client.send('passcode-accepted');
            client.send('passcode', this.metadata.passcode);
            const player = new RiffleSchema_1.Player(client.sessionId, options.username, this.state.players.size === 0);
            this.state.players.set(client.sessionId, player);
            if (this.state.gameView === RiffleSchema_1.GameView.Swapping) {
                this.dealHand(player);
                this.updateCurrentHand(player);
            }
            else if (this.state.gameView === RiffleSchema_1.GameView.Showdown) {
                this.calcNextRoundVotesRequired();
            }
            this.syncClientState();
        }
    }
    onLeave(client, consented) {
        const playerId = client.sessionId;
        const wasHost = this.state.players.get(playerId).isHost;
        this.deletePlayer(playerId);
        if (wasHost && this.state.players.size > 0) {
            // transfer host status to the next player
            const nextHost = this.state.players.values().next().value;
            nextHost.isHost = true;
        }
        this.syncClientState();
    }
    deletePlayer(playerId) {
        this.state.players.delete(playerId);
        if (this.state.gameView === RiffleSchema_1.GameView.Showdown) {
            // delete player's showdown result
            this.state.showdownResults = this.state.showdownResults.filter((result) => result.playerId !== playerId);
            // recalculate next round votes
            this.calcNextRoundVotesRequired();
            this.state.numVotedNextRound = 0;
            this.state.players.forEach((player) => {
                if (player.votedNextRound) {
                    this.state.numVotedNextRound++;
                }
            });
        }
        else if (this.state.gameView === RiffleSchema_1.GameView.Swapping) {
            this.state.players.forEach(this.updateCurrentHand.bind(this));
        }
    }
    clearTimers() {
        if (this.rejectTimeout)
            clearTimeout(this.rejectTimeout);
        if (this.showdownInterval)
            clearTimeout(this.showdownInterval);
    }
    onDispose() {
        this.clearTimers();
    }
}
exports.RiffleRoom = RiffleRoom;
