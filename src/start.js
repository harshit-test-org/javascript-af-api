import {} from 'dotenv/config'
// Include models here (for mongoose singleton to work)
import mongoose from 'mongoose'
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import './models/Users'
import './models/Posts'
import './models/Followers'
import './models/Messages'
import './models/ChannelMembers'
import './models/Channels'
import './models/Repos'
import app, { schema, sessionParser } from './app'

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo :)')
})

mongoose.connection.on('error', e => {
  console.log(`Mongo error -> ${e}`)
})
const User = mongoose.model('User')

const PORT = process.env.PORT || 8080

const server = createServer(app)

server.listen(PORT, () => {
  // eslint-disable-next-line
  const subs = new SubscriptionServer(
    {
      execute,
      subscribe,
      onConnect: async (conn, webSocket) => {
        if (!webSocket.upgradeReq.session || !webSocket.upgradeReq.session.user) {
          throw new Error('Not Authenticated')
        }
        try {
          const user = await User.findById(webSocket.upgradeReq.session.user)
          return {
            currentUser: user
          }
        } catch (e) {
          throw new Error('Not Authenticated')
        }
      },
      schema
    },
    {
      server: server,
      path: '/api/subscriptions',
      verifyClient: (info, done) => {
        sessionParser(info.req, {}, () => {
          done(info.req.session)
        })
      }
    }
  )

  console.log('APP started on PORT : ' + PORT)
})
