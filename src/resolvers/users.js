import mongoose from 'mongoose'
import axios from 'axios'

const User = mongoose.model('User')

export default {
  Query: {
    getUserById: async (_, { id }) => {
      const user = await User.findOne({ _id: id })
      return user
    },
    getUserGithubRepos: async (_, args, { user }) => {
      const { data: repos } = await axios.post(
        'https://api.github.com/graphql',
        {
          query: `
            {
              viewer {
                repositories(orderBy: {field: STARGAZERS, direction: DESC},first:10) {
                    nodes {
                      name
                      id
                      descriptionHTML
                      stargazers{
                        totalCount
                      }
                    }
                }
              }
            }
        `
        },
        {
          headers: {
            Authorization: `bearer ${user.token}`
          }
        }
      )
      return repos.data.viewer.repositories.nodes.map(item => ({
        owner: user,
        name: item.name,
        description: item.descriptionHTML,
        starCount: item.starCount,
        imageURL: user.photoURL,
        _id: item.id
      }))
    }
  }
}
