import { RedisPubSub } from 'graphql-redis-subscriptions'

export default new RedisPubSub({
  connection: {
    host: '127.0.0.1',
    port: 6379,
    retry_strategy: options => {
      // reconnect after upto 3000 milis
      return Math.max(options.attempt * 100, 3000);
    }
  }
});