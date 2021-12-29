const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReceiptSchema = new Schema ({
    userId: {type: String},
    title: {type: String},
    total: {type: Number},
    seats: {type: String}
})

module.exports = mongoose.model('Receipt', ReceiptSchema)
