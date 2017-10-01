const commando = require('discord.js-commando');

module.exports = class SetAvatarCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'setavatar',
            group: 'util',
            memberName: 'setavatar',
            description: 'Sets the bot\'s avatar.',
            args: [
                {
                    key: 'url',
                    prompt: 'Specify a URL to an image.',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args) {
        this.client.user
            .setAvatar(args.url);
    }
};
