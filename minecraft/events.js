const registered_events = [];

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
			const handler = ev.run.bind(null, client);
            client.bot.on(ev.event, handler)

			registered_events.push({ event: ev.event, handler })

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
 * Clear previously registered event handlers
 * @param {Client} client 
 */
const unregister_events = (client) => {
    registered_events.forEach(({ event, handler }) => {
        client.bot.removeListener(event, handler);
    });

    registered_events.length = 0;
}

module.exports = { register_events, unregister_events }