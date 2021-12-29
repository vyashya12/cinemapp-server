const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new Schema({
    userId: {type: String},
    movie: {type: String},
    movieId: {type: String},
    location: {type: String},
    time: {type: String},
    date: {type: String},
    price: {type: String},
    seats: {type: Array},
    food: {type: Array},
    total: {type: Number}
})

module.exports = mongoose.model("Bookings", BookingSchema)
