 /*
  * Audicord Bot
  * Author: Mateus Araújo - 2019
  * https://github.com/arj-mat
  * Commands - Ping
*/

import { Message } from "discord.js";

export namespace Ping {
    export function handle( msg: Message ) {
        msg.reply( `ping ${Date.now() - msg.createdTimestamp} ms.` );
    }
}