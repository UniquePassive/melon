require('format-unicorn') // this adds formatUnicorn to String.prototype
const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');
const sqlite = require('sqlite');
const fs = require('fs');

const LOGIN_TOKEN = 'bot_token';
const LOG_CHANNEL = 'melon';

const MESSAGE_DELETED_EVENT_ID = '#0';
const MESSAGE_DELETED_MESSAGE = "**Meddelande bortsopat från {channel}**";
const MESSAGE_DELETED_COLOR = 'FF6464';

const MESSAGE_UPDATED_EVENT_ID = '#1';
const MESSAGE_UPDATED_MESSAGE = "**Meddelande i {channel} redigerat**\n\"{oldmsg}\"\n**till**\n\"{newmsg}\"";
const MESSAGE_UPDATED_COLOR = 'FEEFB3';

const client = new Commando.Client({
    owner: 'user_id',
    commandPrefix: '!'
    unknownCommandResponse: false
});

client.registry
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.on('ready', () => {
  console.log('Melon is ready!');

  fs.readFile(path.join(__dirname, 'commands/util/playingGame.txt'), "utf-8", function read(err, data) {
    if (err) {
      throw err;
    }
    client.user.setGame(data);
  });
});

client.on('messageUpdate', (oldmsg, newmsg) => {
  // Only send a content update if the actual content has changed
  if (oldmsg.content === newmsg.content) {
    return;
  }

  // Don't send a content update message if the author is the bot
  if (message.author === client.user) {
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
  // Post a log in LOG_CHANNEL upon message deletion
  const channel = message.guild.channels
    .find(channel => channel.type === 'text' && channel.name === LOG_CHANNEL);

  if (message.author === client.user && message.embeds.length > 0) {
    // Repost message deletion log if it was deleted
    const embed = message.embeds[0];

    if (embed.footer.text === MESSAGE_DELETED_EVENT_ID 
        || embed.footer.text === MESSAGE_UPDATED_EVENT_ID) {
      channel.send(new Discord.RichEmbed({
        author: { icon_url: embed.author.icon, name: embed.author.name },
        color: embed.color,
        description: embed.description,
        footer: { text: embed.footer.text }
      }));
    }
  } else {
    var content = message.content;

    // Add attachment links to content
    Array.from(message.attachments.values())
      .forEach(attachment => {
        if (content.length !== 0) {
          content += '\n';
        }
        content += attachment.url;
      });

    if (message.guild.available) {
      message.guild
        .fetchMember(message.author)
        .then(member => {
          channel.send(new Discord.RichEmbed({
            author: { icon_url: message.author.avatarURL, name: member.displayName },
            color: Number('0x' + MESSAGE_DELETED_COLOR),
            description: MESSAGE_DELETED_MESSAGE.formatUnicorn({ channel: message.channel })
              + (content !== '' ? '\n' + content : ''),
            footer: { text: MESSAGE_DELETED_EVENT_ID }
          }));
        });
    } else {
      channel.send(new Discord.RichEmbed({
        author: { icon_url: message.author.avatarURL, name: message.author.username },
        color: Number('0x' + MESSAGE_DELETED_COLOR),
        description: MESSAGE_DELETED_MESSAGE.formatUnicorn({ channel: message.channel })
          + (content !== '' ? '\n' + content : ''),
        footer: { text: MESSAGE_DELETED_EVENT_ID }
      }));
    }
  }
});

client.login(LOGIN_TOKEN);
