const express = require("express");
const app = express();

app.use(express.json());

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Romance" },
];

app.get("/", (req, res) => {
  res.send("Welcome to the Vidly!");
});

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
