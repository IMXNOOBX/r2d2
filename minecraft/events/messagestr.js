module.exports.run = async (client, message, position, msg, sender, verified) => {
    const { bot } = client;

	// console.log(`message: ${message}, position: ${position}, sender: ${sender}, verified: ${verified}`)

	if (sender)
		return;

	// Auto sleep? it should work in theory
	if (message.includes('sleeping')) {
		const bed = bot.findBlock({
			matching: block => bot.isABed(block)
		})

		if (bed) 
			await bot.sleep(bed)
				.catch(e => {})

		return;
	}

	// Nevers seen this before, it happens after the bot is some time connected
	if (message.includes('expired profile public key')) {
		const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_chat != null;
		if (bridge) {
			const chat_channel = await client.db.get('dsc.server_chat') ?? client.config.discord.server_chat;
			const channel = await client.channels.cache.get(chat_channel);
			if (channel) 
				channel.send(`Bot's public key expired, reconnecting...`);
		}

		return bot.quit(message);
	}

	/**
	 * Filter out the messages that are not from the player
	 * Or join/leave messages, not really proud of this tbh
	 */
	const players = Object.keys(bot.players);

	if (
		players.some(ply => message.includes(ply)) ||// Filter all server messages to the client
		message.includes('game') // Filter joing/leave messages
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
