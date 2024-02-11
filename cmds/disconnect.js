module.exports = {
    name: 'disconnect',
    description: 'Disconnect the bot from the server thats been monitored.',
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
        return interaction.followUp({ content: 'You are not allowed to use this command!' });
    
        const bot = client.bot;

        if (!bot)
            return interaction.followUp({ content: 'Bot is not connected to any server!' });

        bot.quit(`Manually disconnected from discord by ${interaction.user.username}!`);

        interaction.followUp({ content: `Succesfully disconnected from server` })
    }
}
