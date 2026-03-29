require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const connectDB = require('./config/db');

const studentRoutes = require('./routes/studentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Sanity check for environment variables on Vercel
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in environment variables.");
}
if (!process.env.SESSION_SECRET) {
  console.error("WARNING: SESSION_SECRET is not defined.");
}

connectDB().catch(err => {
  console.error("Database connection failed during startup:", err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session configuration with error handling and fallback
let storeInstance;
try {
  if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb')) {
    storeInstance = MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: 'native',
      touchAfter: 24 * 3600
    });
  } else {
    console.warn("Using MemoryStore for sessions: MONGO_URI is missing or invalid.");
  }
} catch (storeError) {
  console.error("Failed to initialize MongoStore:", storeError);
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_fallback',
  resave: false,
  saveUninitialized: false,
  store: storeInstance, // Defaults to MemoryStore if storeInstance is undefined
  cookie: { 
    maxAge: 1000 * 60 * 60,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax'
  }
}));




app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.admin = req.session.admin || null;
  next();
});

app.use('/', studentRoutes);
app.use('/events', eventRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong! Please try again later.');
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;