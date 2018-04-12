import mongoose from 'mongoose'
import gitql from '../lib/graphql'
import md from '../lib/markdown'

const Repos = mongoose.model('Repo')

export default {
  Repo: {
    readme: async ({ nameWithOwner }, _, { user }) => {
      const [repoOwner, repoName] = nameWithOwner.split('/')
      const {
        data: { data: { repository: { object: { text } } } }
      } = await gitql({
        query: `
        {
          repository(name: "${repoName}", owner: "${repoOwner}") {
            object(expression: "master:README.md") {
              ... on Blob {
                text
              }
            }
          }
        }
        `,
        headers: {
          Authorization: `bearer ${user.token}`
        }
      })
      return md(text)
    }
  },
  Query: {
    getRepos: async (_, { page = 1 }) => {
      const limit = 25
      const skip = page * limit - limit
      const repos = await Repos.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 'desc' })

      return repos
    },
    getRepo: async (_, { id }) => {
      const data = await Repos.findById(id)
      return data
    }
  },
  Mutation: {
    createRepository: async (
      _,
      { name, nameWithOwner, description },
      { user }
    ) => {
      const [repoOwner, repoName] = nameWithOwner.split('/')
      const { data: { data: { repository } } } = await gitql({
        query: `
        {
          repository(name: "${repoName}", owner: "${repoOwner}") {
            name
            nameWithOwner
            url
            stargazers {
              totalCount
            }
          }
        }

        `,
        headers: {
          Authorization: `bearer ${user.token}`
        }
      })
      const repoData = {
        name,
        nameWithOwner,
        owner: user._id,
        url: repository.url,
        starCount: repository.stargazers.totalCount,
        description
      }
      let newRepo = await Repos.create(repoData)
      newRepo = newRepo.toObject()
      newRepo.owner = {
        _id: user._id,
        photoURL: user.photoURL,
        name: user.name,
        bio: user.bio
      }
      return newRepo
    }
  }
}
