import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'
import graphql from '../lib/graphql'
import client from '../algolia'

const User = mongoose.model('User')
const Repo = mongoose.model('Repo')

const router = express.Router()

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_STATE = process.env.GITHUB_STATE
const SERVER_HOST = process.env.SERVER_HOST

const index = client.initIndex('users')

router.get('/start', (req, res) => {
  const url = encodeURI(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&state=${GITHUB_STATE}&redirect_uri=${SERVER_HOST}/auth/github/callback&scope=user:email,read:user`
  )
  res.redirect(url)
})

router.get('/callback', (req, res) => {
  const { error, code, state } = req.query
  if (error || !code) {
    return res.redirect(process.env.FRONT_END)
  }
  if (state !== GITHUB_STATE) return res.redirect(process.env.FRONT_END)
  axios
    .post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    )
    .then(async response => {
      const token = response.data.access_token
      const { data: userInfo } = await axios.get(
        'https://api.github.com/user/emails?access_token=' + token
      )
      const existingUser = await User.findOne({ email: userInfo[0].email })
      if (existingUser) {
        await User.update(
          { email: userInfo[0].email },
          {
            $set: {
              token
            }
          }
        ).exec()
        //  create session ....
        req.session.user = existingUser._id
      } else {
        const { data: info } = await graphql({
          query: `
              {
                viewer {
                  pinnedRepositories(first: 6) {
                    edges {
                      node {
                        name
                        url
                        description
                      }
                    }
                  }
                  name
                  bio
                  avatarUrl
                }
              }
              `,
          headers: {
            Authorization: `bearer ${token}`
          }
        })
        const newUser = await User.create({
          name: info.data.viewer.name,
          bio: info.data.viewer.bio,
          photoURL: info.data.viewer.avatarUrl,
          token,
          email: userInfo[0].email
        })
        const userRepos = info.data.viewer.pinnedRepositories.edges.map(
          item => ({
            name: item.node.name,
            description: item.node.description,
            imageURL: info.data.viewer.avatarUrl,
            owner: newUser._id
          })
        )
        await Repo.insertMany(userRepos)
        index.saveObject({
          name: newUser.name,
          bio: newUser.bio,
          photoURL: newUser.photoURL,
          email: newUser.email,
          objectID: newUser._id
        })
        req.session.user = newUser._id
      }
      res.redirect(`${process.env.FRONT_END}/home`)
    })
})

export default router
