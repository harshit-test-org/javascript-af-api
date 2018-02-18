import { withFilter } from 'graphql-subscriptions'
import mongoose from 'mongoose'
import pubSub from '../pubsub'

const ChannelMember = mongoose.model('ChannelMember')
const Message = mongoose.model('Message')
const Channel = mongoose.model('Channel')

export default {
  Subscription: {
    msg: {
      resolve: async (payload, args, { currentUser }) => {
        try {
          const channelPromise = Channel.findById(payload.channelId)
          const channelMemberPromise = ChannelMember.findOne({
            member: currentUser._id,
            channel: payload.channelId
          })
          const [channelRes, channelMemberRes] = await Promise.all([
            channelPromise,
            channelMemberPromise
          ])
          if (channelMemberRes || (channelRes && channelRes.public)) {
            return payload
          } else {
            throw new Error('Not authorized')
          }
        } catch (e) {
          throw e
        }
      },
      subscribe: withFilter(
        () => pubSub.asyncIterator('NEW_MSG'),
        (payload, variables) => {
          return payload.channelId.toString() === variables.channelId.toString()
        }
      )
    }
  },
  Mutation: {
    createMessage: async (_, { channelId, text }, { user }) => {
      try {
        const { _id } = user
        const channelPromise = Channel.findById(channelId)
        const channelMemberPromise = ChannelMember.findOne({
          member: _id,
          channel: channelId
        })
        const [channelRes, channelMemberRes] = await Promise.all([
          channelPromise,
          channelMemberPromise
        ])
        if (channelMemberRes || (channelRes && channelRes.public)) {
          // HE is in the channel lets make a message
          const newMessage = {
            text,
            channelId
          }
          const result = await Message.create(newMessage)
          pubSub.publish('NEW_MSG', result)
          return result
        } else {
          return new Error('You are not a member of this channel')
        }
      } catch (e) {
        throw e
      }
    }
  }
}
