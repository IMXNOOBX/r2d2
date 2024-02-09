module.exports.run = async (bot, username, message) => {
	if (username == bot.username) return;

    client.log.error(`[MC] | Chat Event: ${username} said ${message}`);   
}    
