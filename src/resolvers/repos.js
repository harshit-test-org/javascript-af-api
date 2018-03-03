const mongoose = require('mongoose')

const Repos = mongoose.model('Repo')

export default {
  Query: {
    getRepos: async () => {
      const repos = await Repos.find()
      return repos
    }
  }
}
