const mongoose = require('mongoose');

const User = mongoose.model('User');

export default {
  Query: {
    getAllUsers: async () => await User.find()
  }
};
