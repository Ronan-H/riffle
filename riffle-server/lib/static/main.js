(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\Ronan\code\riffle\riffle-client\src\main.ts */"zUnb");


/***/ }),

/***/ "5nS4":
/*!*************************************!*\
  !*** ./src/app/resource.service.ts ***!
  \*************************************/
/*! exports provided: ResourceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResourceService", function() { return ResourceService; });
/* harmony import */ var src_data_card_spritesheet_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/data/card-spritesheet-map */ "c7vj");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");


class ResourceService {
    constructor() {
        this.spritesheet = new Image();
        this.spritesheet.src = 'assets/playingCards.png';
    }
    getCardSpritesheetMedata(card) {
        const suit = {
            0: 'Clubs',
            1: 'Diamonds',
            2: 'Hearts',
            3: 'Spades'
        }[card.suit];
        let num;
        switch (card.num) {
            case 1:
                num = 'A';
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
                num = card.num.toString();
        }
        const metadataKey = `${suit}${num}`;
        return src_data_card_spritesheet_map__WEBPACK_IMPORTED_MODULE_0__["CardSpritesheetMap"][metadataKey];
    }
}
ResourceService.ɵfac = function ResourceService_Factory(t) { return new (t || ResourceService)(); };
ResourceService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: ResourceService, factory: ResourceService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "6NmD":
/*!********************************************!*\
  !*** ../riffle-server/src/RiffleSchema.ts ***!
  \********************************************/
/*! exports provided: GameView, GameConstants, Card, Player, ShowdownResult, RiffleState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameView", function() { return GameView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameConstants", function() { return GameConstants; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Card", function() { return Card; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShowdownResult", function() { return ShowdownResult; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RiffleState", function() { return RiffleState; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "K6CM");
/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @colyseus/schema */ "AJbF");
/* harmony import */ var _colyseus_schema__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__);


var GameView;
(function (GameView) {
    GameView[GameView["GameLobby"] = 0] = "GameLobby";
    GameView[GameView["Swapping"] = 1] = "Swapping";
    GameView[GameView["Showdown"] = 2] = "Showdown";
})(GameView || (GameView = {}));
const GameConstants = {
    roundTimeMS: 30 * 1000,
};
class Card extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["Schema"] {
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
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint8')
], Card.prototype, "num", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint8')
], Card.prototype, "suit", void 0);
class Player extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["Schema"] {
    constructor(id, name) {
        super();
        this.cards = new _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["ArraySchema"]();
        this.score = 0;
        this.votedNextRound = false;
        this.id = id;
        this.name = name;
    }
}
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('string')
], Player.prototype, "id", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('string')
], Player.prototype, "name", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])([Card])
], Player.prototype, "cards", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint16')
], Player.prototype, "score", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('boolean')
], Player.prototype, "votedNextRound", void 0);
class ShowdownResult extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["Schema"] {
    constructor(playerId, playerName, hand, rank) {
        super();
        this.playerId = playerId;
        this.playerName = playerName;
        this.hand = hand;
        this.rank = rank;
    }
}
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('string')
], ShowdownResult.prototype, "playerId", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('string')
], ShowdownResult.prototype, "playerName", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('string')
], ShowdownResult.prototype, "hand", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint8')
], ShowdownResult.prototype, "rank", void 0);
class RiffleState extends _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["Schema"] {
    constructor() {
        super(...arguments);
        this.players = new _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["MapSchema"]();
        this.commonCards = new _colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["ArraySchema"]();
    }
}
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint8')
], RiffleState.prototype, "gameView", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])({ map: Player })
], RiffleState.prototype, "players", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])([Card])
], RiffleState.prototype, "commonCards", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])([Card])
], RiffleState.prototype, "deck", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])([ShowdownResult])
], RiffleState.prototype, "showdownResults", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('string')
], RiffleState.prototype, "showdownWinner", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint8')
], RiffleState.prototype, "numVotedNextRound", void 0);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_colyseus_schema__WEBPACK_IMPORTED_MODULE_1__["type"])('uint8')
], RiffleState.prototype, "nextRoundVotesRequired", void 0);


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navbar/navbar.component */ "kWWo");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");



class AppComponent {
    constructor() {
        this.title = 'resource-game-client';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-navbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "router-outlet");
    } }, directives: [_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_1__["NavbarComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navbar/navbar.component */ "kWWo");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _lobby_lobby_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lobby/lobby.component */ "h6Cj");
/* harmony import */ var _game_game_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./game/game.component */ "jBAD");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ "fXoL");








