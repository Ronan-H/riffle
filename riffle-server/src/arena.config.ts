import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { LobbyRoom } from "colyseus";

import { MyRoom } from "./RiffleRoom";

export default Arena({
    getId: () => "Riffle",

    initializeGameServer: (gameServer) => {
        gameServer.define("lobby", LobbyRoom);
        gameServer.define('my_room', MyRoom).enableRealtimeListing();
    },

    initializeExpress: (app) => {
        // https://docs.colyseus.io/tools/monitor/
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        // Before before gameServer.listen() is called.
    }
});