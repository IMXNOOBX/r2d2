const { Movements, goals } = require('mineflayer-pathfinder')

var cache = {
	angle: 0,
	angular_speed: 3,

	players: [],
	saluted_players: [],
	
	attack_intervals: [],

	last_defend_message: null,

	looker_interval: null,
	defender_interval: null,
	nearby_entities_interval: null,
}

module.exports.run = async (client) => {
    const { bot } = client;

	/**
	 * Here we will run some loops to make periodic actions
	 */
	if (!client.bot.spawned) {
		if (bot.entity)
			client.bot.spawn_coordinates = bot.entity.position;

		{
			/**
			 * Notify server bridge that the bot is now online and ready to monitor the server
			 */
			const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_events != null;
			if (!bridge) return;
			const events_channel = await client.db.get('dsc.server_events') ?? (client.config.discord.server_events || client.config.discord.server_chat);
			if (!events_channel) return;
			const channel = await client.channels.cache.get(events_channel);
			if (channel) 
				channel.send(`# <a:loading_green:834745755918794802> Server is now been monitored!`);
		}

		{
			/**
			 * Notify the manager too
			 */
			const manager = client.config.manager.discord
			if (!manager) return;
			client.users.send(
				manager, 
				`<a:loading_green:834745755918794802>| Bot has been connected to the server successfully!`
				).catch(e => client.log.error(`[MC] | Error sending message to manager: ${e}`));
		}

		cache.looker_interval = setInterval(looker, 100, client)
		cache.defender_interval = setInterval(defender, 1000, client)
		cache.nearby_entities_interval = setInterval(nearby_entities, 1000, client)
	}

    client.log.console(`[MC] | Bot spawned in the server successfully!`);   

	if (!client.bot.spawned)
		client.bot.spawned = true;
}    

/**
 * Bot will look at the nearest entity every 100ms
 * https://github.com/PrismarineJS/mineflayer/blob/master/examples/looker.js
 * @param {Client} client 
 */
const looker = async (client) => {
	const bot = client.bot;

	if (!bot)
		return clearInterval(cache.looker_interval);

	const entity = bot.nearestEntity()

	if (
		entity && 
		(entity.type === 'player' || entity.type === 'mob')
	) {
		bot.lookAt(entity.position.offset(0, 1.6, 0))
	} else {
		cache.angle += cache.angular_speed;

		if (cache.angle >= 360) 
			cache.angle -= 360;
		const radians = cache.angle * Math.PI / 180;
	
		const x = 10 * Math.cos(radians);
		const z = 10 * Math.sin(radians);
	
		bot.lookAt(bot.entity.position.offset(x, 1.6, z));
	}
}

const defender = async (client) => {
	const bot = client.bot;
	const settings = client.config.bot;

	if (!settings.defend)
		return clearInterval(cache.defender_interval);
	if (!bot)
		return clearInterval(cache.defender_interval);

	const entity = bot.nearestEntity((entity) => settings.defend_from.includes(entity.type))

	if (
		!entity ||
		!settings.defend_from.includes(entity.type)
	) 
		return;

	if (settings.whitelist.includes(entity.username))
		return;

	const distance = entity.position.distanceTo(bot.entity.position);
	if (distance > 4)
		return;

	const weapon = bot.inventory.items().find(item => {
		return settings.weapons.includes(item?.name);
	});

	if (weapon)
		bot.equip(weapon, 'hand');

	// Jump for critical hit
	bot.setControlState('jump', true)
	
	// Delay attack so it jumps for critical hits
	setTimeout(() => {
		// Aim for the head
		bot.lookAt(entity.position.offset(0, 1.6, 0));
		bot.attack(entity)
	}, 300);
	
	bot.setControlState('jump', false)

	let message;

	if (entity.type === 'player') {
		message = settings.player_defend_message
			?.replaceAll('{username}', entity.username)
			?.replaceAll('{distance}', Math.floor(distance))
			?.replaceAll('{health}', Math.floor(bot.health));
	} else {
		message = settings.mob_defend_message
			?.replaceAll('{mob}', entity.name)
			?.replaceAll('{distance}', Math.floor(distance))
			?.replaceAll('{health}', Math.floor(bot.health));
	}
	
	if (message && message !== cache.last_defend_message) {
		if (entity.type === 'player') 
			bot.chat(`/msg ${message}`);
		else 
			bot.chat(message);
		cache.last_defend_message = message;
	}

	client.log.console(`[MC] | Attacking ${entity.type} as a defensive measures with ${weapon ? weapon.displayName : 'hand'}!`);
}

const nearby_entities = async (client) => {
	const bot = client.bot;
	const settings = client.config.bot;

	if (!bot)
		return clearInterval(cache.nearby_entities_interval);

	const spawn_cords = client.bot.spawn_coordinates;
	if (
		spawn_cords.distanceTo(bot.entity.position) > 2 && 
		client.config.bot.dont_move
		) {
		bot.pathfinder.setMovements(new Movements(bot))
		bot.pathfinder.setGoal(new goals.GoalBlock(spawn_cords.x, spawn_cords.y, spawn_cords.z))
	}

	if (!bot.players) 
		return;

	const close_players = Object.values(bot.players).filter(player => {
		return player.username !== bot.username && player.entity;
	}).map(player => ({ username: player.username, entity: player.entity, distance: player.entity.position.distanceTo(bot.entity.position) }));

	const join_render_distance = close_players.filter(player => !cache.players.some(p => p.username === player.username));
	const left_render_distance = cache.players.filter(player => !close_players.some(p => p.username === player.username));

	if (join_render_distance.length > 0) 
		client.log.console(`[MC] | New player is within render distance: ${join_render_distance.map(p => p.username).join(', ')}`);

	if (left_render_distance.length > 0) 
		client.log.console(`[MC] | Player left render distance: ${left_render_distance.map(p => p.username).join(', ')}`);
	
	for (const { username, entity, distance } of close_players) {
		if (
			settings.close_player_salute &&
			distance < settings.salute_distance && 
			!cache.saluted_players.includes(username)
			) {
				const output = settings.salute_output === 'chat' ? '' : '/msg ';
				const message = settings.salute_message.replaceAll('{username}', username).replaceAll('{distance}', Math.floor(distance));
				bot.chat(output + message);

			cache.saluted_players.push(username);
		}
	}

	for (const { username, distance } of left_render_distance) {
		if (
			settings.close_player_salute &&
			distance > settings.salute_distance && 
			cache.saluted_players.includes(username)
			) {
				const output = settings.salute_output === 'chat' ? '' : '/msg ';
				const message = settings.farewell_message.replaceAll('{username}', username).replaceAll('{distance}', distance);
				bot.chat(output + message);

				cache.saluted_players = cache.saluted_players.filter(p => p !== username);
		}
	}
	
	cache.players = close_players;
}