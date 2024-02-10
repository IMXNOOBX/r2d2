const mcbot = require('../index');

module.exports.run = async (client, reason, loggedIn) => {
    const { bot } = client;

    client.log.error(`[MC] | Client got kicked: ${reason} ${loggedIn ? 'during login' : 'after login'}`);   
    
    const extra = JSON.parse(reason).extra || [];

    const elsewhere = extra.some(e => e.text.includes('You logged in from another location'));

    if (elsewhere) {
        client.log.error(`[MC] | Bot owner logged in, awaiting reconnect...`);
        reconnect_interval = setInterval(mcbot.await_reconnect, 60 * 1000, client);
    }

    client.bot = null;

    const manager = client.config.manager.discord

	if (!manager) return;

	client.users.send(
		manager, 
		`<a:rojito:834745752939921428> | Client got kicked: **${extra.map(e => e.text).join(', ')}**`
		).catch(e => client.log.error(`[MC] | Error sending message to manager: ${e}`));
}