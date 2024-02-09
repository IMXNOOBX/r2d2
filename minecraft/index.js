
/**
 * Register Minecraft Events
 * @param {Client} client 
 */
const register = async (client) => {
    const events = client.fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
    for (let file of events) {

        try {
            let ev = require(`../events/${file}`);

            if (ev.event && typeof ev.event !== 'string') 
                continue;

            ev.event = ev.event || file.replace('.js', '')
            client.on(ev.event, ev.run.bind(null, client.mc))
        } catch (err) {
            client.log.error('[MC] | Error While loading: ' + file);
        }
    }
    client.log.console('[MC] | Events Loaded Sucessfully!');
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
				client.config.minecraft.auth != 'offline'
			)
	)
		return client.log.error('[MC] | Missing Minecraft Credentials');

	const bot = client.mc.createBot({
		host: client.config.minecraft.server_ip,
		username: process.env.MINECRAFT_USERNAME, 
		auth: client.config.minecraft.auth,
		port: client.config.minecraft.port || 25565,
		version: client.config.minecraft.version || false,
		password: process.env.MINECRAFT_PASSWORD
	})

	client.bot = bot;

	register(client);
}

module.exports = { initialize }