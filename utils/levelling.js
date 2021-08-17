// Importing Modules
const levels = require('../models/levels')

async function getXP(userID, guildID, getPos = false) { // Function to get the XP of a user
    const user = await levels.findOne({ userID: userID, guildID: guildID }) // Getting the user's XP
    if (!user) return false // If the user doesn't exists, return false

    if(getPos === true) { // If the user wants to get the position
        const lb = await levels.find({ guildID: guildID }).sort([ [ 'xp', 'descending' ] ]).exec() // Getting the user's position in the XP list
        user.pos = lb.findIndex(x => x.userID === userID) + 1 // Getting the position of the user in the list

        user.cleanXP = user.xp - this.xpFor(user.lvl) // Calculating the XP that the user has cleaned
        user.cleanNextLVLXP = this.xpFor(user.lvl + 1) - this.xpFor(user.lvl) // Calculating the XP needed to reach the next level
        return user // Returning the user
    }
}

function xpFor(targetLvl) { // Function to get the XP needed to reach a certain level
    if(!isNaN(targetLvl)) targetLvl = parseInt(targetLvl, 10) // If the target level is a number, convert it to a number
    return targetLvl * 100 // XP needed to reach the target level
}

module.exports = (getXP, xpFor) // Exporting the functions