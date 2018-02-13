import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: String,
  token: String,
  name: String,
  photoURL: String,
  bio: String
})

mongoose.model('User', UserSchema)
