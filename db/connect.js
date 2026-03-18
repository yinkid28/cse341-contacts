const mongoose = require('mongoose');

const initDb = (callback) => {
  mongoose
    .connect(process.env.MONGODB_URI, { dbName: 'cse341' })
    .then(() => {
      console.log('Connected to MongoDB via Mongoose');
      callback(null);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      callback(err);
    });
};

module.exports = { initDb };