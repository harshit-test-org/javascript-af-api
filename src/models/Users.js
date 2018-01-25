import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
})

mongoose.model('User', UserSchema)
