const express = require('express')
const app = express()
const port = 3000

const cors = require('cors')
const path = require('path')

app.use(cors({origin: '*'}))

app.get('/rooms', (req, res) => {
  res.header('Content-Type','application/json')
  res.sendFile(path.join(__dirname, 'rooms.json'))
})

app.listen(port, () => {
  console.log(`Simple server listening on port ${port}`)
})
