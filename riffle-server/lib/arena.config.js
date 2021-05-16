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
            .use(express_1.default.static(path_1.default.join(__dirname, 'static')))
            .use((req, res) => res.sendFile('index.html', { root: path_1.default.join(__dirname, 'static') }));
        // app.use('/', (req, res) => 
        //     res.sendFile('index.html', { root: path.join(__dirname, 'static') })
        // );
        // app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        // app.use('/assets', express.static(path.join(__dirname, 'static', 'assets')));pp.get('/', function(req, res){
        //     res.sendFile('default.html', { root: __dirname + "/relative_path_of_file" } );
        // });
        // app.use('*', express.static(path.join(__dirname, "static")));
        // https://docs.colyseus.io/tools/monitor/
        // app.use("/colyseus", monitor());
    },
    beforeListen: () => {
        // Before before gameServer.listen() is called.
    }
});
