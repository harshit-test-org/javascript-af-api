import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MessagesSchema = new Schema(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel'
    },
    text: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: {
      createdAt: true
    }
  }
)

mongoose.model('Message', MessagesSchema)
