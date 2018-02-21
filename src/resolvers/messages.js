import { withFilter } from 'graphql-subscriptions'
import mongoose from 'mongoose'
import pubSub from '../pubsub'

const ChannelMember = mongoose.model('ChannelMember')
const Message = mongoose.model('Message')
const Channel = mongoose.model('Channel')

export default {
  Query: {
    getUserChannels: async (_, args, { user }) => {
      // Get all user channels
      const q = [
        {
          $match: {
            member: user._id
          }
        },
        {
          $lookup: {
            from: 'channels',
            localField: 'channel',
            foreignField: '_id',
            as: 'channel'
          }
        },
        { $project: { _id: 0, channel: 1 } },
        { $unwind: '$channel' },
        {
          //  [{channel:....},{channel:....}]
          $facet: {
            dms: [
              {
                $match: {
                  'channel.public': false
                }
              },
              {
                $replaceRoot: {
                  newRoot: '$channel'
                }
              }
            ],
            global: [
              {
                $match: {
                  'channel.public': true
                }
              },
              {
                $replaceRoot: {
                  newRoot: '$channel'
                }
              }
            ]
          }
        }
      ]
      const result = await ChannelMember.aggregate(q)
      return result[0]
    },
    getMessages: async (_, { channelId, offset = 1 }, { user }) => {
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
          const limit = 10
          const skip = offset * limit - limit
          const result = await Message.find({
            channelId
          })
            .skip(skip)
            .sort({
              createdAt: -1
            })
            .limit(limit)
            .populate('author')
          return result
        } else {
          return new Error('You are not a member of this channel')
        }
      } catch (e) {
        throw e
      }
    }
  },
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
            channelId,
            author: user.id
          }
          let result = await Message.create(newMessage)
          result = result.toObject()
          result.author = {
            _id: user._id,
            photoURL: user.photoURL,
            name: user.name,
            bio: user.bio
          }
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
