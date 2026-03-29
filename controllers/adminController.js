const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Student = require('../models/Student');


const getLoginPage = (req, res) => {
  if (req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { title: 'Admin Login' });
};

const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error_msg', 'Please enter username and password.');
      return res.redirect('/admin/login');
    }

    const admin = await Admin.findOne({ username: username.trim() });

    if (!admin) {
      req.flash('error_msg', 'Invalid username or password.');
      return res.redirect('/admin/login');
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      req.flash('error_msg', 'Invalid username or password.');
      return res.redirect('/admin/login');
    }
    req.session.admin = { id: admin._id, username: admin.username };
    req.flash('success_msg', `Welcome back, ${admin.username}!`);
    res.redirect('/admin/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server Error');
  }
};

const getDashboard = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('event', 'title date')
      .sort({ createdAt: -1 });

    const totalRegistrations = registrations.length;
    const verifiedCount = registrations.filter(r => r.status === 'Verified').length;
    const rejectedCount = registrations.filter(r => r.status === 'Rejected').length;

    const events = await Event.find();

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      registrations,
      totalRegistrations,
      verifiedCount,
      rejectedCount,
      events
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

const postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/login');
  });
};

const getAddEventPage = (req, res) => {
  res.render('admin/add-event', { title: 'Add Event' });
};

const postAddEvent = async (req, res) => {
  try {
    const { title, description, date, location, eligibleDepartments } = req.body;

    if (!title || !description || !date || !location) {
      req.flash('error_msg', 'Please fill in all required fields.');
      return res.redirect('/admin/add-event');
    }

    let departments = ['All'];
    if (eligibleDepartments && eligibleDepartments.trim()) {
      departments = eligibleDepartments.split(',').map(dept => dept.trim().toUpperCase());
    }

    const newEvent = new Event({
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      location: location.trim(),
      eligibleDepartments: departments,
    });

    await newEvent.save();
    req.flash('success_msg', `Event "${title}" added successfully!`);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Add event error:', error);
    req.flash('error_msg', 'Error adding event. Please try again.');
    res.redirect('/admin/add-event');
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ registerNumber: 1 });
    const registrations = await Registration.find()
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    res.render('admin/all-students', {
      title: 'All Students',
      students,
      registrations
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).send('Server Error');
  }
};

const getEditEventPage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error_msg', 'Event not found.');
      return res.redirect('/admin/dashboard');
    }
    res.render('admin/edit-event', {
      title: 'Edit Event',
      event
    });
  } catch (error) {
    console.error('Get edit event error:', error);
    res.status(500).send('Server Error');
  }
};

const postEditEvent = async (req, res) => {
  try {
    const { title, description, date, location, eligibleDepartments } = req.body;

    if (!title || !description || !date || !location) {
      req.flash('error_msg', 'Please fill in all required fields.');
      return res.redirect(`/admin/edit-event/${req.params.id}`);
    }

    let departments = ['All'];
    if (eligibleDepartments && eligibleDepartments.trim()) {
      departments = eligibleDepartments.split(',').map(dept => dept.trim().toUpperCase());
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        location: location.trim(),
        eligibleDepartments: departments,
      },
      { new: true }
    );

    req.flash('success_msg', 'Event updated successfully!');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Edit event error:', error);
    req.flash('error_msg', 'Error updating event. Please try again.');
    res.redirect('/admin/dashboard');
  }
};

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Event deleted successfully!');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Delete event error:', error);
    req.flash('error_msg', 'Error deleting event. Please try again.');
    res.redirect('/admin/dashboard');
  }
};

const getAddStudentPage = (req, res) => {
  res.render('admin/add-student', { title: 'Add Student' });
};

