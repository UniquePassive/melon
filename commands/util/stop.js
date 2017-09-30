const commando = require('discord.js-commando');

module.exports = class StopCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'util',
            memberName: 'stop',
            description: 'Terminates the bot.'
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author);
    }

    async run(message, args) {
        message.delete();

        this.client
          .destroy()
          .then(() => {
            // After disconnecting, wait for 2s before forcing termination of the process
            setTimeout(process.exit(0), 2000);
          });
    }
};
