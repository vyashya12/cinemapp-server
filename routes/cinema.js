const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Cinema = require('../models/Cinema')

// Add a cinema
router.post('/', auth, (req, res) => {
    try{
        // const {name, longitude, latitude, room} = req.body
        let location = new Cinema()
        location.name = req.body.name
        location.longitude = req.body.longitude
        location.latitude = req.body.latitude
        location.room = req.body.room
        location.save()
        return res.json({msg: "Successfully Added the Cinema"})
    } catch(e) {
        return res.json(e)
    }
})
//Get all Cinema
router.get('/', async (req, res) => {
    try{
        let cinema = await Cinema.find({})
        return res.json(cinema)
    } catch(e) {
        return res.json(e)
    }
})

//Edit a Cinema
router.put('/:id', auth, async (req, res) => {
    try{
        let cinema = await Cinema.findByIdAndUpdate(req.params.id)
        cinema.name = req.body.name
        cinema.longitude = req.body.longitude
        cinema.latitude = req.body.latitude
        cinema.room = req.body.room
        cinema.save()
        return res.json({msg: "Succesfully Updated Bruh"})
    } catch(e) {
        return res.json(e)
    }
})

// Delete A Cinema
router.delete('/:id', auth, async (req, res) => {
    try{
        let cinema = await findByIdAndDelete(req.params.id)
        return res.json({msg: "Successfully Deleted"})
    } catch(e) {
        return res.json(e)
    }
})

module.exports = router