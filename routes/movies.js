const express = require('express')
const router = express.Router()
const Movie = require('../models/Movie')
const auth = require('../middleware/auth')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

// Add Movie
router.post("/", auth, (req, res) => {
    if(!req.user.isAdmin) return res.json({msg: "Unauthorized/ You need Admin Rights Bruh"})

    const form = new formidable.IncomingForm()
    form.parse(req, (e, fields, files) => {
        if(e) return res.status(400).json({e})
        let date = new Date().getTime()
        const movie = new Movie(fields)
        let oldPath = files.image.filepath
        let newPath = path.join(__dirname, "../public/")+date+"-"+files.image.originalFilename 
        let rawData = fs.readFileSync(oldPath)
        fs.writeFileSync(newPath, rawData)
        movie.image = "/public/"+date+"-"+files.image.originalFilename
        movie.save()
        return res.json({msg: "Movie added successfully", movie})
    })
})

//Get All Movies
router.get("/", async (req, res) => {
    try{
        let movies = await Movie.find({})
        return res.status(200).json(movies)
    } catch(err) {
        return res.status(400).json(err)
    }
})

//Get Movie By Keyword
router.get("/search/:key", async (req, res) => {
    try{
        let movies = await Movie.find({ name : {$regex: req.params.key, $options: "i"}})
        if(movies.length) {
            return res.json(movies)
        } else {
            return res.json({msg: "No movies to show"})
        }
    } catch(e) {
        return res.status(400).json({msg: "No movies to show"})
    }
})

// Update a Movie
router.put("/:id", auth, async (req, res) => {
    try{
        let movie = await Movie.findById(req.params.id)
        if(!req.user.isAdmin) {
            return res.status(400).json({msg: "Unauthorized"})
        } else {
            const form = new formidable.IncomingForm()
            form.parse(req, (e, fields, files) => {
                if(e) return res.status().json(e)
                // fs.unlinkSync(path.join(__dirname, "../", movie.image))
                let date = new Date().getTime()
                movie.title = fields.title
                movie.description = fields.description
                movie.priceA = fields.priceA
                movie.priceC = fields.priceC
                movie.startDate = fields.startDate
                movie.endDate = fields.endDate
                movie.location = fields.location
                movie.longitude = fields.longitude
                movie.latitude = fields.latitude
                let oldPath = files.image.filepath
                let newPath = path.join(__dirname, "../public/")+date+"-"+files.image.originalFilename 
                let rawData = fs.readFileSync(oldPath)
                fs.writeFileSync(newPath, rawData)
                movie.image = "/public/"+date+"-"+files.image.originalFilename
                movie.save()
                return res.json({
                    msg: "Successfully Updated",
                    movie
                })
            })
        }
    } catch(err) {
        return res.json(err)
    }
})

// Delete A movie
router.delete("/:id", auth, async (req, res) => {
    try{
        if(!req.user.isAdmin) return res.status(401).json({msg: "Unauthorized"})
        let movie = await Movie.findByIdAndDelete(req.params.id)
            fs.unlinkSync(path.join(__dirname, "../", movie.image))
            return res.json({msg: "Movie deleted successfully"})
    }catch(e) {
        return res.status(400).json({e, msg: "Cannot delete movie"})
    }
})

module.exports = router