const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class KickAllVoiceCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'kickallvoice',
            group: 'util',
            memberName: 'kickallvoice',
            description: 'Kicks all users from voice chat.'
        });
    }

    //hasPermission(msg) {
    //    return this.client.isOwner(msg.author);
    //}

    async run(message, args) {
        message.delete();

        Array.from(this.client.channels.values())
            .forEach(channel2 => {
                if (channel2 instanceof Discord.VoiceChannel) {
                    Array.from(channel2.members.values())
                        .forEach(member => {
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
                        });
                }
            });
    }
};
