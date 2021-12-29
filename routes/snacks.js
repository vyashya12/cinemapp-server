const express = require('express')
const router = express.Router()
const FoodItem = require('../models/FoodItem')
const auth = require('../middleware/auth')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

// Add food items
router.post("/", auth, (req, res) => {
    if(!req.user.isAdmin) return res.status(401).json({msg: "Unauthorized/ You need Admin Rights Bruh"})

    const form = new formidable.IncomingForm()
    form.parse(req, (e, fields, files) => {
        if(e) return res.status(400).json({e})
        let date = new Date().getTime()
        const foodItem = new FoodItem(fields)
        let oldPath = files.image.filepath
        let newPath = path.join(__dirname, "../public/")+date+"-"+files.image.originalFilename 
        let rawData = fs.readFileSync(oldPath)
        fs.writeFileSync(newPath, rawData)
        foodItem.image = "/public/"+date+"-"+files.image.originalFilename
        foodItem.save()
        return res.json({msg: "FoodItem added successfully", foodItem})
    })
})


//Get all Food
router.get("/", async (req, res) => {
    try{
        let foodItems = await FoodItem.find({})
        return res.status(200).json(foodItems)
    } catch(err) {
        return res.status(400).json(err)
    }
})

// Get by type
router.get("/search/:key", async (req, res) => {
    try{
        let foodItem = await FoodItem.find({ type : {$regex: req.params.key, $options: "i"}})
        if(foodItem) {
            return res.json(foodItem)
        } else {
            return res.json({msg: "No food item to show"})
        }
    } catch(e) {
        return res.status(400).json({msg: "No food item to show"})
    }
})
// Edit Food Items
router.put("/:id", auth, async (req, res) => {
    try{
        let foodItem = await FoodItem.findById(req.params.id)
        if(!req.user.isAdmin) {
            return res.status(400).json({msg: "Unauthorized"})
        } else {
            const form = new formidable.IncomingForm()
            form.parse(req, (e, fields, files) => {
                if(e) return res.status().json(e)
                // fs.unlinkSync(path.join(__dirname, "../", foodItem.image))
                let date = new Date().getTime()
                foodItem.name = fields.name
                foodItem.type = fields.type
                foodItem.description = fields.description
                foodItem.price = fields.price
                foodItem.isSoldOut = fields.isSoldOut
                let oldPath = files.image.filepath
                let newPath = path.join(__dirname, "../public/")+date+"-"+files.image.originalFilename 
                let rawData = fs.readFileSync(oldPath)
                fs.writeFileSync(newPath, rawData)
                foodItem.image = "/public/"+date+"-"+files.image.originalFilename
                foodItem.save()
                return res.json({
                    msg: "Successfully Updated",
                    foodItem
                })
            })
        }
    } catch(err) {
        return res.json(err)
    }
})


// Delete Food Items
router.delete("/:id", auth, async (req, res) => {
    try{
        if(!req.user.isAdmin) return res.status(401).json({msg: "Unauthorized"})
        let foodItem = await FoodItem.findByIdAndDelete(req.params.id)
            fs.unlinkSync(path.join(__dirname, "../", foodItem.image))
            return res.json({msg: "Food Item deleted successfully"})
    }catch(e) {
        return res.status(400).json({e, msg: "Cannot delete movie"})
    }
})

module.exports = router
