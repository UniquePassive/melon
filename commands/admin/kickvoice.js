const commando = require('discord.js-commando');

module.exports = class KickVoiceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'kickvoice',
            group: 'util',
            memberName: 'kickvoice',
            description: 'Kicks a user from voice chat.',
            args: [
                {
                    key: 'user',
                    prompt: 'Specify a user.',
                    type: 'user'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(message, args) {
        message.delete();

        message.guild
            .fetchMember(args.user)
            .then(member => {
                if (member.voiceChannel) {
                    var name = Math
                        .random()
                        .toString(36)
                        .replace(/[^a-z]+/g, '')
                        .substr(0, 5);

                    message.guild
                        .createChannel(name, "voice")
                        .then(channel => {
                            member.setVoiceChannel(channel)
                                .then(() => {
                                    channel.delete();
                                });
                        });
                }
            });
    }
};
