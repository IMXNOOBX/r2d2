const mcbot = require('../minecraft/index');

module.exports = {
    name: 'reload',
    description: 'Quickly reload the bot\'s configuration.',
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
            return interaction.followUp({ content: '\`\`\`diff\n- You are not allowed to use this command!\`\`\`' });
    
        client.config = require('../conf/config');
      
        interaction.followUp({ content: `> Succesfully reloaded configuration.` })
    }
}
