const mongoose = require('mongoose');

const testimonySchema = new mongoose.Schema({
  point: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Path or URL to the uploaded image
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const Testimony = mongoose.model('Testimony', testimonySchema);

module.exports = Testimony;
