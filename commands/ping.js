"use strict";
/*
 * Audicord Bot
 * Author: Mateus Araújo - 2019
 * https://github.com/arj-mat
 * Commands - Ping
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Ping;
(function (Ping) {
    function handle(msg) {
        msg.reply(`ping ${Date.now() - msg.createdTimestamp} ms.`);
    }
    Ping.handle = handle;
})(Ping = exports.Ping || (exports.Ping = {}));
//# sourceMappingURL=ping.js.map