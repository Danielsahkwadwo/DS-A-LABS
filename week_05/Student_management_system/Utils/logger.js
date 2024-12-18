const { createLogger, format, transports } = require("winston");

// Custom filter for the "info" level
const infoFilter = format((info) => {
  return info.level === "info" ? info : false;
});

// Custom filter for the "error" level
const errorFilter = format((info) => {
  return info.level === "error" ? info : false;
});

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "./Logs/server-info-logs.log",
      level: "info",
      format: format.combine(
        infoFilter(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
    new transports.File({
      filename: "./Logs/server-error-logs.log",
      level: "error",
      format: format.combine(
        errorFilter(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, method, url }) => {
          return `${timestamp} ${level}: ${message}  METHOD:${method}   URL:${url}`;
        })
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.timestamp(), format.json()),
    })
  );
}

module.exports = logger;
