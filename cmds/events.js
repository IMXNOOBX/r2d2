module.exports = {
    name: 'events',
    description: 'Select a channel to brigde minecraft events.',
    options: [
		{
            name: "channel",
            description: "Channel to bridge with minecraft events.",
            type: 7, // Channel
            required: true
        }
	],
    run: async (client, interaction) => {
        if (client.config.manager.discord !== interaction.user.id) 
            return interaction.followUp({ content: 'You are not allowed to use this command!' });

        const channel = interaction.options.getChannel('channel');

        const chan = await client.channels.cache.get(channel)

        if (!chan)
            return interaction.followUp({ content: 'Invalid channel!' });

        chan.send('This channel is now bridged with minecraft events!');

        await client.db.set('dsc.server_events', channel);

        interaction.followUp({ content: `Succesfully changed minecraft event bridge to ${channel.name}` })
    }
}
