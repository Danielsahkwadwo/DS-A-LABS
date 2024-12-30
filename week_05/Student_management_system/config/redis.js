const redis = require("redis");
const logger = require("./logger");

const RedisClient = redis.createClient({ url: process.env.REDIS_URL });
RedisClient.on("connect", () => {
  console.log("connected to redis");
  logger.log("info", "connected to redis");
});
// RedisClient.on("error", (err) => {
//   logger.log("error", err.message);
// });

const RedisConnect = async () => {
  try {
    await RedisClient.connect();
  } catch (err) {
    logger.log("error", err.message);
    console.log("Error connecting to redis");
  }
};

module.exports = { RedisConnect, RedisClient };
