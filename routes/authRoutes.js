const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/register", async (req, res) => {
  const { name, email, password, studentIdNumber } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      studentIdNumber,
    });

    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send("Registration Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid email or password");
    }

    req.session.user = {
      id: user._id,
      role: user.role,
    };

    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/student/dashboard");
    }
  } catch (error) {
    console.log(error);
    res.send("Login Error");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
