 /*
  * Audicord Bot
  * Author: Mateus Araújo - 2019
  * https://github.com/arj-mat
  * Web - HTTP Server
*/

import express = require( 'express' );
import * as Settings from "../settings";
import * as App from "../app";
import * as FS from "fs";
import * as Utils from "../utils";
import { AudioModule } from "../bot_modules";
import * as Discord from "discord.js";
import { Buffer } from 'buffer';

var app: express.Application = express();

app.use( function ( req, res, next ) {
    var data = '';

    req.setEncoding( 'utf8' );
    
    req.on( 'data', function ( chunk ) {
        data += chunk;
    } );

    req.on( 'end', function () {
        req.body = data;
        next();
    } );
} );

app.use( '/static', express.static( 'web/content/static' ) );

class HTMLContent {
    private content: string;

    constructor( file: string ) {
        this.content = FS.readFileSync( `web/content/${file}`, 'utf8' );
    }

    public format( args: Utils.Dictionary ): string {
        return this.content.replace( /\$\{([^\}]+)\}/g, ( str: string, id: string ) => {
            return String( args[id] );
        } );
    }
}

var newAudioPage: HTMLContent = new HTMLContent( 'new-audio.html' );
var newAudioErrorPage: HTMLContent = new HTMLContent( 'new-audio-error.html' );

app.get( /^\/new\-audio\/([a-f0-9\-]{36})\/?$/, ( req: express.Request, resp: express.Response ) => {
    let [, token] = req.path.match( /^\/new\-audio\/([a-f0-9\-]{36})\/?$/ ) || [, ''];

    if ( !token ) {
        resp.status( 404 );
        resp.send( 'Invalid URL requested.' );
        return;
    }

    resp.status( 200 );
    resp.contentType( 'text/html' );

    let error: string;

    let audioRequest: AudioModule.IAudioRequest = AudioModule.audioRequests[token];

    let guild: Discord.Guild;
    let channel: Discord.TextChannel;

    if ( !audioRequest )
        error = `Invalid or expired link.<br>You can request the bot a new one.`
    else {
        guild = App.botClient.guilds.get( audioRequest.guildId );
        if ( !guild )
            error = `The Discord server where you made your request is not available at the moment.`;
        else {
            channel = <Discord.TextChannel>guild.channels.get( audioRequest.channelId );
            if ( !channel )
                error = `The channel where you made your request is no longer available at "${guild.name}".`;
        }
    }

    if ( error ) {
        resp.end( newAudioErrorPage.format( {
            errorMessage: error
        } ) );
    } else {
        resp.end( newAudioPage.format( {
            serverName: guild.name,
            channelName: channel.name,
            token: token
        } ) );
    }

    
} );

app.post( '/submit-audio', ( req: express.Request, resp: express.Response ) => {
    resp.status( 200 );
    resp.contentType( 'text/json' );

    let token = req.query.token || '';
    let audioRequest: AudioModule.IAudioRequest = AudioModule.audioRequests[token];

    let error;

    let guild: Discord.Guild;
    let channel: Discord.TextChannel;

    if ( !audioRequest )
        error = `Invalid or expired audio request.<br>You must request the bot a new link.`;
    else {
        guild = App.botClient.guilds.get( audioRequest.guildId );
        if ( !guild )
            error = `The Discord server where you made your request is not available at the moment.`;
        else {
            channel = <Discord.TextChannel>guild.channels.get( audioRequest.channelId );
            if ( !channel )
                error = `The channel where you made your request is no longer available at "${guild.name}".`;
        }
    }

    let audio: Buffer;

    if ( !error ) {
        audio = Buffer.from( decodeURIComponent( req.body ), 'base64' );

        if ( audio.length == 0 || audio.length > 7 * 1e+6 ) // Size limit of 7MB.
            error = `Invalid or corrupted audio.`;
    }

    if ( error ) {
        resp.end( JSON.stringify( {
            success: false,
            error: error
        } ) );
    } else {

        channel.send( `🎙 Audio Message from <@${audioRequest.userId}>:`, {
            files: [
                new Discord.Attachment( audio, `Audio-${audioRequest.userName}-${new Date().toLocaleString()}.ogg` )
            ]
        } ).then( ( sentMsg: Discord.Message ) => {
            delete AudioModule.audioRequests[token];

            resp.end( JSON.stringify( {
                success: true
            } ) );
        } )
        .catch( reason => {
            error = `Unable to send your audio at "${guild.name}": ${reason}.`;
            resp.end( JSON.stringify( {
                success: false,
                error: error
            } ) );
        } );
   
    }

} );

export namespace Server {
    export function initializeServer() {
        console.log( `[!] Initializing web server...` );

        app.listen( Settings.HTTP_PORT, () => {
            console.log( `[!] Web server listening at port ${Settings.HTTP_PORT}.` );
        } );
    }
}