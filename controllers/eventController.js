const Event = require('../models/Event');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.render('events', {
      title: 'All Events',
      events,
      req
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { getAllEvents };