const mongoose = require("mongoose");
const config = require("config");

const infoLogger = require("./logging");

module.exports = function () {
  const db = config.get("db");
  mongoose.connect(db).then(() => {
    infoLogger.info(`Connected to ${db}...`);
  });
};
