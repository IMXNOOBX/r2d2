module.exports = {
    name: 'prefix',
    description: 'Change the prefix for the bot.',
    options: [
		{
            name: "type",
            description: "Change discord/minecraft bot prefix. discord disabled due to slash commands.",
            type: 3, // String
            choices: [
                {
                  name: "Discord Bot (disabled)",
                  value: "dbot"
                },
                {
                  name: "Minecraft Bot",
                  value: "mbot"
                }
            ],
            required: true
        },
		{
            name: "prefix",
            description: "Prefix to change to.",
            type: 3, // String
            required: true
        },
	],
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
            return interaction.followUp({ content: '\`\`\`diff\n- You are not allowed to use this command!\`\`\`' });

        const type = interaction.options.getString('type');
        const prefix = interaction.options.getString('prefix');

        if (type == 'dbot')
            return interaction.followUp({ content: 'Discord bot prefix is disabled, we are using slash commands!' });

        if (prefix.length > 2)
            return interaction.followUp({ content: 'Prefix too long, use a maximun of 2 characters!' });

        await client.db.set(`${type == 'dbot' ? 'dsc' : 'mc'}.prefix`, prefix);

        interaction.followUp({ content: `> Changed the prefix for ${type == 'dbot' ? 'discord' : 'minecraft'} bot to ${prefix}` })
    }
}
