"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiffleRoom = void 0;
const colyseus_1 = require("colyseus");
const RiffleSchema_1 = require("./RiffleSchema");
const schema_1 = require("@colyseus/schema");
var Hand = require('pokersolver').Hand;
class RiffleRoom extends colyseus_1.Room {
    generateRandomPasscode(length) {
        return new Array(length).fill(0).map(() => Math.floor(Math.random() * 10).toString()).join('');
    }
    onCreate(options) {
        // disable automatic patches
        this.setPatchRate(null);
        // ensure clock timers are enabled
        this.setSimulationInterval(() => { });
        this.clock.setInterval(() => {
            if (this.isStateDirty) {
                this.broadcastPatch();
                this.isStateDirty = false;
            }
        }, 100);
        this.setMetadata(Object.assign(Object.assign(Object.assign({}, this.metadata), options), { passcode: this.generateRandomPasscode(6) }));
        this.setState(new RiffleSchema_1.RiffleState());
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
    syncClientState() {
        this.isStateDirty = true;
    }
    startRound() {
        this.resetCards();
        this.populateDeck();
        this.shuffle(this.state.deck);
        this.deal();
        this.updateGameView(RiffleSchema_1.GameView.Swapping);
        this.syncClientState();
        setTimeout(() => {
            this.updateGameView(RiffleSchema_1.GameView.Showdown);
            this.startShowdown();
        }, RiffleSchema_1.GameConstants.roundTimeMS);
    }
    updateGameView(nextGameView) {
        this.state.gameView = nextGameView;
        this.broadcast('game-view-changed', nextGameView);
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
    deal() {
        for (let i = 0; i < 5; i++) {
            this.state.commonCards.push(this.state.deck.pop());
        }
        this.state.players.forEach((player) => {
            for (let i = 0; i < 5; i++) {
                player.cards.push(this.state.deck.pop());
            }
        });
    }
    startShowdown() {
        // solve hands
        const playerHands = [];
        this.state.players.forEach(player => {
            const hand = Hand.solve(player.cards.map(card => card.asPokersolverString()));
            // store the player reference in the hand object, so we can tell which player has won
            // just from the returned hand object from calling Hand.winners(...)
            hand.player = player;
            playerHands.push(hand);
        });
        const scoreModifier = (rank) => Math.pow(rank, 2);
        playerHands.forEach((hand) => {
            const player = hand.player;
            const handScore = scoreModifier(hand.rank);
            player.score += handScore;
            hand.score = handScore;
        });
        // populate round results
        const showdownSeq = [];
        this.state.players.forEach(player => {
            // TODO optimise this
            const hand = playerHands.find(hand => hand.player.id === player.id);
            showdownSeq.push(new RiffleSchema_1.ShowdownResult(player.id, player.name, hand.descr, hand.score, player.score));
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
    onJoin(client, options) {
        // validate passcode
        if (this.state.players.size > 0 && options.passcode !== this.metadata.passcode) {
            client.send('passcode-rejected');
            // server error if leave() is called straight away
            setTimeout(() => {
                client.leave();
            }, 500);
        }
        else {
            client.send('passcode-accepted');
            client.send('passcode', this.metadata.passcode);
            const player = new RiffleSchema_1.Player(client.sessionId, options.username, this.state.players.size === 0);
            this.state.players.set(client.sessionId, player);
            this.syncClientState();
            this.updateGameView(RiffleSchema_1.GameView.GameLobby);
        }
    }
    onLeave(client, consented) {
    }
    onDispose() {
    }
}
exports.RiffleRoom = RiffleRoom;
