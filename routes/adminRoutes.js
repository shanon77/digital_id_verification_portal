const express = require("express");
const router = express.Router();
const {
  getLoginPage,
  postLogin,
  getDashboard,
  postLogout,
  getAddEventPage,
  postAddEvent,
  getAllStudents,
  getEditEventPage,
  postEditEvent,
  deleteEvent,
  getAddStudentPage,
  postAddStudent,
  getEditStudentPage,
  postEditStudent,
  deleteStudent,
  getRegistrationsPage,
  approveRegistration,
  rejectRegistration,
  deleteRegistration,
} = require("../controllers/adminController");

const isAdminAuthenticated = (req, res, next) => {
  if (req.session.admin) {
    return next();
  }
  req.flash("error_msg", "Please login to access the admin panel.");
  res.redirect("/admin/login");
};

router.get("/login", getLoginPage);
router.post("/login", postLogin);
router.get("/dashboard", isAdminAuthenticated, getDashboard);
router.get("/registrations", isAdminAuthenticated, getRegistrationsPage);
router.get("/approve-registration/:id", isAdminAuthenticated, approveRegistration);
router.post("/reject-registration/:id", isAdminAuthenticated, rejectRegistration);
router.get("/delete-registration/:id", isAdminAuthenticated, deleteRegistration);
router.get("/add-event", isAdminAuthenticated, getAddEventPage);
router.post("/add-event", isAdminAuthenticated, postAddEvent);
router.get("/all-students", isAdminAuthenticated, getAllStudents);
router.get("/add-student", isAdminAuthenticated, getAddStudentPage);
router.post("/add-student", isAdminAuthenticated, postAddStudent);
router.get("/edit-student/:id", isAdminAuthenticated, getEditStudentPage);
router.post("/edit-student/:id", isAdminAuthenticated, postEditStudent);
router.get("/delete-student/:id", isAdminAuthenticated, deleteStudent);
router.get("/edit-event/:id", isAdminAuthenticated, getEditEventPage);
router.post("/edit-event/:id", isAdminAuthenticated, postEditEvent);
router.get("/delete-event/:id", isAdminAuthenticated, deleteEvent);
router.post("/logout", isAdminAuthenticated, postLogout);

module.exports = router;
