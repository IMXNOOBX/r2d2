const Discord = require('discord.js');
const mineflayer = require('mineflayer');
const { QuickDB } = require("quick.db");
const axios = require('axios');
const { Webhook } = require('dis-logs');
const bot = require('./minecraft/index');
const fs = require('fs');
require('dotenv').config()

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.DirectMessages
    ],
    //partials: [
    //    Discord.Partials.Channel, // Required to receive DMs
    //]
});

/**
 * Register global variables under client namespace
 */
client.log = new Webhook(process.env.DISCORD_WEBHOOK);
client.config = require('./conf/config');
client.axios = axios;
client.fs = fs;
client.db = new QuickDB();  
client.mc = mineflayer;
client.ms = require('ms');

client.discord = Discord;
client.commands = new Discord.Collection();
client.commands.normal = new Discord.Collection();
client.events = new Discord.Collection();
client.commands.normal.aliases = new Discord.Collection();
client.commands.buttons = new Discord.Collection();
client.commands.menus = new Discord.Collection();
client.commands.slash = new Discord.Collection();

/**
 * Register handlers and start commands
 */
const handlers = fs.readdirSync(`./handler`).filter(file => file.endsWith('.js'));

handlers.forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client
    .login(process.env.BOT_TOKEN)
    .catch(err => {
        client.log.error('[BOT] | Login Error. Discord Response: ' + err);
    });
