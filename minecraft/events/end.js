const mcbot = require('../index');

module.exports.run = async (client, error) => {
    const { bot } = client;

    client.log.error(`[MC] | Client connection ended: ${error}`);
	
	{
		const manager = client.config.manager.discord

		if (manager) 
			client.users.send(
				manager, 
				`<a:rojito:834745752939921428> | Client connection ended: **${error}**`
				).catch(e => client.log.error(`[MC] | Error sending message to manager: ${e}`));
	}

	{
		const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_chat != null;

		if (bridge) {
			const chat_channel = await client.db.get('dsc.server_chat') ?? client.config.discord.server_chat;
			
			const channel = await client.channels.cache.get(chat_channel);

			if (channel) 
				channel.send(`# <a:rojito:834745752939921428> Bot has been disconnected from the server.`);
		}
	}

	mcbot.restart(client);
}
