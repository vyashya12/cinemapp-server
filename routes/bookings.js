const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const Movie = require('../models/Movie')
const auth = require('../middleware/auth')
const { find } = require('../models/Booking')

// Book A movie
router.post('/', auth,  async (req, res) => {
    try{
        const userId = req.user.sub
        const movieId = req.body.movieId
        const {cinema, date, time } = req.body
        const movie = await Movie.findById({_id: movieId})
        let movieBooked = await Booking.findOne({userId})

        // return res.json({msg: "Hello"})

        if(movieBooked === null) {
            const newBooking = await Booking.create({
                userId,
                movie: movie.title,
                movieId: movieId,
                location : cinema,
                time: time,
                date: date,
                price: movie.price,
                food: [],
                seats: [],
                total: 0
            })
            return res.json({msg: "Movie Booked, Please pick your seats"})
        }

        if(movieBooked) {
            return res.json({msg: "You have already booked a movie, Pick your seats"})
        }

        await movieBooked.save()
    } catch(e) {
        return res.json(e)
    }
})

//Get Bookings
router.get("/", async (req, res) => {
    try{
        let booking = await Booking.find({})
        return res.json(booking)
    } catch(e) {
        return res.status(400).json(e)
    }
})

//Get your bookig only
router.get("/:id", async (req, res) => {
    try{
        const userId = req.params.id
        let booking = await Booking.find({sub: userId})
        return res.json(booking)
    } catch(e) {
        return res.status(401).json(e)
    }
})

//Book food
router.post("/:id", auth, async (req, res) => {
    try{
        const userId = req.params.id
        const { name, quantity, price} = req.body
        const movieBooking = await Booking.findOne({userId})
        if(movieBooking) {
            for(let i = 0; i < quantity; i++) {
                movieBooking.food.push(name)
            }
            let total = price * quantity
            movieBooking.total += total
            movieBooking.save()
            return res.json({msg: "Food Added to your Booking", movieBooking})
        } else {
            return res.status(400).json({msg: "Please book a Movie first"})
        }
    } catch (e) {
        return res.status(400).json(e)
    }
})

//Book Seats
router.put('/:id', auth, async (req, res) => {
    try{
        const sub = req.user.sub
        const { seats, booked } = req.body
        const movieBooking = await Booking.findOne({sub})
        let seatPrice = movieBooking.price * booked
        movieBooking.seats = seats
        movieBooking.total += seatPrice
        await movieBooking.save()
        return res.json({msg: "You have booked Seats", movieBooking})
    } catch(e) {
        return res.status(400).json(e)
    }
})

// Delete a Booking
router.delete('/:id', auth, async (req, res) => {
    try{
        if(!req.user.isAdmin) return res.status(401).json({msg: "Unauthorized"})
        let booking = await Booking.findByIdAndDelete(req.params.id)
            return res.json({msg: "Booking Cancelled successfully"}, booking)
    }catch(e) {
        return res.status(400).json({e, msg: "Cannot cancel Booking"})
    }
})

module.exports = router