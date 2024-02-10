module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: ['pingo'],
	run: async (client, username, args) => {
		const { bot } = client;

		bot.chat(`Pong! ${bot.player?.ping || 0}ms!`)
	}
}