module.exports.run = async (client, item, offhand) => {
    const { bot } = client;

	client.log.console(`[MC] | Bot has started eating ${item.name} in ${offhand ? 'offhand' : 'hand'}, current food ${bot.food}!`);   
}    
