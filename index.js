const LOGIN_TOKEN = '';
const LOG_CHANNEL = 'melon';

const MESSAGE_DELETED_EVENT_ID = '#0';
const MESSAGE_DELETED_MESSAGE = "**Meddelande bortsopat från {channel}**";
const MESSAGE_DELETED_COLOR = 'FF470F';

const MESSAGE_UPDATED_EVENT_ID = '#1';
const MESSAGE_UPDATED_MESSAGE = "**Meddelande i {channel} redigerat**\n\"{oldmsg}\"\n**till**\n\"{newmsg}\"";
const MESSAGE_UPDATED_COLOR = 'FF470F';

require('format-unicorn') // this adds formatUnicorn to String.prototype
const Discord = require('discord.js');
const client = new Discord.Client();

const messagesDeletedByUs = new Set();

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
            messagesDeletedByUs.add(message);

            // Delete the request message to get rid of spam
            message
              .delete()
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

client.on('messageUpdate', (oldmsg, newmsg) => {
  if (oldmsg.author === client.user) {
    return;
  }

  // Post a log in LOG_CHANNEL upon message update
  const channel = oldmsg.guild.channels
    .find(channel => channel.type === 'text' && channel.name === LOG_CHANNEL);

  channel.send(new Discord.RichEmbed({
    author: { name: oldmsg.author.tag },
    color: Number('0x' + MESSAGE_UPDATED_COLOR),
    description: MESSAGE_UPDATED_MESSAGE.formatUnicorn({ channel: oldmsg.channel, oldmsg: oldmsg.content, newmsg: newmsg.content }),
    thumbnail: { url: oldmsg.author.avatarURL },
    footer: { text: MESSAGE_UPDATED_EVENT_ID }
  }));
});

client.on('messageDelete', message => {
  if (messagesDeletedByUs.has(message)) {
    return;
  }

  // Post a log in LOG_CHANNEL upon message deletion
  const channel = message.guild.channels
    .find(channel => channel.type === 'text' && channel.name === LOG_CHANNEL);

  if (message.author === client.user && message.embeds.length > 0) {
    // Repost message deletion log if it was deleted
    const embed = message.embeds[0];

    if (embed.footer.text === MESSAGE_DELETED_EVENT_ID 
        || embed.footer.text === MESSAGE_UPDATED_EVENT_ID) {
      channel.send(new Discord.RichEmbed({
        author: { name: embed.author.name },
        color: embed.color,
        description: embed.description,
        thumbnail: { url: embed.thumbnail.url },
        footer: { text: embed.footer.text }
      }));
    }
  } else {
    channel.send(new Discord.RichEmbed({
      author: { name: message.author.tag },
      color: Number('0x' + MESSAGE_DELETED_COLOR),
      description: MESSAGE_DELETED_MESSAGE.formatUnicorn({ channel: message.channel })
        + (message.content !== '' ? '\n' + message.content : ''),
      thumbnail: { url: message.author.avatarURL },
      footer: { text: MESSAGE_DELETED_EVENT_ID }
    }));
  }
});

client.login(LOGIN_TOKEN);
