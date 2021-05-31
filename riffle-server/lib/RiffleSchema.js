"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiffleState = exports.ShowdownResult = exports.Player = exports.Card = exports.GameConstants = exports.GameView = void 0;
const schema_1 = require("@colyseus/schema");
var GameView;
(function (GameView) {
    GameView[GameView["GameLobby"] = 0] = "GameLobby";
    GameView[GameView["Swapping"] = 1] = "Swapping";
    GameView[GameView["Showdown"] = 2] = "Showdown";
})(GameView = exports.GameView || (exports.GameView = {}));
exports.GameConstants = {
    roundTimeMS: 30 * 1000,
};
class Card extends schema_1.Schema {
    constructor(num, suit) {
        super();
        this.num = 0;
        this.suit = 0;
        this.num = num;
        this.suit = suit;
    }
    // converts to format compatible with pokersolver library
    // E.g. [num=1, suit=0] -> Ace of Spades -> 'As'
    asPokersolverString() {
        const suit = {
            0: 'c',
            1: 'd',
            2: 'h',
            3: 's'
        }[this.suit];
        let num;
        switch (this.num) {
            case 1:
                num = 'A';
                break;
            case 10:
                num = 'T';
                break;
            case 11:
                num = 'J';
                break;
            case 12:
                num = 'Q';
                break;
            case 13:
                num = 'K';
                break;
            default:
                num = this.num.toString();
        }
        return num.concat(suit);
    }
}
__decorate([
    schema_1.type('uint8')
], Card.prototype, "num", void 0);
__decorate([
    schema_1.type('uint8')
], Card.prototype, "suit", void 0);
exports.Card = Card;
class Player extends schema_1.Schema {
    constructor(id, name, isHost) {
        super();
        this.cards = new schema_1.ArraySchema();
        this.score = 0;
        this.votedNextRound = false;
        this.isHost = false;
        this.id = id;
        this.name = name;
        this.isHost = isHost;
    }
}
__decorate([
    schema_1.type('string')
], Player.prototype, "id", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "name", void 0);
__decorate([
    schema_1.type([Card])
], Player.prototype, "cards", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "currentHandDesc", void 0);
__decorate([
    schema_1.type('number')
], Player.prototype, "currentHandScore", void 0);
__decorate([
    schema_1.type('boolean')
], Player.prototype, "isCurrentlyWinning", void 0);
__decorate([
    schema_1.type('uint16')
], Player.prototype, "score", void 0);
__decorate([
    schema_1.type('boolean')
], Player.prototype, "votedNextRound", void 0);
__decorate([
    schema_1.type('boolean')
], Player.prototype, "isHost", void 0);
exports.Player = Player;
class ShowdownResult extends schema_1.Schema {
    constructor(playerId, playerName, hand, handScore, totalScore, isWinningHand) {
        super();
        this.playerId = playerId;
        this.playerName = playerName;
        this.hand = hand;
        this.handScore = handScore;
        this.totalScore = totalScore;
        this.isWinningHand = isWinningHand;
    }
}
__decorate([
    schema_1.type('string')
], ShowdownResult.prototype, "playerId", void 0);
__decorate([
    schema_1.type('string')
], ShowdownResult.prototype, "playerName", void 0);
__decorate([
    schema_1.type('string')
], ShowdownResult.prototype, "hand", void 0);
__decorate([
    schema_1.type('uint16')
], ShowdownResult.prototype, "handScore", void 0);
__decorate([
    schema_1.type('uint16')
], ShowdownResult.prototype, "totalScore", void 0);
__decorate([
    schema_1.type('boolean')
], ShowdownResult.prototype, "isWinningHand", void 0);
exports.ShowdownResult = ShowdownResult;
class RiffleState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.commonCards = new schema_1.ArraySchema();
    }
}
__decorate([
    schema_1.type('uint8')
], RiffleState.prototype, "gameView", void 0);
__decorate([
    schema_1.type({ map: Player })
], RiffleState.prototype, "players", void 0);
__decorate([
    schema_1.type([Card])
], RiffleState.prototype, "commonCards", void 0);
__decorate([
    schema_1.type([Card])
], RiffleState.prototype, "deck", void 0);
__decorate([
    schema_1.type([ShowdownResult])
], RiffleState.prototype, "showdownResults", void 0);
__decorate([
    schema_1.type('uint8')
], RiffleState.prototype, "numVotedNextRound", void 0);
__decorate([
    schema_1.type('uint8')
], RiffleState.prototype, "nextRoundVotesRequired", void 0);
exports.RiffleState = RiffleState;
