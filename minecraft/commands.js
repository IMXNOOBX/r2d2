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

// No need to unregister
module.exports = { register_commands }