const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
const path = require('path')
const checkRoomAvailability = require('./checkRoomAvailability')
const dayjs = require('dayjs')

app.use(cors({origin: '*'}))
app.use(express.json())

app.get('/rooms', (req, res) => {
  res.header('Content-Type','application/json')
  res.sendFile(path.join(__dirname, 'rooms.json'))
})

app.get('/rooms/search', (req, res) => {
  const { date, time, duration, minCapacity, equipments } = req.query
  const { rooms } = require('./rooms.json')

  const filteredRooms = rooms.filter(room => {
    const isAvailable = checkRoomAvailability(room.bookings, date, time, duration)
    const hasCapacity = minCapacity ? room.capacity >= minCapacity : true

    const hasEquipments = equipments ? equipments.split(',').every(equipment => {
      return room.equipments.some(roomEquipment => roomEquipment.id === equipment)
    }) : true

    return isAvailable && hasCapacity && hasEquipments
  })

  res.header('Content-Type','application/json')
  res.send(JSON.stringify({ rooms: filteredRooms }))
})

app.post('/rooms/book', (req, res) => {
  const { room, params } = req.body
  const { date, time, duration } = params
  const { rooms } = require('./rooms.json')

  const id = room.id

  if (!room) {
    return res.status(404).json({ error: 'Room not found' })
  }

  const requestedStartTime = dayjs(`${date}T${time}`)
  const now = dayjs()

  if (requestedStartTime.isBefore(now)) {
    return res.status(400).json({ error: 'Cannot book a room in the past' })
  }

  const isAvailable = checkRoomAvailability(room.bookings, date, time, duration)

  if (!isAvailable) {
    return res.status(400).json({ error: 'Room is not available' })
  }

  const booking = {
    start: `${date}T${time}`,
    end: dayjs(`${date}T${time}`).add(duration, 'minute').format(),
  }
  const roomIndex = rooms.findIndex(r => r.id === id)

  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' })
  }

  rooms[roomIndex].bookings.push(booking)
  rooms[roomIndex].bookings.sort((a, b) => new Date(a.start) - new Date(b.start))
  rooms[roomIndex].updatedAt = dayjs().format()

  const fs = require('fs')

  fs.writeFile(path.join(__dirname, 'rooms.json'), JSON.stringify({ rooms }, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })

  res.header('Content-Type','application/json')
  res.send(JSON.stringify({
    rooms
  }))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
