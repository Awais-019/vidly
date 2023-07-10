const express = require("express");
const _ = require("lodash");
const bycrypt = require("bcrypt");
const router = express.Router();

const { User, validate } = require("../models/users");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bycrypt.genSalt(10);
  user.password = await bycrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(user);
});

module.exports = router;
