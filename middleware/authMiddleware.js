const User = require("../models/User");

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.send("Access Denied");
  }
  next();
};

exports.isStudent = (req, res, next) => {
  if (req.session.user.role !== "student") {
    return res.send("Access Denied");
  }
  next();
};
