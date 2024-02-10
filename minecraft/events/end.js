module.exports.run = async (client, error) => {
    const { bot } = client;

    client.log.error(`[MC] | Client connection ended: ${error}`);

	const manager = client.config.manager.discord

	if (!manager) return;

	client.users.send(
		manager, 
		`<a:rojito:834745752939921428> | Client connection ended: **${error}**`
		).catch(e => client.log.error(`[MC] | Error sending message to manager: ${e}`));
}    
