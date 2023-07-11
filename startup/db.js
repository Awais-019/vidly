const mongoose = require("mongoose");
const infoLogger = require("./logging");

module.exports = function () {
  mongoose.connect("mongodb://localhost/vidly").then(() => {
    infoLogger.info("Connected to MongoDB...");
  });
};
