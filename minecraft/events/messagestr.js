module.exports.run = async (client, message, position, msg, sender, verified) => {
    const { bot } = client;

	/**
	 * Filter out the messages that are not from the player
	 * Or join/leave messages, not really proud of this tbh
	 */
	if (
		sender ||
		position == 'chat' ||
		message.includes('left') || message.includes('joined')
	)
		return;

	const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_events != null;

	if (!bridge) return;

	const events_channel = await client.db.get('dsc.server_events') ?? (client.config.discord.server_events || client.config.discord.server_chat);

	if (!events_channel) return;

	const channel = await client.channels.cache.get(events_channel);

	if (channel) 
		channel.send(`<:devSign:834745777762598953> ${position == 'system' ? 'Server' : position}: ${message}`);
	else
		client.log.error(`[MC] | Event: Channel not found!`);

}    
