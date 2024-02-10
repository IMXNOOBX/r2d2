module.exports = {
	manager:  {
		discord: '652969127756955658', // The discord manager userid
		minecraft: 'IMXNOOBX', // The minecraft manager username
	},
	bot: {
		minimum_hp: 5, // The minimum health points the bot should have to exit
		minimum_food: 5, // The minimum food points the bot should have to exit
		auto_eat: 10, // The bot will attempt to eat if it has less than this value
		eat_priority: 'saturation', // saturation or foodPoints The priority of the bot to eat
		food_blacklist: ['pufferfish', 'spider_eye', 'poisonous_potato', 'rotten_flesh', 'chorus_fruit', 'chicken', 'suspicious_stew'], // The food items the bot will not eat

		command: true, // true and the bot will listen to commands
		prefix: '.', // The prefix for the commands

		intruder: true, // true and the bot will attack, announce and log intruders
		attack: false, // true and the bot will attack intruders
		player_too_close: 10, // If there is a player within this distance he will be considered an intruder
	},
	discord: {
		server_chat: '778318080887488532', // The channel id where the bot will send the server chat
		server_events: false, // false and events will be sent to server chat
	}
};