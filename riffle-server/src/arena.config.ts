import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { LobbyRoom } from "colyseus";
import serveIndex from 'serve-index';
import express from 'express';
import path from 'path';

import { RiffleRoom } from "./RiffleRoom";

const compression = require('compression');

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
            .use(express.static(path.join(__dirname, 'static')))
            .use((req, res) => res.sendFile('index.html', { root: path.join(__dirname, 'static') })
        );

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