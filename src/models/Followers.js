import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FollowerSchema = new Schema({
  followee: mongoose.Schema.Types.ObjectId,
  following: mongoose.Schema.Types.ObjectId
})

mongoose.model('Follower', FollowerSchema)
