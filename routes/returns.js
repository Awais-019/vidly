const express = require("express");
const moment = require("moment");
const Joi = require("../startup/validation");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const router = express.Router();

const { Rental } = require("../models/rentals");
const { Movie } = require("../models/movies");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.findByIdAndUpdate(
    {
      _id: rental.movie._id,
    },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(req.body);
}

module.exports = router;
