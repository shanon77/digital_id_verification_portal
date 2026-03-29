require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Student = require('./models/Student');
const Event = require('./models/Event');
const Admin = require('./models/Admin');
const Registration = require('./models/Registration');


const students = [
  { name: 'Arjun Kumar',    registerNumber: '21CS001', department: 'CSE', email: 'arjun.kumar@college.edu' },
  { name: 'Priya Sharma',   registerNumber: '21CS002', department: 'CSE', email: 'priya.sharma@college.edu' },
  { name: 'Rahul Verma',    registerNumber: '21EC001', department: 'ECE', email: 'rahul.verma@college.edu' },
  { name: 'Sneha Patel',    registerNumber: '21EC002', department: 'ECE', email: 'sneha.patel@college.edu' },
  { name: 'Vikram Singh',   registerNumber: '21ME001', department: 'MECH', email: 'vikram.singh@college.edu' },
  { name: 'Anjali Nair',    registerNumber: '21ME002', department: 'MECH', email: 'anjali.nair@college.edu' },
  { name: 'Karthik Reddy',  registerNumber: '21IT001', department: 'IT',   email: 'karthik.reddy@college.edu' },
  { name: 'Divya Menon',    registerNumber: '21IT002', department: 'IT',   email: 'divya.menon@college.edu' },
  { name: 'Suresh Babu',    registerNumber: '21CE001', department: 'CIVIL', email: 'suresh.babu@college.edu' },
  { name: 'Meera Iyer',     registerNumber: '21CE002', department: 'CIVIL', email: 'meera.iyer@college.edu' },

  { name: 'Shanon K',          registerNumber: '21CE023', department: 'CIVIL', email: 'shanon.k@college.edu' },
  { name: 'Sarang Nair',       registerNumber: '21CE024', department: 'CIVIL', email: 'sarang.nair@college.edu' },
  { name: 'Sivanth Raj',       registerNumber: '21CE025', department: 'CIVIL', email: 'sivanth.raj@college.edu' },
  { name: 'Samual Thomas',     registerNumber: '21CE026', department: 'CIVIL', email: 'samual.thomas@college.edu' },
];

const events = [
  {
    title: 'National Level Hackathon 2025',
    description: 'A 24-hour coding marathon where teams build innovative tech solutions to real-world problems. Winners get cash prizes and internship opportunities.',
    eligibleDepartments: ['CSE', 'IT', 'ECE'],
    date: new Date('2025-04-15')
  },
  {
    title: 'Robotics & Automation Expo',
    description: 'Showcase your robotics projects and compete with teams from across the state. Hands-on workshops and industry expert talks included.',
    eligibleDepartments: ['ECE', 'MECH', 'CSE'],
    date: new Date('2025-05-02')
  },
  {
    title: 'Civil Engineering Design Challenge',
    description: 'Design and model innovative civil structures using sustainable materials. Best designs will be reviewed by industry architects.',
    eligibleDepartments: ['CIVIL', 'MECH'],
    date: new Date('2025-05-20')
  },
  {
    title: 'Inter-Department Tech Quiz',
    description: 'A fast-paced technical quiz competition covering core engineering subjects, current technology trends, and general knowledge.',
    eligibleDepartments: ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'],
    date: new Date('2025-06-05')
  },
  {
    title: 'IoT & Embedded Systems Workshop',
    description: 'A hands-on workshop on building smart devices using Arduino, Raspberry Pi, and various IoT sensors. Limited seats available.',
    eligibleDepartments: ['ECE', 'CSE', 'IT'],
    date: new Date('2025-06-18')
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Student.deleteMany({});
    await Event.deleteMany({});
    await Admin.deleteMany({});
    await Registration.deleteMany({});
    console.log('✅ Existing data cleared.\n');

    const insertedStudents = await Student.insertMany(students);
    console.log(`✅ ${insertedStudents.length} students inserted.\n`);

    console.log('🎪 Inserting sample events...');
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ ${insertedEvents.length} events inserted.\n`);

    console.log('🔐 Creating default admin account...');
    const admin = new Admin({
      username: 'admin',
      password: 'admin123' 
    });
    await admin.save();
    console.log('✅ Admin created → Username: admin | Password: admin123\n');


    insertedStudents.forEach(s => {
      console.log(`  ${s.registerNumber} | ${s.name.padEnd(20)} | ${s.department}`);
    });

    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
