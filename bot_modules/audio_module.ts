 /*
  * Audicord Bot
  * Author: Mateus Araújo - 2019
  * https://github.com/arj-mat
  * Bot Modules - Audio
*/

import * as uuidv4 from "uuid/v4";
import * as Discord from "discord.js";
import * as App from "../app";
import * as Utils from "../utils";

export namespace AudioModule {

    export interface IAudioRequest {
        userId: string,
        userName: string,
        guildId: string,
        channelId: string
    }

    export var audioRequests: { [id: string]: IAudioRequest } = {};

    var usersLastAudioRequestsHistory: { [userId: string]: number } = {};

    const AUDIO_REQUEST_INTERVAL: number = 20000;
    export const AUDIO_REQUEST_TIMEOUT: number = Utils.MINUTE * 3;

    export interface IAudioRequestResult {
        success: boolean,
        errorMessage?: string,
        token?: string
    }

    export function newAudioRequest( userId: string, userName: string, guildId: string, channelId: string ): IAudioRequestResult {
        if ( usersLastAudioRequestsHistory[userId] && Date.now() - usersLastAudioRequestsHistory[userId] < AUDIO_REQUEST_INTERVAL )
            return {
                success: false,
                errorMessage: `you need to wait ${AUDIO_REQUEST_INTERVAL / 1000} seconds before requesting a new audio recording.`
            }
        else
            usersLastAudioRequestsHistory[userId] = Date.now();

        let token: string = uuidv4();

        audioRequests[token] = {
            userId: userId,
            userName: userName,
            guildId: guildId,
            channelId: channelId
        }

        setTimeout( () => {
            delete audioRequests[token];
        }, AUDIO_REQUEST_TIMEOUT );

        return {
            success: true,
            token: token
        }
    }
}