import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ChannelSchema = new Schema(
  {
    name: String,
    imageURL: String,
    public: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
)

mongoose.model('Channel', ChannelSchema)
