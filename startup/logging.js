const { createLogger, format, transports } = require("winston");
const { combine, timestamp } = format;
require("winston-mongodb");
require("express-async-errors");

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION", ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  process.exit(1);
});

module.exports = createLogger({
  format: combine(timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "combined.log" }),
    new transports.Console({ colorize: true, prettyPrint: true }),
    new transports.MongoDB({ db: "mongodb://localhost/vidly", level: "error" }),
  ],
});
