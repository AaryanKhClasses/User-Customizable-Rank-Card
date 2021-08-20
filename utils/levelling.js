// Importing Modules
const levels = require('../models/levels')

class levelling { // Class to handle the XP needed to level up
    static async getXP(userID, guildID, getPos = false) { // Function to get the XP of a user
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

    static async addXP(userID, guildID, xp) { // Function to add XP to a user
        const user = await levels.findOne({ userID: userID, guildID: guildID }) // Getting the user's XP
        if(!user) { // If the user doesn't exists, create it
            const newUser = new levels({ // Creating the user
                userID: userID,
                guildID: guildID,
                xp: xp,
                level: Math.floor(0.1 * Math.sqrt(xp)),
            })

            await newUser.save() // Saving the user
            return (Math.floor(0.1 * Math.sqrt(xp)) > 0) // Returning the level of the user
        }
        user.xp += parseInt(xp, 10) // Adding the XP to the user
        user.level = Math.floor(0.1 * Math.sqrt(user.xp)) // Calculating the level of the user
        user.lastUpdated = new Date() // Updating the last updated date

        await user.save() // Saving the user
        return (Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level) // Returning the level of the user
    }

    static xpFor(targetLvl) { // Function to get the XP needed to reach a certain level
        if(!isNaN(targetLvl)) targetLvl = parseInt(targetLvl, 10) // If the target level is a number, convert it to a number
        return targetLvl * 100 // XP needed to reach the target level
    }
}

module.exports = levelling // Exporting the class