class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({ providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"],
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__["AppComponent"],
        _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_2__["NavbarComponent"],
        _lobby_lobby_component__WEBPACK_IMPORTED_MODULE_4__["LobbyComponent"],
        _game_game_component__WEBPACK_IMPORTED_MODULE_5__["GameComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ReactiveFormsModule"]] }); })();


/***/ }),

/***/ "bLhA":
/*!*************************************!*\
  !*** ./src/app/colyseus.service.ts ***!
  \*************************************/
/*! exports provided: ColyseusService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColyseusService", function() { return ColyseusService; });
/* harmony import */ var colyseus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! colyseus.js */ "eKVv");
/* harmony import */ var colyseus_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(colyseus_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");




class ColyseusService {
    constructor() {
        this.initClient();
    }
    initClient() {
        const host = window.document.location.host.replace(/:.*/, '');
        const serverUrl = location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : '');
        this.client = new colyseus_js__WEBPACK_IMPORTED_MODULE_0__["Client"](serverUrl);
        this.client.joinOrCreate('lobby').then(lobby => {
            lobby.onMessage("rooms", (rooms) => {
                this.allRooms = rooms;
            });
            lobby.onMessage("+", ([roomId, room]) => {
                const roomIndex = this.allRooms.findIndex((room) => room.roomId === roomId);
                if (roomIndex !== -1) {
                    this.allRooms[roomIndex] = room;
                }
                else {
                    this.allRooms.push(room);
                }
            });
            lobby.onMessage("-", (roomId) => {
                this.allRooms = this.allRooms.filter((room) => room.roomId !== roomId);
            });
        });
    }
    createRoom(options) {
        this.room$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["from"])(this.client.create('riffle_room', Object.assign({ password: 'test' }, options))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])(room => {
            this.room = room;
        }));
        return this.room$;
    }
    joinGame(roomId, options) {
        this.room$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["from"])(this.client.joinById(roomId, Object.assign({}, options))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])(room => {
            this.room = room;
        }));
        return this.room$;
    }
    swapCards(commonIndex, handIndex) {
        this.room.send('swap-cards', {
            handIndex,
            commonIndex
        });
    }
}
ColyseusService.ɵfac = function ColyseusService_Factory(t) { return new (t || ColyseusService)(); };
ColyseusService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: ColyseusService, factory: ColyseusService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "c7vj":
/*!******************************************!*\
  !*** ./src/data/card-spritesheet-map.ts ***!
  \******************************************/
