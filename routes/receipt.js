const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Receipt = require('../models/Receipt')

router.post('/', auth, async (req, res) => {
    try{
        const userId = req.user.sub
        let receipt = await Receipt.findOne({userId})
        const { title, total, seats } = req.body
        if(!receipt) {
            const newReceipt = await Receipt.create({
                userId,
                title,
                total,
                seats
            })
            return res.json({msg: "You have Paid your Bill", newReceipt})
        } else {
            return res.json({msg: "You Paid already"})
        }
    } catch(e) {
        return res.json(e)
    }
})

module.exports = router