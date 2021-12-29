const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FoodItemSchema = new Schema({
    name: {type: String},
    type: {type: String},
    image: {type: String},
    description: {type: String},
    price: {type: Number},
    isSoldOut: {type: Boolean}
})

module.exports = mongoose.model("FoodItem", FoodItemSchema)