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

	if (client.bot.spawned) // else it wont have time to heal
	if (health <= client.config.bot.minimum_hp && health > 0) // If 0 we alre already dead so no need to quit
		bot.quit(`Low hp limit reached! ${health} < ${client.config.bot.minimum_hp}!`);	

	if (health <= 0) {
		const manager = client.config.manager.discord
		if (!manager) return;
		client.users.send(
			manager, 
			`<a:rojito:834745752939921428> | Bot died see server chat for the reason, hp was **${health}**/20`
			).catch(e => client.log.error(`[MC] | Error sending message to manager: ${e}`));
	}

	if (client.bot.spawned) // else it wont have time to mineflayer-auto-eat
	if (food <= client.config.bot.minimum_food)
		bot.quit(`Low food limit reached! ${food} < ${client.config.bot.minimum_food}!`);

    client.log.console(`[MC] | Bots health changed from ${cache.health} => ${health} and hunger ${cache.food} => ${food}!`);   
}    