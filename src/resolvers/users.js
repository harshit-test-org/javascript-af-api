const mongoose = require('mongoose')

const User = mongoose.model('User')

export default {
  Query: {
    getAllUsers: async () => {
      const user = await User.find()
      return user
    },
    getUserById: async (_, { id }) => {
      const user = await User.findOne({ _id: id })
      return user
    }
  }
}
