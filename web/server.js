"use strict";
/*
 * Audicord Bot
 * Author: Mateus Araújo - 2019
 * https://github.com/arj-mat
 * Web - HTTP Server
*/
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Settings = require("../settings");
const App = require("../app");
const FS = require("fs");
const bot_modules_1 = require("../bot_modules");
const Discord = require("discord.js");
const buffer_1 = require("buffer");
var app = express();
app.use(function (req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        req.body = data;
        next();
    });
});
app.use('/static', express.static('web/content/static'));
class HTMLContent {
    constructor(file) {
        this.content = FS.readFileSync(`web/content/${file}`, 'utf8');
    }
    format(args) {
        return this.content.replace(/\$\{([^\}]+)\}/g, (str, id) => {
            return String(args[id]);
        });
    }
}
var newAudioPage = new HTMLContent('new-audio.html');
var newAudioErrorPage = new HTMLContent('new-audio-error.html');
app.get(/^\/new\-audio\/([a-f0-9\-]{36})\/?$/, (req, resp) => {
    let [, token] = req.path.match(/^\/new\-audio\/([a-f0-9\-]{36})\/?$/) || [, ''];
    if (!token) {
        resp.status(404);
        resp.send('Invalid URL requested.');
        return;
    }
    resp.status(200);
    resp.contentType('text/html');
    let error;
    let audioRequest = bot_modules_1.AudioModule.audioRequests[token];
    let guild;
    let channel;
    if (!audioRequest)
        error = `Invalid or expired link.<br>You can request the bot a new one.`;
    else {
        guild = App.botClient.guilds.get(audioRequest.guildId);
        if (!guild)
            error = `The Discord server where you made your request is not available at the moment.`;
        else {
            channel = guild.channels.get(audioRequest.channelId);
            if (!channel)
                error = `The channel where you made your request is no longer available at "${guild.name}".`;
        }
    }
    if (error) {
        resp.end(newAudioErrorPage.format({
            errorMessage: error
        }));
    }
    else {
        resp.end(newAudioPage.format({
            serverName: guild.name,
            channelName: channel.name,
            token: token
        }));
    }
});
app.post('/submit-audio', (req, resp) => {
    resp.status(200);
    resp.contentType('text/json');
    let token = req.query.token || '';
    let audioRequest = bot_modules_1.AudioModule.audioRequests[token];
    let error;
    let guild;
    let channel;
    if (!audioRequest)
        error = `Invalid or expired audio request.<br>You must request the bot a new link.`;
    else {
        guild = App.botClient.guilds.get(audioRequest.guildId);
        if (!guild)
            error = `The Discord server where you made your request is not available at the moment.`;
        else {
            channel = guild.channels.get(audioRequest.channelId);
            if (!channel)
                error = `The channel where you made your request is no longer available at "${guild.name}".`;
        }
    }
    let audio;
    if (!error) {
        audio = buffer_1.Buffer.from(decodeURIComponent(req.body), 'base64');
        if (audio.length == 0 || audio.length > 7 * 1e+6) // Size limit of 7MB.
            error = `Invalid or corrupted audio.`;
    }
    if (error) {
        resp.end(JSON.stringify({
            success: false,
            error: error
        }));
    }
    else {
        channel.send(`🎙 Audio Message from <@${audioRequest.userId}>:`, {
            files: [
                new Discord.Attachment(audio, `Audio-${audioRequest.userName}-${new Date().toLocaleString()}.ogg`)
            ]
        }).then((sentMsg) => {
            delete bot_modules_1.AudioModule.audioRequests[token];
            resp.end(JSON.stringify({
                success: true
            }));
        })
            .catch(reason => {
            error = `Unable to send your audio at "${guild.name}": ${reason}.`;
            resp.end(JSON.stringify({
                success: false,
                error: error
            }));
        });
    }
});
var Server;
(function (Server) {
    function initializeServer() {
        console.log(`[!] Initializing web server...`);
        app.listen(Settings.HTTP_PORT, () => {
            console.log(`[!] Web server listening at port ${Settings.HTTP_PORT}.`);
        });
    }
    Server.initializeServer = initializeServer;
})(Server = exports.Server || (exports.Server = {}));
//# sourceMappingURL=server.js.map