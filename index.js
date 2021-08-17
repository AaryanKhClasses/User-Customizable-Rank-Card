// Importing Modules
const { Client, Intents, Collection } = require('discord.js')
const mongoose = require('mongoose')
const fs = require('fs')
const config = require('./config.json')
require('dotenv').config()

const { prefix, activity } = config // Gets variables from config

const client = new Client({ // Creates a new client
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES ], // Sets intents
    partials: ['CHANNEL', 'MESSAGE', 'USER'], // Sets partials
})

client.commands = new Collection() // Creates a new collection

const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js')) // Gets all files in commands folder with ".js" extension
for (const file of files) { // For each file
    const command = require(`./commands/${file}`) // Loads the file
    client.commands.set(command.name, command) // Sets the command
    console.log(`Registered ${file}`) // Logs that the file is registered
}

mongoose.connect(process.env.MONGOURI, { // Connects to the database
    // MongoDB Configs
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

client.on('ready', () => { // Emits when the client is ready
    console.log(`${client.user.username} is ready!`) // Logs that the bot is ready
    client.user.setActivity(activity, { type: 'PLAYING' }) // Sets the activity
})

client.on('messageCreate', (message) => { // Emits when a message is created
    if(message.author.bot || !message.content.startsWith(prefix) || !message.guild) return // If the message is a bot, or the prefix is not used, or the message is not in a guild, do nothing

    const args = message.content.slice(prefix.length).trim().split(' ') // Gets the arguments
    const command = args.shift().toLowerCase() // Gets the command

    if(!client.commands.has(command)) return // If the command does not exist, do nothing
    try { // Tries to execute the command
        client.commands.get(command).run(client, message, args) // Runs the command
    } catch(err) { // Catches any errors
        console.error(err) // Logs the error
        message.reply('There was an error while executing the command!') // Replies with an error
    }
})

client.login(process.env.TOKEN) // Logs in the bot