const bot = require('../minecraft/index');


module.exports.run = async (client) => {
  client.log.console(
    `[BOT] | Username: ${client.user.tag} | Guilds: ${client.guilds.cache.size} servers | Users: ${client.users.cache.size} total users`
  );

  bot.initialize(client);
  
  client.user.setStatus("dnd"); // online, idle, dnd, invisible

  const set_activity = async() => {
    var statuses = [
      `Bot is currently disconnected!`,
      `github.com/IMXNOOBX`,
    ];

    if (client.bot) 
      statuses = [
        `my ${client.bot.health || 0}hp & ${client.bot.food || 0} food`,
        `${Object.keys(client.bot.players || {}).length} players`,
        `${process.env.MINECRAFT_SERVER} with a ping ${client.bot.player?.ping || 0}ms`
        `github.com/IMXNOOBX`,
      ]

    const status = statuses[Math.floor(Math.random() * statuses.length)]; // Easy way to make random dynamic statuses
    client.user.setActivity(status, { type: client.discord.ActivityType.Watching }); // LISTENING, WATCHING, PLAYING
  }

  setInterval(set_activity, 30 * 1000); set_activity(); 
};