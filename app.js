"use strict";
/*
 * Audicord Bot
 * Author: Mateus Araújo - 2019
 * https://github.com/arj-mat
 * Bot - Main
*/
Object.defineProperty(exports, "__esModule", { value: true });
const Settings = require("./settings");
const Discord = require("discord.js");
const Commands = require("./commands");
const Web = require("./web");
console.log(`Audicord v${Settings.VERSION.toLocaleString().replace(/\,/g, '.')}`);
if (!Settings.BOT_TOKEN)
    throw new Error("Bot token is missing at settings.ts|settings.js.");
exports.botClient = new Discord.Client();
exports.botClient.on('message', (msg) => {
    if (msg.author.bot)
        return;
    if (msg.content == "/audio")
        Commands.Audio.handle(msg);
    else if (msg.content == "/audiping")
        Commands.Ping.handle(msg);
});
console.log('[!] Connecting...');
exports.botClient.login(Settings.BOT_TOKEN)
    .then(() => {
    console.log(`[!] Bot sucessfully logged in as ${exports.botClient.user.tag}.`);
    Web.Server.initializeServer();
})
    .catch((reason) => {
    console.log(`[X] Login failed: ${reason}.`);
});
//# sourceMappingURL=app.js.map