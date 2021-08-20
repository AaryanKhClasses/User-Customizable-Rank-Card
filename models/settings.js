// Importing modules
const mongoose = require('mongoose')
const config = require('../config.json')

const { defaultOverlayColor, defaultProgressColor } = config // Getting variables from config

const settingsSchema = new mongoose.Schema({ // Creating schema
    // Schema configs
    userID: String,
    overlayColor: { type: String, defaualt: defaultOverlayColor },
    progressColor: { type: String, default: defaultProgressColor },
})

const settings = mongoose.model('settings', settingsSchema) // Creating a model with the schema
module.exports = settings // Exporting the model