/*! exports provided: CardSpritesheetMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CardSpritesheetMap", function() { return CardSpritesheetMap; });
const CardSpritesheetMap = {
    Clubs10: {
        x: 560,
        y: 760,
        width: 140,
        height: 190
    },
    Clubs2: {
        x: 280,
        y: 1140,
        width: 140,
        height: 190
    },
    Clubs3: {
        x: 700,
        y: 190,
        width: 140,
        height: 190
    },
    Clubs4: {
        x: 700,
        y: 0,
        width: 140,
        height: 190
    },
    Clubs5: {
        x: 560,
        y: 1710,
        width: 140,
        height: 190
    },
    Clubs6: {
        x: 560,
        y: 1520,
        width: 140,
        height: 190
    },
    Clubs7: {
        x: 560,
        y: 1330,
        width: 140,
        height: 190
    },
    Clubs8: {
        x: 560,
        y: 1140,
        width: 140,
        height: 190
    },
    Clubs9: {
        x: 560,
        y: 950,
        width: 140,
        height: 190
    },
    ClubsA: {
        x: 560,
        y: 570,
        width: 140,
        height: 190
    },
    ClubsJ: {
        x: 560,
        y: 380,
        width: 140,
        height: 190
    },
    ClubsK: {
        x: 560,
        y: 190,
        width: 140,
        height: 190
    },
    ClubsQ: {
        x: 560,
        y: 0,
        width: 140,
        height: 190
    },
    Diamonds10: {
        x: 420,
        y: 190,
        width: 140,
        height: 190
    },
    Diamonds2: {
        x: 420,
        y: 1710,
        width: 140,
        height: 190
    },
    Diamonds3: {
        x: 420,
        y: 1520,
        width: 140,
        height: 190
    },
    Diamonds4: {
        x: 420,
        y: 1330,
        width: 140,
        height: 190
    },
    Diamonds5: {
        x: 420,
        y: 1140,
        width: 140,
        height: 190
    },
    Diamonds6: {
        x: 420,
        y: 950,
        width: 140,
        height: 190
    },
    Diamonds7: {
        x: 420,
        y: 760,
        width: 140,
        height: 190
    },
    Diamonds8: {
        x: 420,
        y: 570,
        width: 140,
        height: 190
    },
    Diamonds9: {
        x: 420,
        y: 380,
        width: 140,
        height: 190
    },
    DiamondsA: {
        x: 420,
        y: 0,
        width: 140,
        height: 190
    },
    DiamondsJ: {
        x: 280,
        y: 1710,
        width: 140,
        height: 190
    },
    DiamondsK: {
        x: 280,
        y: 1520,
        width: 140,
        height: 190
    },
    DiamondsQ: {
        x: 280,
        y: 1330,
        width: 140,
        height: 190
    },
    Hearts10: {
        x: 140,
        y: 1520,
        width: 140,
        height: 190
    },
    Hearts2: {
        x: 700,
        y: 380,
        width: 140,
        height: 190
    },
    Hearts3: {
        x: 280,
        y: 950,
        width: 140,
        height: 190
    },
    Hearts4: {
        x: 280,
        y: 760,
        width: 140,
        height: 190
    },
    Hearts5: {
        x: 280,
        y: 570,
        width: 140,
        height: 190
    },
    Hearts6: {
        x: 280,
        y: 380,
        width: 140,
        height: 190
    },
    Hearts7: {
        x: 280,
        y: 190,
        width: 140,
        height: 190
    },
    Hearts8: {
        x: 280,
        y: 0,
        width: 140,
        height: 190
    },
    Hearts9: {
        x: 140,
        y: 1710,
        width: 140,
        height: 190
    },
    HeartsA: {
        x: 140,
        y: 1330,
        width: 140,
        height: 190
    },
    HeartsJ: {
        x: 140,
        y: 1140,
        width: 140,
        height: 190
    },
    HeartsK: {
        x: 140,
        y: 950,
        width: 140,
        height: 190
    },
    HeartsQ: {
        x: 140,
        y: 760,
        width: 140,
        height: 190
    },
    Joker: {
        x: 140,
        y: 570,
        width: 140,
        height: 190
    },
    Spades10: {
        x: 0,
        y: 760,
        width: 140,
        height: 190
    },
    Spades2: {
        x: 140,
        y: 380,
        width: 140,
        height: 190
    },
    Spades3: {
        x: 140,
        y: 190,
        width: 140,
        height: 190
    },
    Spades4: {
        x: 140,
        y: 0,
        width: 140,
        height: 190
    },
    Spades5: {
        x: 0,
        y: 1710,
        width: 140,
        height: 190
    },
    Spades6: {
        x: 0,
        y: 1520,
        width: 140,
        height: 190
    },
    Spades7: {
        x: 0,
        y: 1330,
        width: 140,
        height: 190
    },
    Spades8: {
        x: 0,
        y: 1140,
        width: 140,
        height: 190
    },
    Spades9: {
        x: 0,
        y: 950,
        width: 140,
        height: 190
    },
    SpadesA: {
        x: 0,
        y: 570,
        width: 140,
        height: 190
    },
    SpadesJ: {
        x: 0,
        y: 380,
        width: 140,
        height: 190
    },
    SpadesK: {
        x: 0,
        y: 190,
        width: 140,
        height: 190
    },
    SpadesQ: {
        x: 0,
        y: 0,
        width: 140,
        height: 190
    }
};


/***/ }),

/***/ "h6Cj":
/*!******************************************!*\
  !*** ./src/app/lobby/lobby.component.ts ***!
  \******************************************/
/*! exports provided: LobbyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LobbyComponent", function() { return LobbyComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _colyseus_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../colyseus.service */ "bLhA");
/* harmony import */ var _resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../resource.service */ "5nS4");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "1kSV");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "ofXK");









