module.exports = {
    name: 'status',
    description: 'Get the status from the discord & miecraft bot.',
    run: async (client, interaction) => {
        const bot = client.bot;

        if (!bot)
            return interaction.followUp({ content: 'Bot is not connected to any server!' });

        const players = Object.values(bot.players).filter(player => {
            return player.username !== bot.username && player.entity;
        });

        const message = `[Discord]\n`+
            ` > Ping: ${client.ws.ping}ms\n` +
            ` > Uptime: ${Math.floor(client.uptime / 1000)}s\n` +
            ` > Servers: ${client.guilds.cache.size}\n` +
            ` > Channels: ${client.channels.cache.size}\n` +
            ` > Users: ${client.users.cache.size}\n` +
            `[Miecraft]\n` +
            ` > Ping: ${bot.player.ping}ms\n` +
            ` > Game mode: ${bot.game.gameMode}\n` +
            ` > Difficulty: ${bot.game.difficulty}\n` +
            ` > Time: ${bot.time.day}d ${bot.time.time / 1000}s\n` +
            
            ` > Players: ${Object.keys(bot.players).length}\n` +
            ` > Near players: ${players.length}\n` +
            ` > Entities: ${Object.keys(bot.entities).length}\n` +
            ` > Hostiles: ${Object.values(bot.entities).filter(entity => entity.type === 'hostile').length}\n` +

            ` > Health: ${bot.health}hp / Food: ${bot.food}\n` +
            ` > Position: ${Math.floor(bot.entity.position.x)}x ${bot.entity.position.y}y ${Math.floor(bot.entity.position.z)}z\n`;

        interaction.followUp({ content: `\`\`\`ini\n${message}\`\`\`` })
    }
}
