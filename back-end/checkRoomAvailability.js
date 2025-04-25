const dayjs = require('dayjs')
require('dayjs/locale/fr')

function checkRoomAvailability(bookings, date, time, duration) {
  if (!bookings.length) {
    return true
  }

  const isAvailable = bookings.every(booking => {
    const startTime = dayjs(booking.start)
    const endTime = dayjs(booking.end)
    const requestedStartTime = dayjs(`${date}T${time}`)
    const requestedEndTime = dayjs(requestedStartTime).add(duration, 'minute')

    const isOverlapping = requestedStartTime.isBefore(endTime) && requestedEndTime.isAfter(startTime)
    return !isOverlapping
  })

  return isAvailable
}

module.exports = checkRoomAvailability
