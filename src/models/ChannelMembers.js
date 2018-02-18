import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ChannelMembersSchema = new Schema({
  member: mongoose.Schema.Types.ObjectId,
  channel: mongoose.Schema.Types.ObjectId
})

mongoose.model('ChannelMember', ChannelMembersSchema)
