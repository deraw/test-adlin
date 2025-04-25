const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
const path = require('path')
const checkRoomAvailability = require('./checkRoomAvailability')

app.use(cors({origin: '*'}))

app.get('/rooms', (req, res) => {
  res.header('Content-Type','application/json')
  res.sendFile(path.join(__dirname, 'rooms.json'))
})

app.get('/rooms/search', (req, res) => {
  const { date, time, duration, minCapacity, equipements } = req.query
  const { rooms } = require('./rooms.json')

  const filteredRooms = rooms.filter(room => {
    const isAvailable = checkRoomAvailability(room.bookings, date, time, duration)
    const hasCapacity = room.capacity >= minCapacity

    const hasEquipements = equipements ? equipements.split(',').every(equipement => {
      return room.equipements.some(roomEquipement => roomEquipement.id === equipement)
    }) : true

    return isAvailable && hasCapacity && hasEquipements
  })

  res.header('Content-Type','application/json')
  res.send(JSON.stringify({ rooms: filteredRooms }))
})


app.listen(port, () => {
  console.log(`Simple server listening on port ${port}`)
})
