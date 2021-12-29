const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    title: {type: String},
    description: {type: String},
    image: {type: String},
    price: {type: Number},
    endDate: {type: Date},
    genre: {type: String},
    trailer: {type: String}
})

module.exports = mongoose.model("Movie", MovieSchema)
