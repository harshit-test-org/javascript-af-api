import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import path from 'path'
import cors from 'cors'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import { makeExecutableSchema } from 'graphql-tools'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import authRoutes from './routes/auth'

const MongoStore = connectMongo(session)

const User = mongoose.model('User')

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')))

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
)

const app = express()
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 15552000000 }, // 6 months
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)
const corsMW = cors({
  origin: process.env.FRONT_END,
  credentials: true
})

app.use(corsMW)
app.options('*', corsMW)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use(async (req, res, next) => {
  if (req.session.user) {
    try {
      const user = await User.findById(req.session.user).select('-following')
      req.user = user
    } catch (e) {
      return next()
    }
  }
  return next()
})

function ensureLoggedIn (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.status(403).json({ error: 401, msg: 'Not Authorized' })
  }
}
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('common'))
}
app.get('/me', ensureLoggedIn, (req, res) => {
  const { email, name, photoURL, bio } = req.user
  res.json({
    email,
    name,
    photoURL,
    bio
  })
})
app.get('/logout', (req, res) => {
  delete req.session.user
  res.redirect(process.env.FRONT_END)
})
app.use('/auth/github', authRoutes)

app.use(
  '/graphql',
  ensureLoggedIn,
  express.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user
    }
  }))
)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

export default app
