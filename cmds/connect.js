const mcbot = require('../minecraft/index');

module.exports = {
    name: 'connect',
    description: 'Connect the bot to the server monitored or to a custom one.',
    options: [
		{
            name: "server",
            description: "New server to connect to. (Not Yet Implemented)",
            type: 3, // String
        },
        {
            name: "force",
            description: "Force the bot to connect to the server, even if it's already connected.",
            type: 5, // Boolean
        },
	],
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
        return interaction.followUp({ content: '\`\`\`diff\n- You are not allowed to use this command!\`\`\`' });
    
        const bot = client.bot;

        const server = interaction.options.getString('server');
        const force = interaction.options.getBoolean('force');
        
        if (force && bot) 
            bot.quit(`Manually disconnected from discord by ${interaction.user.username}!`);
        
        if (!force && bot)
            return interaction.followUp({ content: 'Bot seems to be already connected.' });

        if (force)
            mcbot.initialize(client);
        else
            mcbot.await_reconnect(client);

        interaction.followUp({ content: `> Succesfully ${force ? 're-initialized the bot' : 'prepared the bot for reconnection, awaiting checks and server status...'}` })
    }
}
