module.exports.run = async (client, error) => {
    const { bot } = client;

    client.log.error(`[MC] | Client got error: ${error}`);   
}    
