const { Movements, goals } = require('mineflayer-pathfinder')


module.exports = {
	name: 'comehere',
	description: 'Goes to the executor\'s position',
	aliases: ['come', 'here'],
	run: async (client, username, args) => {
		const { bot } = client;

		if (username != client.config.manager.minecraft) 
			return bot.chat('You are not allowed to use this command!')

		const target = bot.players[username]

		if (!target)
			return bot.chat('I don\'t see you!')
		
		const target_pos = target.entity.position

		bot.pathfinder.setMovements(new Movements(bot))
		bot.pathfinder.setGoal(new goals.GoalBlock(target_pos.x, target_pos.y, target_pos.z))
	}
}