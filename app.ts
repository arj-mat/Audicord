 /*
  * Audicord Bot
  * Author: Mateus Araújo - 2019
  * https://github.com/arj-mat
  * Bot - Main
*/

import * as Settings from "./settings";
import * as Discord from "discord.js";
import * as Commands from "./commands";
import * as Web from "./web";

console.log( `Audicord v${Settings.VERSION.toLocaleString().replace( /\,/g, '.' )}` );

if ( !Settings.BOT_TOKEN )
    throw new Error( "Bot token is missing at settings.ts|settings.js." );

export var botClient: Discord.Client = new Discord.Client();

botClient.on( 'message', ( msg: Discord.Message ) => {

    if ( msg.author.bot )
        return;

    if ( msg.content == "/audio" )
        Commands.Audio.handle( msg );
    else if ( msg.content == "/audiping" )
        Commands.Ping.handle( msg );
        
} );

console.log( '[!] Connecting...' );

botClient.login( Settings.BOT_TOKEN )
    .then( () => {
        console.log( `[!] Bot sucessfully logged in as ${botClient.user.tag}.` );
        Web.Server.initializeServer();
    } )
    .catch( ( reason ) => {
        console.log( `[X] Login failed: ${reason}.` );
    } );