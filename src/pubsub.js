import { RedisPubSub } from 'graphql-redis-subscriptions'

export default new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    password: process.env.REDIS_PASS || '',
    retry_strategy: options => Math.max(options.attempt * 100, 3000)
  }
})
