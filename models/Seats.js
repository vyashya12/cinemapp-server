const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SeatSchema = new Schema({
    movieId: {type: String},
    seats: [{
        seatId: {type: Number},
        seatRow: {type: String},
        seatNumber: {type: String}
    }]
})

module.exports = mongoose.model('Seat', SeatSchema)