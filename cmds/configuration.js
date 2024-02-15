module.exports = {
    name: 'configuration',
    description: 'Diferent options to configure the bot.',
    options: [
        {
            name: "action",
            description: "Select action to perform on the bots configuration",
            type: 3, // String
            choices: [
                {
                    name: "Reset to default",
                    value: "reset"
                },
            ],
            required: true
        },
    ],
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
            return interaction.followUp({ content: '\`\`\`diff\n- You are not allowed to use this command!\`\`\`' });
    
        const action = interaction.options.getString('action');

        if (action === 'reset') {
            await client.db.set('dsc', null);
            await client.db.set('mc', null);
            await client.db.set('bot', null);
            return interaction.followUp({ content: `> Successfully restored the config to the default config.js` })
        }
    }
}
