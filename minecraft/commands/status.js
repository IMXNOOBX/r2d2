module.exports = {
	name: 'status',
	description: 'Show the status of the bot.',
	aliases: ['s'],
	run: async (client, username, args) => {
		const { bot } = client;

		if (username != client.config.manager.minecraft) 
			return bot.chat('You are not allowed to use this command!')

		const players = Object.values(bot.players).filter(player => {
			return player.username !== bot.username && player.entity;
		});

		const pos = `${Math.floor(bot.entity.position.x)}x ${bot.entity.position.y}y ${Math.floor(bot.entity.position.z)}z`
		const hostiles = bot.nearestEntity((entity) => entity.type === 'hostile');

		const message = `Ping: ${bot.player.ping}ms` +
						` | Health: ${bot.health}hp / Food: ${bot.food}` +
						` | Near players: ${players.length}` +
						` | Position: ${pos}` +
						` | Hostiles: ${hostiles ? `${hostiles.name} ${Math.floor(hostiles.position.distanceTo(bot.entity.position))}m away` : 'None'}`;

		bot.chat(message);
	}
}