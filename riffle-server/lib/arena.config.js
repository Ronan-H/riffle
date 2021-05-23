"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arena_1 = __importDefault(require("@colyseus/arena"));
const colyseus_1 = require("colyseus");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const RiffleRoom_1 = require("./RiffleRoom");
const compression = require('compression');
// Ref: https://stackoverflow.com/a/31144924
function requireHTTPS(req, res, next) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
exports.default = arena_1.default({
    getId: () => "Riffle",
    initializeGameServer: (gameServer) => {
        gameServer.define("lobby", colyseus_1.LobbyRoom);
        gameServer
            .define('riffle_room', RiffleRoom_1.RiffleRoom)
            .enableRealtimeListing();
    },
    initializeExpress: (app) => {
        app
            .use(compression())
            .use(requireHTTPS)
            .use(express_1.default.static(path_1.default.join(__dirname, 'static')))
            .use((req, res) => res.sendFile('index.html', { root: path_1.default.join(__dirname, 'static') }));
    },
    beforeListen: () => {
        // Before before gameServer.listen() is called.
    }
});
