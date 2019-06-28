"use strict";
/*
 * Directcord Bot
 * Author: Mateus Araújo - 2019
 * https://github.com/arj-mat
 * Bot Modules - Audio
*/
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
const i18n = require("../i18n");
var audioRequests = {};
var usersLastAudioRequestsHistory = {};
const AUDIO_REQUEST_INTERVAL = 20000;
var Audio;
(function (Audio) {
    Audio.AUDIO_REQUEST_TIMEOUT = 120000;
    function newAudioRequest(userId, guildId, guildRegion, channelId) {
        if (usersLastAudioRequestsHistory[userId] && Date.now() - usersLastAudioRequestsHistory[userId] < AUDIO_REQUEST_INTERVAL)
            return {
                success: false,
                errorMessage: i18n.get(guildRegion, 'Audio.userNeedToWait', [AUDIO_REQUEST_INTERVAL / 1000])
            };
        else
            usersLastAudioRequestsHistory[userId] = Date.now();
        let token = uuidv4();
        audioRequests[token] = {
            userId: userId,
            guildId: guildId,
            channelId: channelId
        };
        setTimeout(() => {
            delete audioRequests[token];
        }, Audio.AUDIO_REQUEST_TIMEOUT);
        return {
            success: true,
            token: token
        };
    }
    Audio.newAudioRequest = newAudioRequest;
})(Audio = exports.Audio || (exports.Audio = {}));
//# sourceMappingURL=audio.js.map