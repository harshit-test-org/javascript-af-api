const mongoose = require('mongoose')

const User = mongoose.model('User')

export default {
  Query: {
    getUserById: async (_, { id }) => {
      const user = await User.findOne({ _id: id })
      return user
    }
  }
}