const postAddStudent = async (req, res) => {
  try {
    const { name, registerNumber, department, email } = req.body;

    if (!name || !registerNumber || !department || !email) {
      req.flash('error_msg', 'Please fill in all required fields.');
      return res.redirect('/admin/add-student');
    }

    const existingStudent = await Student.findOne({ registerNumber: registerNumber.toUpperCase() });
    if (existingStudent) {
      req.flash('error_msg', 'A student with this register number already exists.');
      return res.redirect('/admin/add-student');
    }

    const newStudent = new Student({
      name: name.trim(),
      registerNumber: registerNumber.trim().toUpperCase(),
      department: department.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
    });

    await newStudent.save();
    req.flash('success_msg', `Student "${name}" added successfully!`);
    res.redirect('/admin/all-students');
  } catch (error) {
    console.error('Add student error:', error);
    req.flash('error_msg', 'Error adding student. Please try again.');
    res.redirect('/admin/add-student');
  }
};

const getEditStudentPage = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      req.flash('error_msg', 'Student not found.');
      return res.redirect('/admin/all-students');
    }
    res.render('admin/edit-student', {
      title: 'Edit Student',
      student
    });
  } catch (error) {
    console.error('Get edit student error:', error);
    res.status(500).send('Server Error');
  }
};

const postEditStudent = async (req, res) => {
  try {
    const { name, registerNumber, department, email } = req.body;

    if (!name || !registerNumber || !department || !email) {
      req.flash('error_msg', 'Please fill in all required fields.');
      return res.redirect(`/admin/edit-student/${req.params.id}`);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        registerNumber: registerNumber.trim().toUpperCase(),
        department: department.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
      },
      { new: true }
    );

    req.flash('success_msg', 'Student updated successfully!');
    res.redirect('/admin/all-students');
  } catch (error) {
    console.error('Edit student error:', error);
    req.flash('error_msg', 'Error updating student. Please try again.');
    res.redirect('/admin/all-students');
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    // Delete all registrations associated with this student
    await Registration.deleteMany({ student: studentId });
    // Delete the student
    await Student.findByIdAndDelete(studentId);
    req.flash('success_msg', 'Student and associated registrations deleted successfully!');
    res.redirect('/admin/all-students');
  } catch (error) {
    console.error('Delete student error:', error);
    req.flash('error_msg', 'Error deleting student. Please try again.');
    res.redirect('/admin/all-students');
  }
};

const getRegistrationsPage = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    const verifiedCount = registrations.filter(r => r.status === 'Verified').length;
    const rejectedCount = registrations.filter(r => r.status === 'Rejected').length;

    res.render('admin/registrations', {
      title: 'Manage Registrations',
      registrations,
      verifiedCount,
      rejectedCount
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).send('Server Error');
  }
};

const approveRegistration = async (req, res) => {
  try {
    await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'Verified', rejectionReason: null },
      { new: true }
    );
    req.flash('success_msg', 'Registration approved successfully!');
    res.redirect('/admin/registrations');
  } catch (error) {
    console.error('Approve registration error:', error);
    req.flash('error_msg', 'Error approving registration. Please try again.');
    res.redirect('/admin/registrations');
  }
};

const rejectRegistration = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      req.flash('error_msg', 'Please provide a rejection reason.');
      return res.redirect('/admin/registrations');
    }

    await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected', rejectionReason: reason.trim() },
      { new: true }
    );
    req.flash('success_msg', 'Registration rejected successfully!');
    res.redirect('/admin/registrations');
  } catch (error) {
    console.error('Reject registration error:', error);
    req.flash('error_msg', 'Error rejecting registration. Please try again.');
    res.redirect('/admin/registrations');
  }
};

const deleteRegistration = async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Registration deleted successfully!');
    res.redirect('/admin/registrations');
  } catch (error) {
    console.error('Delete registration error:', error);
    req.flash('error_msg', 'Error deleting registration. Please try again.');
    res.redirect('/admin/registrations');
  }
};

module.exports = { getLoginPage, postLogin, getDashboard, postLogout, getAddEventPage, postAddEvent, getAllStudents, getEditEventPage, postEditEvent, deleteEvent, getAddStudentPage, postAddStudent, getEditStudentPage, postEditStudent, deleteStudent, getRegistrationsPage, approveRegistration, rejectRegistration, deleteRegistration };