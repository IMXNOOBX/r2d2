module.exports.run = async (client, entity) => {
    const { bot } = client;

	if (bot.entity == entity) 
		console.log(`[MC] | Bot got hurt!`)

	client.log.console(`[MC] | Entity hurt: ${entity}`);
}    
