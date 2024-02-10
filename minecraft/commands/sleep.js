module.exports = {
	name: 'sleep',
	description: 'Tells the bot to sleep.',
	aliases: ['sleep', 'bed', 's'],
	run: async (client, username, args) => {
		const { bot } = client;

		const bed = bot.findBlock({
			matching: block => bot.isABed(block)
		})

		if (!bed) 
			return bot.chat('No nearby bed')

		try {
			await bot.sleep(bed)
			bot.chat("I'm sleeping")
		} catch (err) {
			bot.chat(`I can't sleep: ${err.message}`)
		}
	}
}