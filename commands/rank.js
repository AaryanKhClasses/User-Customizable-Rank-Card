// Importing modules
const levelling = require('../utils/levelling')
const { MessageAttachment } = require('discord.js')
const canvacord = require('canvacord')
const settings = require('../models/settings')

module.exports = { // Exporting the command
    name: 'rank',
    run: async (message, args) => {
        let target // The target of the command
        if(message.mentions.members.first()) target = message.mentions.members.first() // If the user mentioned a user, the target is the mentioned user
        else if(args[0]) { // If the user did not mention a user and the command was run with an argument
            if(message.guild.members.cache.find(m => m.id === args[0])) target = message.guild.members.fetch(args[0]) // If the argument is a valid user id, the target is the user with that id
            else message.reply(`Cannot find member ${args[0]}.`) // If the argument is not a valid user id, the command cannot be run
        } else target = message.member // If the user did not mention a user and the command was run without an argument, the target is the author

        const user = await levelling.getXP(target.id, message.guild.id) // Getting the user's XP
        const neededXP = levelling.xpFor(parseInt(user.level) + 1) // Getting the XP needed to reach the next level
        if(!user) message.reply('The mentioned member doesn\'t have any XP') // If the user doesn't have any XP, the command cannot be run

        const userSettings = await settings.findOne({ userID: target.id })

        const rank = new canvacord.Rank()
        .setAvatar(target.displayAvatarURL({ format: 'png', size: 512, dynamic: false }))
        .setCurrentXP(user.xp)
        .setLevel(user.level)
        .setNextLevelXP(neededXP)
        .setStatus(target.presence.status)
        .setUsername(target.username)
        .setDiscriminator(target.discriminator)
        .setProgressBar(userSettings.progressColor)
        .setOverlay(userSettings.overlayColor)
        rank.build().then(data => {
            const attachment = new MessageAttachment(data, 'rank.png')
            message.reply({ files: [attachment] })
        })
    },
}