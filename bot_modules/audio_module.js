"use strict";
/*
 * Audicord Bot
 * Author: Mateus Araújo - 2019
 * https://github.com/arj-mat
 * Bot Modules - Audio
*/
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
const Utils = require("../utils");
var AudioModule;
(function (AudioModule) {
    AudioModule.audioRequests = {};
    var usersLastAudioRequestsHistory = {};
    const AUDIO_REQUEST_INTERVAL = 20000;
    AudioModule.AUDIO_REQUEST_TIMEOUT = Utils.MINUTE * 3;
    function newAudioRequest(userId, userName, guildId, channelId) {
        if (usersLastAudioRequestsHistory[userId] && Date.now() - usersLastAudioRequestsHistory[userId] < AUDIO_REQUEST_INTERVAL)
            return {
                success: false,
                errorMessage: `you need to wait ${AUDIO_REQUEST_INTERVAL / 1000} seconds before requesting a new audio recording.`
            };
        else
            usersLastAudioRequestsHistory[userId] = Date.now();
        let token = uuidv4();
        AudioModule.audioRequests[token] = {
            userId: userId,
            userName: userName,
            guildId: guildId,
            channelId: channelId
        };
        setTimeout(() => {
            delete AudioModule.audioRequests[token];
        }, AudioModule.AUDIO_REQUEST_TIMEOUT);
        return {
            success: true,
            token: token
        };
    }
    AudioModule.newAudioRequest = newAudioRequest;
})(AudioModule = exports.AudioModule || (exports.AudioModule = {}));
//# sourceMappingURL=audio_module.js.map