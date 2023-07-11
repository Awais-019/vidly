const { createLogger, format, transports } = require("winston");
const { combine, timestamp } = format;
require("winston-mongodb");

module.exports = createLogger({
  format: combine(timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "combined.log" }),
    new transports.MongoDB({ db: "mongodb://localhost/vidly", level: "error" }),
  ],
});
