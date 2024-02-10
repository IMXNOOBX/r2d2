module.exports.run = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    
    if (!client.bot) return;

    const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_chat != null;

    if (!bridge) return;

    const chat_channel = await client.db.get('dsc.server_chat') ?? client.config.discord.server_chat;

    if (message.channel.id !== chat_channel) return;

    const msg = message.content.replaceAll(/[^a-zA-Z0-9\s.,!?]/g, '')

    if (!msg) 
        return client.log.error('[BOT] | Could not read message content! Make sure the bot has the required intetnts!')

    client.bot.chat(`${message.author.username}: ${msg || 'No message content!'}`);
}