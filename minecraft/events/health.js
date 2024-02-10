const cache = {
	health: 20,
	food: 20
}

module.exports.run = async (client) => {
    const { bot } = client;

	const health = Math.floor(bot.health);
	const food = Math.floor(bot.food);

	if (cache.health == health && cache.food == food) return;

	cache.health = health
	cache.food = food;

	if (health == 20)
		bot.autoEat.disable()
	else
		bot.autoEat.enable()

	// if (health <= client.config.bot.minimum_hp)
	// 	bot.quit(`Low hp limit reached! ${health} < ${client.config.bot.minimum_hp}!`);	

	if (food <= client.config.bot.minimum_food)
		bot.quit(`Low food limit reached! ${food} < ${client.config.bot.minimum_food}!`);

    client.log.console(`[MC] | Bots health changed from ${cache.health} => ${health} and hunger ${cache.food} => ${food}!`);   
}    