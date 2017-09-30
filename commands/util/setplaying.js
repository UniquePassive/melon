const commando = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

module.exports = class SetPlayingCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setplaying',
            group: 'util',
            memberName: 'setplaying',
            description: 'Sets the bot\'s playing status.',
            args: [
                {
                    key: 'string',
                    prompt: 'Specify a game name.',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args) {
        this.client.user
            .setGame(args.string);

        fs.writeFile(path.join(__dirname, 'playingGame.txt'), args.string); 
    }
};
