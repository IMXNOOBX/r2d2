module.exports = {
	name: 'help',
	description: 'Find out what commands are available.',
	aliases: ['h'],
	run: async (client, username, args) => {
		const { bot } = client;

		if (args.length == 0) {
			bot.chat(`Here are the commands available: ${client.mc_commands.map(command => command.name).join(', ')}`)
			return bot.chat(`For more information about a specific command, use ${await client.db.get('mc.prefix') || client.config.bot.prefix}help <command>`)
		}

		const command = client.mc_commands.find(cmd => cmd.name === args[0] || cmd.aliases.includes(args[0]));

		if (command)
			return bot.chat(`Command: ${command.name}, Aliases: ${command.aliases.join(', ')}\nDescription: ${command.description}`)
	}
}