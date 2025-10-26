const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const {username, password} = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({username, password: hashed});
    res.json({message: "Registered successfully"});
  } catch {
    res.status(400).json({error: "Username already exists"});
  }
});

router.post("/login", async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({error: "Invalid credentials"});

  const token = jwt.sign(
    {id: user._id, isAdmin: user.isAdmin},
    process.env.JWT_SECRET
  );
  res.json({token});
});

module.exports = router;
