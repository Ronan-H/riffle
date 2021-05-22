"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiffleRoom = void 0;
const colyseus_1 = require("colyseus");
const RiffleSchema_1 = require("./RiffleSchema");
const schema_1 = require("@colyseus/schema");
var Hand = require('pokersolver').Hand;
class RiffleRoom extends colyseus_1.Room {
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
        this.setMetadata(Object.assign(Object.assign({}, this.metadata), options));
        this.setState(new RiffleSchema_1.RiffleState());
        this.onMessage('swap-cards', (client, message) => {
            const commonIndex = message.commonIndex;
            const handIndex = message.handIndex;
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
        // build showdown sequence
        const showdownSeq = [];
        const playerHands = [];
        this.state.players.forEach(player => {
            const hand = Hand.solve(player.cards.map(card => card.asPokersolverString()));
            // store the player reference in the hand object, so we can tell which player has won
            // just from the returned hand object from calling Hand.winners(...)
            hand.player = player;
            showdownSeq.push(new RiffleSchema_1.ShowdownResult(player.id, player.name, hand.descr, hand.rank));
            playerHands.push(hand);
        });
        // find showndown winner
        let winnerHand = Hand.winners(playerHands);
        if (winnerHand.length > 1) {
            // it's a tie!
            // TODO: handle ties properly, just picking a random player for now
            const randomWinnerIndex = Math.floor(Math.random() * winnerHand.length);
            winnerHand = winnerHand[randomWinnerIndex];
        }
        else {
            winnerHand = winnerHand[0];
        }
        this.state.showdownWinner = winnerHand.player.name;
        showdownSeq.sort((a, b) => b.rank - a.rank);
        this.state.showdownResults = showdownSeq;
        this.state.numVotedNextRound = 0;
        this.state.players.forEach(player => {
            player.votedNextRound = false;
        });
        this.state.nextRoundVotesRequired = (Math.floor(this.state.players.size / 2) + 1);
        this.syncClientState();
    }
    onJoin(client, options) {
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
            this.state.players.set(client.sessionId, new RiffleSchema_1.Player(client.sessionId, options.username));
            this.syncClientState();
            // TODO remove this temporary hack to take the room capacity from the last digit of the password
            const roomCapacity = parseInt(this.metadata.password[this.metadata.password.length - 1]);
            if (this.state.players.size === roomCapacity) {
                this.startRound();
            }
        }
    }
    onLeave(client, consented) {
    }
    onDispose() {
    }
}
exports.RiffleRoom = RiffleRoom;
