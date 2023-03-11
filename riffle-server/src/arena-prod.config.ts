import Arena from "@colyseus/arena";
import { LobbyRoom } from "colyseus";
import express from 'express';
import path from 'path';

import { RiffleRoom } from "./RiffleRoom";

const compression = require('compression');

// Ref: https://stackoverflow.com/a/31144924
function requireHTTPS(req: any, res: any, next: any) {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

export default Arena({
    getId: () => "Riffle",

    initializeGameServer: (gameServer) => {
        gameServer.define("lobby", LobbyRoom);
        gameServer
            .define('riffle_room', RiffleRoom)
            .enableRealtimeListing();
    },

    initializeExpress: (app) => {
        app
            .use(compression())
            // .use(requireHTTPS)
            .use(express.static(path.join(__dirname, 'static')))
            .use((req: any, res: any) => res.sendFile('index.html', { root: path.join(__dirname, 'static') })
        );
    },


    beforeListen: () => {
        // Before before gameServer.listen() is called.
    }
});
