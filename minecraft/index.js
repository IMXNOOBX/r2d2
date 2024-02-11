const autoeat = require('mineflayer-auto-eat');
const pathfinder = require('mineflayer-pathfinder')

/**
 * Register Minecraft Events
 * @param {Client} client 
 */
const register_events = async (client) => {
    const events = client.fs.readdirSync('./minecraft/events/').filter(file => file.endsWith('.js'));

	const loaded_modules = [];
	const failed_modules = [];
	for (let file of events) {
        try {
            let ev = require(`./events/${file}`);

            if (ev.event && typeof ev.event !== 'string') 
                continue;

            ev.event = ev.event || file.replace('.js', '')
            client.bot.on(ev.event, ev.run.bind(null, client))

			loaded_modules.push(ev.event);
        } catch (err) {
			failed_modules.push(file);
            client.log.error('[MC] | Error while loading event: ' + file + ' | ' + err?.message);
        }
    }

	client.log.console('[MC] | Loaded events: ' + loaded_modules.join(', '));
	if (failed_modules.length > 0)
		client.log.error('[MC] | Failed to load: ' + failed_modules.join(', '));

    client.log.console(`[MC] | Loaded ${loaded_modules.length} events sucessfully!`);
}

/**
 * Register Minecraft Commands
 * @param {Client} client 
 */
const register_commands = async (client) => {
    const commands = client.fs.readdirSync('./minecraft/commands/').filter(file => file.endsWith('.js'));

	const loaded_cmd = [];
	const failed_cmd = [];

	const command_list = [];

	for (let file of commands) {
        try {
            let command = require(`./commands/${file}`);

			if (command.name && typeof command.name !== 'string') 
				continue;

			loaded_cmd.push(command.name);				
			command_list.push(command);
		} catch (err) {
			failed_cmd.push(file);
			client.log.error('[MC] | Error while loading command: ' + file + ' | ' + err?.message);
        }
    }

	client.log.console('[MC] | Loaded commands: ' + loaded_cmd.join(', '));
	if (failed_cmd.length > 0)
		client.log.error('[MC] | Failed to load: ' + loaded_cmd.join(', '));

    client.log.console(`[MC] | Loaded ${loaded_cmd.length} commands sucessfully!`);

	client.mc_commands = command_list;
}

/**
 * Attempt to recconect automatically
 * @param {Client} client 
 */
var reconnect_interval;
const await_reconnect = async (client) => {
    client.axios.get(`https://mcapi.us/server/status?ip=${process.env.MINECRAFT_SERVER}&port=${process.env.MINECRAFT_PORT}`)
        .then((res) => {
            if (!res.data.online) 
                return client.log.console(`[MC] | Server is offline, awaiting reconnect...`);

            const elsewhere = (res.data.players.now) ? res.data.players.sample.some(e => e.name.includes(process.env.MINECRAFT_USERNAME)) : false;

            if (elsewhere) 
                return client.log.console(`[MC] | Bot owner is still online, awaiting reconnect...`);

            client.bot = initialize(client);

            if (!client.bot) 
                return client.log.error(`[MC] | Bot failed to reconnect!`);

            client.log.success(`[MC] | Bot reconnected to the server successfully!`);
            clearInterval(reconnect_interval);
        }).catch((e) => client.log.error(`[MC] | Error while reconnecting: ${e}`));
}

/**
 * Initialize Minecraft Bot
 * @param {Client} client 
 * @returns 
 */
const initialize = async (client) => {
	if (
		!process.env.MINECRAFT_USERNAME ||
			(
				!process.env.MINECRAFT_PASSWORD && 
				process.env.MINECRAFT_AUTH != 'offline'
			)
	)
		return client.log.error('[MC] | Missing Minecraft Credentials');

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

	register_events(client);
	register_commands(client);
}

module.exports = { initialize, await_reconnect }