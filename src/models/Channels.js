import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ChannelSchema = new Schema({
  name: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  public: { type: Boolean, default: true },
  admins: [mongoose.Schema.Types.ObjectId]
})

mongoose.model('Channel', ChannelSchema)
