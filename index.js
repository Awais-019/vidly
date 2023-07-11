const express = require("express");
const app = express();
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
require("express-async-errors");
require("./startup/logging");
require("./startup/routes")(app);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) =>
    console.error("Could not connect to MongoDB...", err.message)
  );

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

exports.Joi = Joi;
