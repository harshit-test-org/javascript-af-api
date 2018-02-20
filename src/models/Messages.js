import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MessagesSchema = new Schema({
  channelId: {
    type: Schema.Types.ObjectId,
    ref: 'Channels'
  },
  text: String,
  created_at: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('Message', MessagesSchema)
