import {} from 'dotenv/config'
// Include models here (for mongoose singleton to work)
import mongoose from 'mongoose'
import './models/Users'
import app from './app'

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo :)')
})

mongoose.connection.on('error', e => {
  console.log(`Mongo error -> ${e}`)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`API started on PORT ${PORT}`)
})
