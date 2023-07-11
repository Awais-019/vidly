const { createLogger, format, transports } = require("winston");
const { combine, timestamp } = format;

module.exports = createLogger({
  format: combine(timestamp(), format.json()),
  transports: [new transports.File({ filename: "combined.log" })],
});
