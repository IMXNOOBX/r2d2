const autoeat = require('mineflayer-auto-eat');
const pathfinder = require('mineflayer-pathfinder')

const cmd_handler = require('./commands')
const event_handler = require('./events')

/**
 * Attempt to recconect automatically
 * @param {Client} client 
 */
const await_reconnect = async (client) => {
    client.axios.get(`https://mcapi.us/server/status?ip=${process.env.MINECRAFT_SERVER}&port=${process.env.MINECRAFT_PORT}`)
        .then(async (res) => {
            if (!res.data.online) 
                return client.log.console(`[MC] | Server is offline, awaiting reconnect...`);

            const elsewhere = (res.data.players.now) ? res.data.players.sample.some(e => e.name.includes(process.env.MINECRAFT_USERNAME)) : false;

            if (elsewhere) 
                return client.log.console(`[MC] | Bot owner is still online, awaiting reconnect...`);

           await initialize(client);

            if (!client.bot) 
                return client.log.error(`[MC] | Bot failed to reconnect!`);

            client.log.success(`[MC] | Bot reconnected to the server successfully!`);
			
			if(client.recon_interval)
            	clearInterval(client.recon_interval);
        }).catch((e) => client.log.error(`[MC] | Error while reconnecting: ${e}`));
}

const restart = async (client, force = false) => {
	const bot = client.bot
	client.log.console('[MC] | Bot restart requested.')

	// If the bot is running/initialized remove it and create it again
	if (bot) {
		client.log.console('[MC] | Deleting bot instance and unregistering events.')

		event_handler.unregister_events(client)

		bot.end()
		delete client.bot;

	}

	if (force)
		return await initialize(client)

	if (client.recon_interval) {
		client.log.console('[MC] | Bot is already awaiting to reconnect. Restarting...')
		clearInterval(client.recon_interval)
	}

	
	client.recon_interval = setInterval(
		await_reconnect, 
		(client.config.bot.reconnect_interval || 60) * 1000, 
		client
	);

	client.log.console('[MC] | Registered bot for reconnection')
}

/**
 * Initialize Minecraft Bot
 * @param {Client} client 
 * @returns 
 */
const initialize = async (client) => {
	if (
		!process.env.MINECRAFT_USERNAME // ||
			// (
			// 	!process.env.MINECRAFT_PASSWORD && 
			// 	process.env.MINECRAFT_AUTH != 'offline'
			// )
	) {
		client.log.error('[MC] | Missing Minecraft Credentials, Please fix your .env file.');
		return false;
	}

	client.log.console('[MC] | Creating Minecraft Bot...');
	
	const bot = client.mc.createBot({
		host: process.env.MINECRAFT_SERVER,
		username: process.env.MINECRAFT_USERNAME, 
		auth: process.env.MINECRAFT_AUTH,
		port: process.env.MINECRAFT_PORT|| 25565,
		version: process.env.MINECRAFT_VERSION || false,
		// password: process.env.MINECRAFT_PASSWORD
	})

	client.log.console('[MC] | Bot logged in successfully as ' + process.env.MINECRAFT_USERNAME + ' on ' + process.env.MINECRAFT_SERVER + ':' + (process.env.MINECRAFT_PORT || 25565) + ' with ' + process.env.MINECRAFT_AUTH + ' auth.');

	client.bot = bot;

	bot.loadPlugin(autoeat.plugin);
	bot.loadPlugin(pathfinder.pathfinder)

	bot.on('spawn', () => {
        bot.autoEat.options = {
            priority: 'foodPoints',
            startAt: client.config.bot.auto_eat,
            bannedFood: []
        };
    });

	event_handler.register_events(client);
	cmd_handler.register_commands(client);

	return true;
}

module.exports = { initialize, restart }