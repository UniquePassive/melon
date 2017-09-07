const LOGIN_TOKEN = '';

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Melon is ready!');
});

client.on('message', message => {
  // Terminate the bot if !stop is sent
  if (message.content === '!stop') {
    if (message.guild.available) {
      message.guild
        .fetchMember(message.author)
        .then(member => {
          // Only allow access to users with the Administrator permission
          if (member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
            // Delete the request message to get rid of spam
            message.delete()
              .then(msg => {
                // Destroy the Discord session
                client
                  .destroy()
                  .then(() => {
                    // After disconnecting, wait for 5s before forcing termination of the process
                    setTimeout(process.exit(0), 5000);
                  });
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }
});

client.login(LOGIN_TOKEN);