function LobbyComponent_ng_template_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "em");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "No games currently in progress");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function LobbyComponent_div_32_tr_17_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "tr", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LobbyComponent_div_32_tr_17_Template_tr_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r8); const room_r6 = ctx.$implicit; const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](35); return ctx_r7.openPasswordModal(_r3, room_r6.roomId); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "th", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const room_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](room_r6.metadata.roomName);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](room_r6.roomId);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](room_r6.clients);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](room_r6.maxClients);
} }
function LobbyComponent_div_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "em");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Click a row to join a game");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "table", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "thead");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "th", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Room Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "th", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "Room ID");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "th", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Players");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "th", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "Max Players");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, LobbyComponent_div_32_tr_17_Template, 9, 4, "tr", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r2.colyseus.allRooms);
} }
function LobbyComponent_ng_template_34_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Incorrect password, please try again. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} }
function LobbyComponent_ng_template_34_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "h4", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Enter room password");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, LobbyComponent_ng_template_34_div_4_Template, 2, 0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "input", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("keydown.enter", function LobbyComponent_ng_template_34_Template_input_keydown_enter_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r11.tryJoinRoom(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LobbyComponent_ng_template_34_Template_button_click_7_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r13.tryJoinRoom(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Join ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LobbyComponent_ng_template_34_Template_button_click_9_listener() { const modal_r9 = ctx.$implicit; return modal_r9.dismiss(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " Back ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r4.wrongPassword);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r4.isLoading);
} }
class LobbyComponent {
    constructor(router, colyseus, resourceService, // eagerly load card spritesheet
    fb, modalService) {
        this.router = router;
        this.colyseus = colyseus;
        this.resourceService = resourceService;
        this.fb = fb;
        this.modalService = modalService;
    }
    ngOnInit() {
        this.isLoading = false;
        this.createForm = this.fb.group({
            roomName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].maxLength(20)]],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].maxLength(16)]]
        });
        this.joinForm = this.fb.group({
            roomId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].maxLength(16)]]
        });
        this.lobbyForm = this.fb.group({
            username: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(2), _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].maxLength(16)]],
            createForm: this.createForm,
            joinForm: this.joinForm,
        });
    }
    createRoom() {
        this.isLoading = true;
        this.colyseus.createRoom({
            username: this.lobbyForm.get('username').value,
            roomName: this.lobbyForm.get(['createForm', 'roomName']).value,
            password: this.lobbyForm.get(['createForm', 'password']).value
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(room => {
            this.router.navigate(['game', room.id]);
        });
    }
    openPasswordModal(content, roomId) {
        this.joinForm.controls['roomId'].setValue(roomId);
        if (this.lobbyForm.get('username').valid) {
            this.modalRef = this.modalService.open(content);
            this.modalRef.dismissed.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(() => {
                this.wrongPassword = false;
                this.isLoading = false;
            });
        }
    }
    tryJoinRoom() {
        this.isLoading = true;
        const username = this.lobbyForm.get('username').value;
        const roomId = this.joinForm.get('roomId').value;
        const password = this.joinForm.get('password').value;
        this.colyseus.joinGame(roomId, {
            username,
            password,
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(room => {
            room.onMessage('password-accepted', () => {
                this.modalRef.close();
                this.router.navigate(['game', room.id]);
            });
            room.onMessage('password-rejected', () => {
                this.wrongPassword = true;
                this.isLoading = false;
            });
        });
    }
}
LobbyComponent.ɵfac = function LobbyComponent_Factory(t) { return new (t || LobbyComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_colyseus_service__WEBPACK_IMPORTED_MODULE_4__["ColyseusService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_resource_service__WEBPACK_IMPORTED_MODULE_5__["ResourceService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_6__["NgbModal"])); };
LobbyComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: LobbyComponent, selectors: [["app-lobby"]], decls: 36, vars: 6, consts: [[3, "formGroup"], [1, "container", "mt-3"], [1, "row", "justify-content-center"], [1, "input-group", "input-group-lg"], [1, "input-group-prepend"], ["id", "inputGroup-sizing-lg", 1, "input-group-text"], ["formControlName", "username", "type", "text", "aria-label", "Large", "placeholder", "Username", "required", "", 1, "form-control"], [1, "input-group", "input-group-lg", "mt-3"], ["formControlName", "roomName", "type", "text", "aria-label", "Large", "placeholder", "Name", "required", "", 1, "form-control"], ["formControlName", "password", "type", "text", "aria-label", "Large", "placeholder", "Password", "required", "", 1, "form-control"], [1, "input-group-append"], ["type", "submit", "autofocus", "", 1, "btn", "btn-primary", 3, "disabled", "click"], ["noRooms", ""], [4, "ngIf", "ngIfElse"], ["passwordModal", ""], [1, "table", "table-striped", "table-bordered", "table-hover"], ["scope", "col"], [3, "click", 4, "ngFor", "ngForOf"], [3, "click"], ["scope", "row"], [1, "modal-header"], ["id", "modal-basic-title", 1, "modal-title"], [1, "modal-body"], ["class", "alert alert-danger", "role", "alert", 4, "ngIf"], ["formControlName", "password", "type", "text", "aria-label", "Large", "placeholder", "Password", "autofocus", "", "required", "", 1, "form-control", 3, "keydown.enter"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled", "click"], ["aria-label", "Close", 1, "btn", "btn-outline-secondary", 3, "click"], ["role", "alert", 1, "alert", "alert-danger"]], template: function LobbyComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Username");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "Create a Game");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "em");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "All fields are required");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](19, "Room Info");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](20, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](21, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function LobbyComponent_Template_button_click_23_listener() { return ctx.createRoom(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, " Create Game ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](25, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "h3");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](28, "Join a Game");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](30, LobbyComponent_ng_template_30_Template, 3, 0, "ng-template", null, 12, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](32, LobbyComponent_div_32_Template, 18, 1, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](34, LobbyComponent_ng_template_34_Template, 11, 2, "ng-template", null, 14, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](31);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.lobbyForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.createForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.createForm.invalid || ctx.isLoading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.colyseus.allRooms == null ? null : ctx.colyseus.allRooms.length)("ngIfElse", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.joinForm);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["ɵangular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["RequiredValidator"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJsb2JieS5jb21wb25lbnQuY3NzIn0= */"] });


/***/ }),

/***/ "jBAD":
/*!****************************************!*\
  !*** ./src/app/game/game.component.ts ***!
  \****************************************/
/*! exports provided: GameComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameComponent", function() { return GameComponent; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../riffle-server/src/RiffleSchema */ "6NmD");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _colyseus_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../colyseus.service */ "bLhA");
/* harmony import */ var _resource_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../resource.service */ "5nS4");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");







