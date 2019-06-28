 /*
  * Audicord Bot
  * Author: Mateus Araújo - 2019, source-code projects as credited
  * https://github.com/arj-mat
  * Utilities and snippets
*/

import * as Discord from "discord.js";

export function formatString( str: string, args: any[] ): string {
    return str.replace( /\%s/g, () => {
        return args.length > 0 ? String(args.shift()) : '%s';
    } );
}

export function capitalizeStr( str: string ): string {
    return str.substr( 0, 1 ).toUpperCase() + str.substr( 1 ).toLowerCase();
}

export interface Dictionary {
    [index: string]: any
}

export const SECOND: number = 1000;
export const MINUTE: number = SECOND * 60;
export const HOUR: number = MINUTE * 60;
export const DAY: number = HOUR * 24;