const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "server-logs.log",
      level: "info",
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
    // new transports.Console({
    //   level: "info",
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
  ],
});

module.exports = logger;
