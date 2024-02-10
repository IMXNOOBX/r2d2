module.exports.run = async (client, username, message) => {
	const { bot } = client;
	if (username == bot.username) return;

	{
		const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_chat != null;

		if (bridge) {
			const chat_channel = await client.db.get('dsc.server_chat') ?? client.config.discord.server_chat;
			
			const channel = await client.channels.cache.get(chat_channel);

			if (channel) 
				channel.send(`**${username}**: ${message.replaceAll('@', '@\u200B')}`);
			else
				client.log.error(`[MC] | Chat Event: Channel not found!`);
		}
	}

    client.log.console(`[MC] | Chat Event: ${username} said ${message}`);

	if (!client.mc_commands || !client.config.bot.command)
		return;

	if (
		!await message.startsWith(await client.db.get('mc.prefix')) &&
		!message.startsWith(client.config.bot.prefix)
		) 
		return;

	const args = message.split(' ');
    const commandName = args.shift().toLowerCase().substring(1); // Remove prefix and convert to lowercase
    const command = client.mc_commands.find(cmd => cmd.name === commandName || cmd.aliases.includes(commandName));

	if (command) 
		command.run(client, username, args);
	else
		client.bot.chat('Unknown command!')
}    
