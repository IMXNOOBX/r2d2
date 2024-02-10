module.exports.run = async (client, block, isOpen) => {
    const { bot } = client;

	const action = isOpen ? 'open' : 'close'
	bot.chat(`Hey, did someone just ${action} a chest?`)
}    
