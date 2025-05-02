const express = require('express')
const cors = require('cors')
const app = express()

require('dotenv').config()

const roomsRouter = require('./rooms/index.js')

app.use(cors({origin: process.env.CORS_ORIGIN}))
app.use(express.json())
app.use(roomsRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
