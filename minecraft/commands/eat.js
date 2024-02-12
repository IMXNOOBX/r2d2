module.exports = {
	name: 'eat',
	description: 'Eats food from inventory.',
	aliases: ['food'],
	run: async (client, username, args) => {
		const { bot } = client;

		/**
		 * this code is checked in the eat function and we want to bypass it so we set temporally the startAt to 20 (max)
			 if (
				bot.autoEat.isEating ||
				bot.autoEat.disabled ||
				bot.food > bot.autoEat.options.startAt ||
				bot.food > 19
			)
		 */
		bot.autoEat.options.startAt = 21

		if (bot.food == 20 && bot.health == 20)
			return bot.chat('I am full!')

		bot.autoEat
			.eat()
			.then((successful) => {
				if (!successful)
					return bot.chat('I dont have anything to eat :(')

				if (bot.food == 20)
					bot.chat('I am full!')
				else
					bot.chat('I am still hungry! ñam!')
			})
			.catch((error) => {
				client.log.error(error)
			})

		bot.autoEat.options.startAt = client.config.bot.auto_eat
	}
}