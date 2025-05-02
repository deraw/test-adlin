const express = require('express')
const router = express.Router()
const path = require('path')

const searchRooms = require('./searchRooms')
const bookRoom = require('./bookRoom')

router.get('/rooms', (req, res) => {
  res.header('Content-Type','application/json')
  res.sendFile(path.join(__dirname, process.env.DB_FILE_PATH))
})

router.get('/rooms/search', (req, res) => {
  const { date, time, duration, minCapacity, equipments } = req.query
  const filteredRooms = searchRooms(date, time, duration, minCapacity, equipments)

  res.header('Content-Type', 'application/json')
  res.send(JSON.stringify({ rooms: filteredRooms }))
})

router.patch('/rooms/book', (req, res) => {
  const { room, params } = req.body
  const { date, time, duration } = params

  try {
    const rooms = bookRoom(room, date, time, duration)
    res.header('Content-Type', 'application/json')
    res.send(JSON.stringify({ rooms }))
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message })
    } else {
      res.status(500).json({ error: 'Erreur interne du serveur' })
    }
  }
})

module.exports = router
