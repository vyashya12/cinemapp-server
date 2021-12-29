require('dotenv').config()
// const {PORT, DB_NAME, DB_PASSWORD, DB_HOST, DB_PORT} = process.env
const express = require('express')
const cors = require('cors')
const {OAuth2Client} = require('google-auth-library')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const clientId = '162553669038-muoofacesll5s71p3mtvdfp421u29mre.apps.googleusercontent.com'

const client = new OAuth2Client(clientId)
const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb+srv://vyashya12:vyashya12@cluster0.s60xs.mongodb.net/cinema?retryWrites=true&w=majority')
mongoose.connection.once("open", () => console.log("Connected to MongoDB"))

app.post('/login', async (req, res) => {
    const tokenId = req.body.credential
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: clientId
        })
        const payload = ticket.getPayload()
        let info;
        if(payload.sub === "114736766002906300609") {
            info = {
                sub: payload.sub,
                email: payload.email,
                fullname: payload.name,
                isAdmin: true
            }
        } else {
            info = {
                sub: payload.sub,
                email: payload.email,
                fullname: payload.name
            }
        }
        jwt.sign(
            info,
            process.env.SECRET_KEY,
            {expiresIn: "1h"},
            (err, token) => {
                if(err) return res.status(400).json({err})
                return res.json({
                    token,
                    payload
                })
            }
            )
        // console.log(payload)
        //     return res.json(payload)
    } catch (e) {
        return res.status(400).json(e)
    }
})
app.use(express.static('public'))
app.use('/movies', require('./routes/movies'))
app.use('/snacks', require('./routes/snacks'))
app.use('/booking', require('./routes/bookings'))
app.use('/cinema', require('./routes/cinema'))
app.use('/seats', require('./routes/seats'))
app.use('/receipt', require('./routes/receipt'))

app.listen( console.log("Server is running in "))
