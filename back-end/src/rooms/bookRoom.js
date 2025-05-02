const path = require('path')
const checkRoomAvailability = require('./checkRoomAvailability')
const dayjs = require('dayjs')
require('dayjs/locale/fr')

function bookRoom(room, date, time, duration) {
  const { rooms } = require(process.env.DB_FILE_PATH)

  const id = room.id

  if (!room) {
    throw {
      message: 'Salle non trouvée',
      status: 404,
    }
  }

  const requestedStartTime = dayjs(`${date}T${time}`)
  const now = dayjs()

  if (requestedStartTime.isBefore(now)) {
    throw {
      message: 'Impossible de réserver une salle dans le passé',
      status: 400,
    }
  }

  const isAvailable = checkRoomAvailability(room.bookings, date, time, duration)

  if (!isAvailable) {
    throw {
      message: 'La salle n\'est pas disponible',
      status: 400,
    }
  }

  const booking = {
    start: `${date}T${time}`,
    end: dayjs(`${date}T${time}`).add(duration, 'minute').format(),
  }
  const roomIndex = rooms.findIndex(r => r.id === id)

  if (roomIndex === -1) {
    throw {
      messsage: 'Salle non trouvée',
      status: 404,
    }
  }

  rooms[roomIndex].bookings.push(booking)
  rooms[roomIndex].bookings.sort((a, b) => new Date(a.start) - new Date(b.start))
  rooms[roomIndex].updatedAt = dayjs().format()

  const fs = require('fs')

  fs.writeFile(path.join(__dirname, process.env.DB_FILE_PATH), JSON.stringify({ rooms }, null, 2), (err) => {
    if (err) {
      throw {
        message: 'Erreur interne du serveur',
        status: 500,
      }
    }
  })

  return rooms
}

module.exports = bookRoom
