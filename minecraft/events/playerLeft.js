module.exports.run = async (client, player) => {
    const { bot } = client;

    const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_events != null;

	if (!bridge) return;

	const events_channel = await client.db.get('dsc.server_events') ?? (client.config.discord.server_events || client.config.discord.server_chat);

	if (!events_channel) return;

	const channel = await client.channels.cache.get(events_channel);

	if (channel) 
		channel.send(`<a:rojito:834745752939921428> **${player.username}** left the server!`);
	else
		client.log.error(`[MC] | Event: Channel not found!`);

    client.log.console(`[MC] | Player left: ${player.username}!`);   
}    
