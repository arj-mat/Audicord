"use strict";
/*
 * Audicord Bot
 * Author: Mateus Araújo - 2019
 * https://github.com/arj-mat
 * Commands - Audio
*/
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const BotModules = require("../bot_modules");
const Utils = require("../utils");
const Settings = require("../settings");
var Audio;
(function (Audio) {
    function handle(msg) {
        if (!(msg.channel instanceof Discord.TextChannel)) {
            msg.channel.send('This command is only available on servers channels.');
            return;
        }
        let result = BotModules.AudioModule.newAudioRequest(msg.author.id, msg.author.username, msg.guild.id, msg.channel.id);
        if (result.success) {
            msg.author.createDM()
                .then((dm) => {
                dm.send('', {
                    embed: new Discord.RichEmbed()
                        .setTitle('🎙 New Audio Message')
                        .setDescription(`Use the link below to record an audio message and submit it to \`${msg.guild.name}\` at \`#${msg.channel.name}\`: \n\n${Settings.HTTP_WEBSITE_HOST}/new-audio/${result.token}`)
                        .setFooter(`This link expires in ${Math.round(BotModules.AudioModule.AUDIO_REQUEST_TIMEOUT / Utils.MINUTE)} minutes. Do NOT share it with anyone.`)
                })
                    .then((sentDMMsg) => {
                    msg.react('✅').catch();
                    msg.reply('I have sent you a private message with the instructions for recording your audio. ', {
                        embed: new Discord.RichEmbed().setDescription(`[[Click here to open it]](${sentDMMsg.url})`)
                    })
                        .then((sentReply) => {
                        setTimeout(() => {
                            sentReply.delete();
                        }, 7000); // Delete the reply within 7 seconds
                    });
                })
                    .catch((reason) => {
                    msg.reply(`I'm unable to send you a private message at the moment (${reason}).`);
                });
            })
                .catch((reason) => {
                msg.reply(`I'm unable to send you a private message at the moment (${reason}).`);
            });
        }
        else {
            msg.reply(`${result.errorMessage}`);
        }
    }
    Audio.handle = handle;
})(Audio = exports.Audio || (exports.Audio = {}));
//# sourceMappingURL=audio.js.map