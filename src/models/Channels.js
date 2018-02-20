import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ChannelSchema = new Schema({
  name: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  imageURL: String,
  public: { type: Boolean, default: true }
})

mongoose.model('Channel', ChannelSchema)
