const express = require('express')
const router = express.Router()
const Movie = require('../models/Movie')
const Seat = require('../models/Seats')

router.post('/', async (req, res) => {
    try{
        const {movieId, seatId, seatRow, seatNumber } = req.body
        const seat = await Seat.findOne({movieId})

        if(seat === null) {
            const newSeat = await Seat.create({
                movieId,
                seats: [{seatId: seatId, seatRow: seatRow, seatNumber: seatNumber}]
            })
            await newSeat.save()
            return res.json({msg: "You have Added the seat", newSeat})
        }

        if(seat) {
            seat.seats.push({
                seatId: seatId,
                seatRow: seatRow,
                seatNumber: seatNumber
            })
        }
        await seat.save()
        return res.json({msg: "Added to Seats", seat})
    } catch(e) {
        return res.status(400).json(e)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const movieId = req.params.id
        // return res.json(movieId)
        let seat = await Seat.find({movieId: movieId})
        return res.json(seat)
    } catch(e) {
        return res.status(400).json(e)
    }
})

module.exports = router