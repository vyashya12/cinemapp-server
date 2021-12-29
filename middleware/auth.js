const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req,res,next) => {
    const user = req.header('x-auth-token')

    if(!user) {
        return res.json({msg: "Unauthorized/You gotta sign in Bruh"})
    }

    try{
        const decoded = jwt.verify(user, process.env.SECRET_KEY)
        req.user = decoded
        next() //do the next to your right
    } catch(e) {
        return res.status(401).json({e})
    }
}