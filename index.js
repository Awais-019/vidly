const express = require("express");
const app = express();

const infoLogger = require("./startup/logging");

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  infoLogger.info(`Listening on port ${port}...`)
);

module.exports = server;
