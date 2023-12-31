const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Fawn = require("fawn");

const { Rental, validate } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const movie = await Rental.findById(req.params.id);
  if (!movie) return res.status(404).send("Rental with given ID was not found");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Invalid movie");

  if (movie.numberInStock == 0)
    return res.status(400).send("Movie not in stock");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
