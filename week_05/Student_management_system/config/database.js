const mongoose = require("mongoose");
const logger = require("./../config/logger");
const connectDatabase = () => {
  mongoose
    .connect(process.env.LOCAL_DB)
    .then(() => {
      console.log("Database connected");
      logger.log("info", "Database connected sussessfully");
    })
    .catch((err) => logger.log("error", err.message));
};

module.exports = connectDatabase;
