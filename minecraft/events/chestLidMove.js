var last_action
module.exports.run = async (client, block, isOpen) => {
    const { bot } = client;

	if (last_action === isOpen) return;
	last_action = isOpen;

	const players = Object.values(bot.players).filter(player => {
		return player.username !== bot.username && player.entity;
	}).sort((a, b) => a.entity.position.distanceTo(bot.entity.position) - b.entity.position.distanceTo(bot.entity.position));
	
	if (players.length === 0) return;
	
	const action = isOpen ? 'open' : 'close'
	
	client.log.console(`[MC] | Chest ${action} nearby, these are posible players ordered by distance ${players.map(p => p.username).join(', ')}!`);
}