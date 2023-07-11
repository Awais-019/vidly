const errorLogger = require("../startup/logging");

function error(err, req, res, next) {
  errorLogger.log("error", err.message, err);
  res.status(500).send("Something failed");
}

module.exports = error;
