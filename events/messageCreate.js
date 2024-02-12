const cache = {
    last_message: 0,
    message_queue: []
}

module.exports.run = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    
    if (!client.bot) return;
    
    const bridge = await client.db.get('bot.bridge') ?? client.config.discord.server_chat != null;
    
    if (!bridge) return;
    
    const chat_channel = await client.db.get('dsc.server_chat') ?? client.config.discord.server_chat;
    
    if (message.channel.id !== chat_channel) return;
    
    let msg = message.content
    let author = message.author.username;
    
    if (!msg) 
    return client.log.error('[BOT] | Could not read message content! Make sure the bot has the required intetnts!')

    const ratelimit = (client.config.discord.ratelimit || 1) * 1000;
    /**
     * Replace user mentions with their usernames, channels will be @unknown
     */
    const matches = msg.match(/<@!?(\d+)>/g);

    if (matches) {
        for (const match of matches) {
            const user_id = match.replace(/[^0-9]/g, '');
            const user = await client.users.fetch(user_id).catch(e => {});

            if (user) 
                msg = msg.replace(match, `@${user.username}`);
            else
                msg = msg.replace(match, `@unknown`);
        }
    }

    /**
     * Remove all non-alphanumeric characters
     */
    msg = msg.replaceAll(/[^a-zA-Z0-9\s.,!?@]/g, '')

    /**
     * Text size limit
     */
    if (msg.lenght > 256)
        msg = msg.slice(0, 256 - author.length - 2) + '...';

    const final_message = `${message.author.username}: ${msg || 'No message content!'}`;

    // console.log(
    //     'Original message: ' + message.content,
    //     'Processed message: ' + msg
    // );

    const curtime = Date.now();

    /**
     * Delay the sending of the queued messages
     */
    if (curtime - cache.last_message < ratelimit) {
        if (cache.processing_queue) 
            return cache.message_queue.push(final_message);

        cache.processing_queue = true;
        return setTimeout(process_queue, ratelimit - (curtime - cache.last_message), client);
    }

    client.bot.chat(final_message);
    cache.last_message = curtime;
}

const process_queue = (client) => {
    const ratelimit = (client.config.discord.ratelimit || 1) * 1000;
    const message = cache.message_queue.shift();

    if (!message) 
        return cache.processing_queue = false;

    if (cache.message_queue.length > 0) 
        setTimeout(process_queue, ratelimit, client);
    else 
        cache.processing_queue = false;

    client.bot.chat(message);
}