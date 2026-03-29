// routes/studentRoutes.js - Public routes for students

const express = require("express");
const router = express.Router();
const {
  getHomePage,
  getRegisterPage,
  postRegister,
  getResult,
} = require("../controllers/studentController");

router.get("/", getHomePage);
router.get("/register/:eventId", getRegisterPage);
router.post("/register/:eventId", postRegister);
router.get("/result/:id", getResult);

module.exports = router;
