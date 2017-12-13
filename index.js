/* eslint consistent-return: 0, no-console: 0 */
const Discord = require('discord.js');

const config = require('./config.json');

const client = new Discord.Client();

const handleMessage = (message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong...').then((msg) => {
      msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms!`);
    });
  } else

  if (command === 'say') {
    if (message.author.id !== config.ownerID) return message.reply('Not enough permissions!');
    message.channel.send(args.join(' '));
    message.delete();
  } else

  if (command === 'announce') {
    const AnnouncePerm = message.guild.roles.find("name", "Announce Permission");
    if(!message.member.roles.has(AnnouncePerm.id)) {
      return message.channel.send('You do not have enough **permissions** to execute this command (Announce Permission required!)');
    }
    const announce = announcement = args.join(" ");
    const embed = new Discord.MessageEmbed() 
      .setThumbnail(message.guild.iconURL())
      .setFooter('Server owned by ' + message.guild.owner.user.tag, message.guild.owner.user.avatarURL())
      .setColor(0x16A085)
      .addField(`Announcement by ${message.author.username}!`, `${announcement}`)
    message.channel.send({ embed });
    message.delete();
  }

  if (command === 'exe') {
    if(message.author.id !== config.ownerID) return;
    try {
      const code = args.join(" ");
      const evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

  if (command === 'cmds') {
    message.channel.send('Adding it soon, stay stuned!');
  }
};

const handleGuildCreate = (guild) => {
  console.log(`I have been added to the guild: ${guild.name}, Owned by: ${guild.owner.user.tag}, with ${guild.memberCount} members.`);
};

const handleReady = () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame('!cmds');
};

const handleGuildMemberAdd = (member) => {
  console.log(`${member.user.tag} (${member.id}) has joined ${member.guild.name} (${member.guild.id})`);
  const welcomeChannel = member.guild.channels.find('name', 'welcome');
  if (welcomeChannel) {
    welcomeChannel.send(`Please welcome ${member.user.tag} to our wonderful guild!`);
  }
};

client.on('message', handleMessage);
client.on('guildCreate', handleGuildCreate);
client.on('ready', handleReady);
client.on('guildMemberAdd', handleGuildMemberAdd);

client.login(process.env.BOT_TOKEN);