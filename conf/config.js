module.exports = {
	manager:  {
		discord: '652969127756955658', // The discord manager userid
		minecraft: 'IMXNOOBX', // The minecraft manager username
	},
	bot: {
		dont_move: true, // if true the bot will go back to the position it spawned at
		reconnect_interval: 60, // in seconds, the time that the bot will attempt to reconnect *The bot checks Throug mcapi.us if the owner is connected to the server first*

		minimum_hp: 5, // The minimum health points the bot should have to exit
		minimum_food: 5, // The minimum food points the bot should have to exit
		auto_eat: 10, // The bot will attempt to eat if it has less than this value
		eat_priority: 'saturation', // saturation or foodPoints The priority of the bot to eat
		food_blacklist: ['pufferfish', 'spider_eye', 'poisonous_potato', 'rotten_flesh', 'chorus_fruit', 'chicken', 'suspicious_stew'], // The food items the bot will not eat

		command: true, // true and the bot will listen to commands in mc
		prefix: '.', // The default prefix for the commands, can be changed from discord

		close_player_salute: true, // true and the bot will salute close players
		salute_distance: 20, // The distance to salute a player
		salute_message: 'Hello there! {username} you are {distance} blocks away <3', // The message the bot will send when saluting a player, placeholders: {username} {distance}
		farewell_message: 'Goodbye {username}, hope to see you soon!', // The message the bot will send when a player leaves, placeholders: {username} {distance}
		salute_output: 'chat', // chat or whisper 

		defend: true, // true and the bot will defend itself
		defend_from: ['hostile', 'mob'], // The entities the bot will defend itself from mobs and players, options: 'hostile', 'player', 'mob', 'animal' (not recommended)
		weapons: ['netherite_sword', 'diamond_sword', 'iron_sword', 'stone_sword', 'golden_sword', 'wooden_sword'], // The weapons the bot will use to defend itself
		player_defend_message: 'Go away {username}! I will continue attacking you unless you go away!', // Sent as whisper, placeholders: {username} {distance} {health}, null to disable
		mob_defend_message: 'I\'m under attack by {mob}, i will fight back. my hp is {health}', // placeholders: {mob} {distance} {health}, null to disable

		whitelist: ['IMXNOOBX'], // The players that the bot will not attack
	},
	discord: {
		rate_limit: 1, // in seconds, Rate limit to send the messages to the minecraft server. the messages will be queued and sent after the rate limit
		server_chat: '1206296107685126174', // The channel id where the bot will send the server chat
		server_events: false, // false and events will be sent to server chat
	}
};