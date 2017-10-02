const commando = require('discord.js-commando');
var fs = require('fs');

module.exports = class SkipSongCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'skipsong',
            group: 'util',
            memberName: 'skipsong',
            description: 'Skips the playing of the current song.'
        });
    }

    async run(message, args) {
        message.guild
            .fetchMember(this.client.user)
            .then(clientMember => {
                if (clientMember.voiceChannel) {
                    if (clientMember.voiceChannel.connection) {
                        if (clientMember.voiceChannel.connection.dispatcher) {
                            clientMember.voiceChannel.connection.dispatcher.end();
                        }
                    }
                }
            });
    }
};
