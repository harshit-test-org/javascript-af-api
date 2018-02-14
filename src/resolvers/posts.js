const mongoose = require('mongoose')

const Follower = mongoose.model('Follower')

export default {
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
  }
}
