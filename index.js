const express = require("express");
const app = express();
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
require("express-async-errors");
require("./startup/logging");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) =>
    console.error("Could not connect to MongoDB...", err.message)
  );

const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middlewares/error");

app.use(error);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use(express.json());
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

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
