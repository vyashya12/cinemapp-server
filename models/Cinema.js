const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CinemaSchema = new Schema({
    name: {type: String},
    longitude: {type: String},
    latitude: {type: String},
    room: {type: Number}
})

module.exports = mongoose.model("Cinema", CinemaSchema)