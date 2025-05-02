const checkRoomAvailability = require('./checkRoomAvailability')

require('dotenv').config()

function searchRooms(date, time, duration, minCapacity, equipments) {
  const { rooms } = require(process.env.DB_FILE_PATH)

  const filteredRooms = rooms.filter(room => {
    const isAvailable = checkRoomAvailability(room.bookings, date, time, duration)
    const hasCapacity = minCapacity ? room.capacity >= minCapacity : true

    const hasEquipments = equipments ? equipments.split(',').every(equipment => {
      return room.equipments.some(roomEquipment => roomEquipment.id === equipment)
    }) : true

    return isAvailable && hasCapacity && hasEquipments
  })

  return filteredRooms
}

module.exports = searchRooms
