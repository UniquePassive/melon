const commando = require('discord.js-commando');
var fs = require('fs');

module.exports = class PlaySongCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'playsong',
            group: 'util',
            memberName: 'playsong',
            description: 'Plays a song.',
            args: [
                {
                    key: 'url',
                    prompt: 'Specify a URL to a song.',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args) {
        const voiceChannel = message.member.voiceChannel;
   
        if (!voiceChannel) {
            return message.reply("Please join a voice channel!");
        }
       
        if (!voiceChannel.joinable) {
            return message.reply(`I am not allowed to join ${voiceChannel.name}!`);
        }

        fs.access(args.url, function(err) {
            if (err) {
                return message.reply("I couldn't find a song from that URL, error: " + err.code);
            } else {
                voiceChannel
                    .join()
                    .then(connection => {
                        if (!connection.speaking) {
                            connection
                                .playFile(args.url)
                                .on('end', (reason) => {
                                    if (voiceChannel.members.size == 1) {
                                        voiceChannel.leave();
                                    }
                                });
                        }
                    });
            }
        });
    }
};
