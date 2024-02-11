module.exports = {
    name: 'disable',
    description: 'Disable certain features of the bot.',
    options: [
		    {
            name: "module",
            description: "Select module to disable from the bot",
            type: 3, // String
            choices: [
                {
                  name: "Chat/Event Bridge",
                  value: "bridge"
                },
                {
                  name: "Minecraft Commands",
                  value: "commands"
                },
                {
                  name: "Intruder Detection",
                  value: "intruder"
                }
            ],
            required: true
        },
		    {
            name: "enable",
            description: "Enable or disable the module",
            type: 5, // Boolean
            required: true
        },
	],
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
            return interaction.followUp({ content: 'You are not allowed to use this command!' });

        const module = interaction.options.getString('module');
        const enable = interaction.options.getBoolean('enable');

        await client.db.set(`bot.${module}`, enable);

        interaction.followUp({ content: `Succesfully ${enable ? 'enabled' : 'disabled'} ${module} module.` })
    }
}
