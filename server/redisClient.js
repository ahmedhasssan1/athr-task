const redis=require("redis")

const redisClient = redis.createClient({
  socket: {
    host: '192.168.116.128',
    port: 6379
  }
});
redisClient.connect().catch(console.error);
module.exports.redisClients=redisClient
