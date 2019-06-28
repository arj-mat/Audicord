# Audicord

This Node.JS bot, written in TypeScsript, implements a web server and browser-side JavaScript, allowing to quickly record and submit audio messages over Discord text channels.

Works on Chrome and Firefox, on PC and Android. 

# Demonstration
Type **/audio** on a text channel and the bot will DM you a private link, directing to it's web server where you'll be able to record a message from your microphone.

Allow microphone access on your browser when requested.

You can record up to 1 minute and listen to your message before submitting.

Audio is uploaded to Discord and will be available on the channel where you typed */audio*, as an embed.

![Audicord screenshot](https://github.com/arj-mat/Audicord/blob/master/web/content/static/img-dm.png?raw=true)

![Audicord screenshot](https://github.com/arj-mat/Audicord/blob/master/web/content/static/img-recording.png?raw=true)

![Audicord screenshot](https://raw.githubusercontent.com/arj-mat/Audicord/master/web/content/static/screenshot1.png)

# Notes

A valid Discord Bot Token must be provided on *settings.js|settings.ts*. You can get yourself one at https://discordapp.com/developers/applications/.

Run *npm install* for installing dependencies.

Initialize Node.JS on *app.js*.

This project relies on the [Discord.js API](https://github.com/discordjs/discord.js).

Made for for the [2019 Discord Hackweek](https://blog.discordapp.com/discord-community-hack-week-build-and-create-alongside-us-6b2a7b7bba33).