const _c0 = ["cardCanvas"];
function GameComponent_div_9_tr_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "th", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "td", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "td", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const result_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](result_r3.playerName);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](result_r3.hand);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](result_r3.rank);
} }
function GameComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Showdown!");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "table", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "thead", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "th", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "th", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "Hand");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "th", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Hand ranking");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "tbody");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, GameComponent_div_9_tr_15_Template, 7, 3, "tr", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function GameComponent_div_9_Template_button_click_19_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r4.onNextRoundClicked(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.state.showdownResults);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx_r1.state.showdownWinner, " wins!");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r1.isNextRoundClicked);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate3"](" ", ctx_r1.isNextRoundClicked ? "Waiting for others..." : "Next Round", " [", ctx_r1.state.numVotedNextRound, " / ", ctx_r1.state.nextRoundVotesRequired, "] ");
} }
class GameComponent {
    constructor(router, route, colyseus, resourceService) {
        this.router = router;
        this.route = route;
        this.colyseus = colyseus;
        this.resourceService = resourceService;
        // for drawing cards on the canvas, and to detect which card has been clicked on mouse down
        this.cardWidth = 100;
        this.cardHeight = 135;
        this.handStartY = this.cardHeight * 2;
        this.GameView = _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["GameView"];
        this.GameConstants = _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["GameConstants"];
        this.roundTimeDeltaMS = 200;
    }
    get stateHandCards() {
        return this.state.players.get(this.colyseus.room.sessionId).cards;
    }
    ngOnInit() {
        // from https://stackoverflow.com/a/3540295
        // detect if this is a touch device or not
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            this.isMobile = true;
        }
        if (this.colyseus.room === undefined) {
            // no handle on this game; redirect to the lobby
            this.router.navigate(['lobby']);
        }
        this.gameId = this.route.params.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["map"])((params => params['id'])));
        // start with default state to prevent undefined errors before the state is downloaded initially
        this.state = new _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["RiffleState"]();
        this.colyseus.room$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["take"])(1)).subscribe(room => {
            room.onStateChange((state) => {
                this.state = state;
                if (state.gameView === _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["GameView"].Swapping) {
                    this.drawCards();
                }
            });
            room.onMessage('game-view-changed', (newGameView) => {
                switch (newGameView) {
                    case _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["GameView"].Swapping:
                        // reset
                        this.selectedCommonIndex = -1;
                        this.selectedHandIndex = -1;
                        // start the round timer
                        this.roundTimeRemainingMS = _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["GameConstants"].roundTimeMS;
                        this.roundTimeInterval = setInterval(() => {
                            this.roundTimeRemainingMS -= this.roundTimeDeltaMS;
                        }, this.roundTimeDeltaMS);
                        break;
                    case _riffle_server_src_RiffleSchema__WEBPACK_IMPORTED_MODULE_1__["GameView"].Showdown:
                        // reset
                        this.isNextRoundClicked = false;
                        clearInterval(this.roundTimeInterval);
                        break;
                }
            });
        });
    }
    ngAfterViewInit() {
        this.initCanvas();
    }
    initCanvas() {
        this.canvas = this.myCanvas.nativeElement;
        this.ctx = this.myCanvas.nativeElement.getContext('2d');
        // register mouse event listeners
        this.canvas.addEventListener('mousedown', e => {
            this.onMouseEvent('mousedown', e);
        });
        this.canvas.addEventListener('mouseup', e => {
            this.onMouseEvent('mouseup', e);
        });
        this.canvas.addEventListener('mousemove', e => {
            this.onMouseEvent('mousemove', e);
        });
        this.canvas.addEventListener('mouseout', e => {
            this.onMouseEvent('mouseout', e);
        });
        // register event listeners for touch devices
        this.canvas.addEventListener('touchstart', e => {
            this.onMouseEvent('touchstart', e);
        });
        this.canvas.addEventListener('touchend', e => {
            this.onMouseEvent('touchend', e);
        });
        this.canvas.addEventListener('touchmove', e => {
            this.onMouseEvent('touchmove', e);
        });
        this.canvas.addEventListener('touchcancel', e => {
            this.onMouseEvent('touchcancel', e);
        });
    }
    onMouseEvent(action, e) {
        if (this.isMobile) {
            // prevent back/forward swipes etc. in the browser on mobile devices
            e.preventDefault();
        }
        // extract mouse position based on event vars
        // (different on mobile devices)
        // TODO: extract this outside this function
        let cursorX;
        let cursorY;
        if (this.isMobile) {
            cursorX = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
            cursorY = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
        }
        else {
            cursorX = e.clientX - this.canvas.getBoundingClientRect().left;
            cursorY = e.clientY - this.canvas.getBoundingClientRect().top;
        }
        switch (action) {
            case 'mousedown':
            case 'touchstart':
                // card select detection
                const cardIndex = Math.floor(cursorX / this.cardWidth);
                const commonCardClicked = cursorY < this.cardHeight;
                const handCardClicked = cursorY > this.handStartY;
                const anyCardClicked = commonCardClicked || handCardClicked;
                if (anyCardClicked) {
                    if (commonCardClicked) {
                        this.selectCommonCard(cardIndex);
                    }
                    else {
                        // hand card clicked
                        this.selectHandCard(cardIndex);
                    }
                }
                else {
                    // empty area clicke
                    this.deselectAllCards();
                }
                // re-draw cards to render the card(s) highlight
                this.drawCards();
                break;
            case 'mouseup':
            case 'touchend':
            case 'mouseout':
                //
                break;
            case 'mousemove':
            case 'touchmove':
                //
                break;
        }
    }
    drawCards() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const spritesheet = this.resourceService.spritesheet;
        this.state.commonCards.forEach((card, index) => {
            const metadata = this.resourceService.getCardSpritesheetMedata(card);
            const offsetX = this.cardWidth * index;
            const offsetY = 0;
            this.ctx.drawImage(spritesheet, metadata.x, metadata.y, metadata.width, metadata.height, offsetX, offsetY, this.cardWidth, this.cardHeight);
        });
        if (this.selectedCommonIndex !== -1) {
            // highlight this card as being selected
            const offsetX = this.cardWidth * this.selectedCommonIndex;
            this.ctx.strokeStyle = '#00BB00';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.rect(offsetX, 0, this.cardWidth, this.cardHeight);
            this.ctx.stroke();
        }
        this.stateHandCards.forEach((card, index) => {
            const metadata = this.resourceService.getCardSpritesheetMedata(card);
            const offsetX = this.cardWidth * index;
            const offsetY = this.handStartY;
            this.ctx.drawImage(spritesheet, metadata.x, metadata.y, metadata.width, metadata.height, offsetX, offsetY, this.cardWidth, this.cardHeight);
        });
        if (this.selectedHandIndex !== -1) {
            // highlight this card as being selected
            const offsetX = this.cardWidth * this.selectedHandIndex;
            this.ctx.strokeStyle = '#00BB00';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.rect(offsetX, this.handStartY, this.cardWidth, this.cardHeight);
            this.ctx.stroke();
        }
    }
    selectCommonCard(index) {
        if (this.selectedCommonIndex === index) {
            this.selectedCommonIndex = -1;
        }
        else {
            this.selectedCommonIndex = index;
            this.swapIfBothSelected();
        }
    }
    selectHandCard(index) {
        if (this.selectedHandIndex === index) {
            this.selectedHandIndex = -1;
        }
        else {
            this.selectedHandIndex = index;
            this.swapIfBothSelected();
        }
    }
    swapIfBothSelected() {
        if (this.selectedCommonIndex !== -1 && this.selectedHandIndex !== -1) {
            this.colyseus.swapCards(this.selectedCommonIndex, this.selectedHandIndex);
            this.deselectAllCards();
        }
    }
    deselectAllCards() {
        this.selectedCommonIndex = -1;
        this.selectedHandIndex = -1;
    }
    onNextRoundClicked() {
        this.isNextRoundClicked = true;
        this.colyseus.room.send('next-round-vote');
    }
}
GameComponent.ɵfac = function GameComponent_Factory(t) { return new (t || GameComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_colyseus_service__WEBPACK_IMPORTED_MODULE_4__["ColyseusService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_resource_service__WEBPACK_IMPORTED_MODULE_5__["ResourceService"])); };
GameComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: GameComponent, selectors: [["app-game"]], viewQuery: function GameComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 1);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.myCanvas = _t.first);
    } }, decls: 10, vars: 5, consts: [[1, "container", "mt-3"], [3, "hidden"], [1, "text-center"], [1, "progress", "round-timer"], ["role", "progressbar", 1, "progress-bar", "progress-bar-striped", 3, "ngClass"], ["id", "card-canvas-div"], ["id", "card-canvas", "width", "500", "height", "405"], ["cardCanvas", ""], [4, "ngIf"], [1, "row", "justify-content-center"], [1, "table", "table-bordered"], [1, "thead-dark"], ["scope", "col", 1, "fit"], [4, "ngFor", "ngForOf"], [1, "fixed-bottom"], ["type", "button", 1, "btn", "btn-primary", "mb-3", 3, "disabled", "click"], ["scope", "row", 1, "fit"], [1, "fit"]], template: function GameComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h3", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Make the best hand you can!");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "canvas", 6, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, GameComponent_div_9_Template, 21, 6, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("hidden", ctx.state.gameView !== ctx.GameView.Swapping);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", ctx.roundTimeRemainingMS / ctx.GameConstants.roundTimeMS * 100 + "%");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx.roundTimeRemainingMS > ctx.GameConstants.roundTimeMS / 5 ? "bg-info" : "bg-danger");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.state.gameView === ctx.GameView.Showdown);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"]], styles: [".round-timer[_ngcontent-%COMP%] {\r\n    width: 25em;\r\n    margin: auto;\r\n}\r\n\r\n.card-row[_ngcontent-%COMP%] {\r\n    width: -webkit-fit-content;\r\n    height: -webkit-fit-content;\r\n    width: -moz-fit-content;\r\n    height: -moz-fit-content;\r\n    margin: 1em auto;\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n    display: inline-block;\r\n    border: 5px outset lightblue;\r\n    border-radius: 8px;\r\n\r\n    \r\n    -webkit-user-drag: none;\r\n    -khtml-user-drag: none;\r\n    -moz-user-drag: none;\r\n    -o-user-drag: none;\r\n    user-drag: none;\r\n\r\n    \r\n    khtml-user-select: none;\r\n    -o-user-select: none;\r\n    -webkit-user-select: none;\r\n    user-select: none;\r\n}\r\n\r\n.selected-card[_ngcontent-%COMP%] {\r\n    border-style: inset;\r\n    border-color: lightcoral;\r\n}\r\n\r\n#card-canvas-div[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n    text-align: center;\r\n    margin-top: 1em;\r\n}\r\n\r\n#card-canvas[_ngcontent-%COMP%] {\r\n    border: 2px solid gray;\r\n    border-radius: 5px;\r\n    display: inline;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdhbWUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7SUFDSSxXQUFXO0lBQ1gsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLDBCQUEwQjtJQUMxQiwyQkFBMkI7SUFDM0IsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtJQUN4QixnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxxQkFBcUI7SUFDckIsNEJBQTRCO0lBQzVCLGtCQUFrQjs7SUFFbEIsMkJBQTJCO0lBQzNCLHVCQUF1QjtJQUN2QixzQkFBc0I7SUFDdEIsb0JBQW9CO0lBQ3BCLGtCQUFrQjtJQUNsQixlQUFlOztJQUVmLHlCQUF5QjtJQUN6Qix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBRXBCLHlCQUF5QjtJQUN6QixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxtQkFBbUI7SUFDbkIsd0JBQXdCO0FBQzVCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGtCQUFrQjtJQUNsQixlQUFlO0FBQ25COztBQUVBO0lBQ0ksc0JBQXNCO0lBQ3RCLGtCQUFrQjtJQUNsQixlQUFlO0FBQ25CIiwiZmlsZSI6ImdhbWUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4ucm91bmQtdGltZXIge1xyXG4gICAgd2lkdGg6IDI1ZW07XHJcbiAgICBtYXJnaW46IGF1dG87XHJcbn1cclxuXHJcbi5jYXJkLXJvdyB7XHJcbiAgICB3aWR0aDogLXdlYmtpdC1maXQtY29udGVudDtcclxuICAgIGhlaWdodDogLXdlYmtpdC1maXQtY29udGVudDtcclxuICAgIHdpZHRoOiAtbW96LWZpdC1jb250ZW50O1xyXG4gICAgaGVpZ2h0OiAtbW96LWZpdC1jb250ZW50O1xyXG4gICAgbWFyZ2luOiAxZW0gYXV0bztcclxufVxyXG5cclxuLmNhcmQge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgYm9yZGVyOiA1cHggb3V0c2V0IGxpZ2h0Ymx1ZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuXHJcbiAgICAvKiBkaXNhYmxlIGNsaWNrIGFuZCBkcmFnICovXHJcbiAgICAtd2Via2l0LXVzZXItZHJhZzogbm9uZTtcclxuICAgIC1raHRtbC11c2VyLWRyYWc6IG5vbmU7XHJcbiAgICAtbW96LXVzZXItZHJhZzogbm9uZTtcclxuICAgIC1vLXVzZXItZHJhZzogbm9uZTtcclxuICAgIHVzZXItZHJhZzogbm9uZTtcclxuXHJcbiAgICAvKiBkaXNhYmxlIGhpZ2hsaWdodGluZyAqL1xyXG4gICAga2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAtby11c2VyLXNlbGVjdDogbm9uZTtcclxuICAgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XHJcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xyXG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbn1cclxuXHJcbi5zZWxlY3RlZC1jYXJkIHtcclxuICAgIGJvcmRlci1zdHlsZTogaW5zZXQ7XHJcbiAgICBib3JkZXItY29sb3I6IGxpZ2h0Y29yYWw7XHJcbn1cclxuXHJcbiNjYXJkLWNhbnZhcy1kaXYge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tdG9wOiAxZW07XHJcbn1cclxuXHJcbiNjYXJkLWNhbnZhcyB7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCBncmF5O1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgZGlzcGxheTogaW5saW5lO1xyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ "kWWo":
/*!********************************************!*\
  !*** ./src/app/navbar/navbar.component.ts ***!
  \********************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class NavbarComponent {
    constructor() { }
    ngOnInit() {
    }
}
NavbarComponent.ɵfac = function NavbarComponent_Factory(t) { return new (t || NavbarComponent)(); };
NavbarComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NavbarComponent, selectors: [["app-navbar"]], decls: 10, vars: 0, consts: [[1, "navbar", "navbar-expand-lg", "navbar-light", "bg-light", "border-bottom"], [1, "navbar-brand"], ["id", "navbarSupportedContent", 1, "collapse", "navbar-collapse"], [1, "navbar-nav", "ml-auto", "mt-2", "mt-lg-0"], [1, "nav-item", "active"], ["href", "#", 1, "nav-link"], [1, "sr-only"]], template: function NavbarComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "nav", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Riffle");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ul", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "li", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Home ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "(current)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJuYXZiYXIuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _game_game_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game/game.component */ "jBAD");
/* harmony import */ var _lobby_lobby_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lobby/lobby.component */ "h6Cj");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");





const routes = [
    { path: 'lobby', component: _lobby_lobby_component__WEBPACK_IMPORTED_MODULE_2__["LobbyComponent"] },
    { path: 'game/:id', component: _game_game_component__WEBPACK_IMPORTED_MODULE_1__["GameComponent"] },
    { path: '**', redirectTo: 'lobby' }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map