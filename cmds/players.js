module.exports = {
    name: 'players',
    description: 'Get the list of players on the server.',
    run: async (client, interaction) => {
        const { bot } = client;

        if (!bot)
            return interaction.followUp({ content: 'Bot is not connected to the server!' });

        const players = Object.keys(bot.players);

        if (players.length === 0)
            return interaction.followUp({ content: 'No players online!' });

        interaction.followUp({ content: `Players online: **${players.join('**, **')}**` });
    }
}