// Importing modules
const levelling = require('./levelling')
const { prefix } = require('../config.json')

// Const variables
const min = 1 // Minimum XP given per message
const max = 100 // Maximum XP given per message

module.exports = (client) => { // Level up function
    const random = Math.floor(Math.random() * (max - min + 1)) + min // Random XP given
    client.on('messageCreate', async (message) => { // Emits when a message is created
        if(!message.guild || message.author.bot || message.startsWith(prefix)) return // If the message is not in a guild or the author is a bot or the message starts with the prefix, return

        const levelledUp = await levelling.addXP(message.author.id, message.guild.id, random) // Add XP to the user
        const user = await levelling.fetchXp(message.author.id, message.guild.id) // Fetch the user's XP
        if(levelledUp) { // If the user levelled up
            message.reply(`GG <@${message.author.id}>! You have levelled up to ${user.level}!\nLevel up more to get various rewards!`) // Reply to the user
        }
    })
}