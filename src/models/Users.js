import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: String,
  token: String,
  username: String,
  name: String,
  photoURL: String,
  bio: String,
  githubURL: String
})

mongoose.model('User', UserSchema)
