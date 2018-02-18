import mongoose from 'mongoose'

const Post = mongoose.model('Post')
const Follower = mongoose.model('Follower')

export default {
  // Subscription: {
  //   msg: {
  //     resolve: (payload, args, context, info) => {},
  //     subscribe: withFilter(
  //       () => pubsub.asyncIterator('NEW_MSG'),
  //       (payload, variables) => {
  //         console.log(payload, variables)
  //         return true
  //       }
  //     )
  //   }
  // },
  Query: {
    getFeed: async (_, args, { user }) => {
      const q = [
        {
          $match: {
            followee: user._id
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'following',
            foreignField: 'authorId',
            as: 'posts'
          }
        },
        {
          $unwind: '$posts'
        },
        {
          $replaceRoot: { newRoot: '$posts' }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: '$author'
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]
      const res = await Follower.aggregate(q).limit(10)
      return res
    }
  },
  Mutation: {
    async setPost (_, { authorId, text }) {
      try {
        await Post.create({
          authorId,
          text
        })
        return {
          ok: true
        }
      } catch (er) {
        return {
          ok: 'false',
          message: er.message
        }
      }
    }
  }
}
