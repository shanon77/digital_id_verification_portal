const Student = require('../models/Student');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getHomePage = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.render('index', {
      title: 'Digital Event ID Verification Portal',
      events
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).send('Server Error');
  }
};

const getRegisterPage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      req.flash('error_msg', 'Event not found.');
      return res.redirect('/');
    }

    res.render('register', {
      title: `Register for ${event.title}`,
      event
    });
  } catch (error) {
    console.error('Error loading registration page:', error);
    res.status(500).send('Server Error');
  }
};

const postRegister = async (req, res) => {
  try {
    const { name, registerNumber, department, email } = req.body;
    const eventId = req.params.eventId;

    const cleanName = name.trim();
    const cleanRegNo = registerNumber.trim().toUpperCase();
    const cleanDept = department.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    const event = await Event.findById(eventId);
    if (!event) {
      req.flash('error_msg', 'Event not found.');
      return res.redirect('/');
    }

    let status = 'Verified';
    let rejectionReason = null;

    const student = await Student.findOne({ registerNumber: cleanRegNo });

    if (!student) {
      status = 'Rejected';
      rejectionReason = `Register number "${cleanRegNo}" does not exist in the student master database.`;
    } else {
      if (student.name.toLowerCase() !== cleanName.toLowerCase()) {
        status = 'Rejected';
        rejectionReason = `Name "${cleanName}" does not match the record for register number "${cleanRegNo}".`;
      }

      else if (student.department.toUpperCase() !== cleanDept) {
        status = 'Rejected';
        rejectionReason = `Department "${cleanDept}" does not match the record for register number "${cleanRegNo}".`;
      }

      else {
        const eligibleDepts = event.eligibleDepartments.map(d => d.toUpperCase());
        if (!eligibleDepts.includes(cleanDept)) {
          status = 'Rejected';
          rejectionReason = `Department "${cleanDept}" is not eligible for the event "${event.title}". Eligible: ${event.eligibleDepartments.join(', ')}.`;
        }
      }
    }

    const registration = await Registration.create({
      student: student ? student._id : null,
      event: eventId,
      submittedName: cleanName,
      submittedRegisterNumber: cleanRegNo,
      submittedDepartment: cleanDept,
      submittedEmail: cleanEmail,
      status,
      rejectionReason
    });

    res.redirect(`/result/${registration._id}`);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Server Error');
  }
};

const getResult = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
      req.flash('error_msg', 'Registration result not found.');
      return res.redirect('/');
    }

    res.render('result', {
      title: 'Verification Result',
      registration
    });
  } catch (error) {
    console.error('Error loading result page:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { getHomePage, getRegisterPage, postRegister, getResult };