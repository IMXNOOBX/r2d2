module.exports = {
    name: 'chat',
    description: 'Select a channel to brigde with minecraft chat.',
    options: [
		{
            name: "channel",
            description: "Channel to bridge with minecraft chat.",
            type: 7, // Channel
            required: true
        }
	],
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
            return interaction.followUp({ content: '```diff\n- You are not allowed to use this command!```' });

        const channel = interaction.options.getChannel('channel');

        const chan = await client.channels.cache.get(channel)

        if (!chan)
            return interaction.followUp({ content: 'Invalid channel!' });

        chan.send('This channel is now bridged with minecraft chat!');

        await client.db.set('dsc.server_chat', channel);

        interaction.followUp({ content: `> Succesfully changed minecraft bridge to ${channel.name}` })
    }
}
