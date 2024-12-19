const redis = require("redis");
const logger = require("./logger");

const client = redis.createClient({ url: process.env.REDIS_URL });
client.on("connect", () => {
  console.log("connected to redis");
  logger.log("info", "connected to redis");
});
client.on("error", (err) => {
  logger.log("error", err.message);
});

const RedisConnect = async () => {
  try {
    await client.connect();
  } catch (err) {
    logger.log("error", err.message);
  }
};

module.exports = RedisConnect;
