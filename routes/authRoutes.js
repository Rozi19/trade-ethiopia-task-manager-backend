const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

/* =========================
   REGISTER API
========================= */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.send("User registered successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   LOGIN API 
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.send("Wrong password");

    // JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;