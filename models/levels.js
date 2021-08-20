const mongoose = require('mongoose') // Import mongoose

const levelSchema = new mongoose.Schema({ // Define schema for level
    // Schema configs
    userID: String,
    guildID: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    lastUpdated: { type: Date, default: Date.now() },
})

const levels = mongoose.model('Levels', levelSchema) // Create a model for the levels
module.exports = levels // Export the model