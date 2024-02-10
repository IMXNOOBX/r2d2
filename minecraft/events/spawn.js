const { Vec3 } = require('vec3')

module.exports.run = async (client) => {
    const { bot } = client;

	/**
	 * Here we will run some loops to make periodic actions
	 */
	if (!client.bot.spawned) {
		// https://github.com/PrismarineJS/mineflayer/blob/master/examples/looker.js
		var cache = {
			angle: 0,
			angular_speed: 3,

			players: [],
			
			attack_intervals: []
		}

		setInterval(() => {
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
		}, 100)

		setInterval(async () => {
			if (
				!await client.db.get(`bot.intruder`) ??
				!client.config.bot.intruder
				)
				return;

			if (!bot.players) 
				return;

			const close_players = Object.values(bot.players).filter(player => {
				return player.username !== bot.username &&
					player.entity &&
					player.entity.position.distanceTo(bot.entity.position) < client.config.bot.player_too_close;
			}).map(player => ({ username: player.username, entity: player.entity, distance: player.entity.position.distanceTo(bot.entity.position) }));

			const intruders = close_players.filter(player => !cache.players.some(p => p.username === player.username));
			const left_intruders = cache.players.filter(player => !close_players.some(p => p.username === player.username));

			if (intruders.length > 0) {
				client.log.console(`[MC] | Intruder detected: ${intruders.join(', ')}`);
				bot.chat(`Intruders detected: ${intruders.join(', ')}.`);

				for (const { username, entity, distance } of intruders) {
					bot.chat(`/msg ${username} Please maintain a safe distance. Im programmed to attack if you get too close.`);

					if (distance < 7)
						bot.chat(`/msg ${username} Last warning! You are too close!`);

					if (distance < 4 && !cache.attack_intervals[username] && client.config.bot.attack) {
						bot.chat(`/msg ${username} Told you to stay away!`);

						const attack_interval = setInterval(() => {
							bot.attack(entity);
						}, 500)

						cache.attack_intervals[username] = attack_interval;
					}
				}
			}

			if (left_intruders.length > 0) {
				client.log.console(`[MC] | Intruder left: ${left_intruders.join(', ')}`);
				// bot.chat(`Players left proximity range: ${left_intruders.join(', ')}`);

				for (const { username } of left_intruders) {
					if (cache.attack_intervals[username]) {
						clearInterval(cache.attack_intervals[username]);
						delete cache.attack_intervals[username];

						bot.chat(`/msg ${username} You are safe now. Dont try it again.`);
					} else
						bot.chat(`/msg ${username} Have a nice day :)`);
				}
			}
			
			cache.players = close_players;
		}, 1000)
	}

	
	bot.autoEat.options = {
		priority: 'foodPoints',
		startAt: client.config.bot.auto_eat,
		bannedFood: []
	}
	
    client.log.console(`[MC] | Bot spawned in the server successfully!`);   

	if (!client.bot.spawned)
		client.bot.spawned = true;
}    
