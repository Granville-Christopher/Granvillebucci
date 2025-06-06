const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String, 
    required: true,
  },
  message: {
    type: String, 
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const Contact = mongoose.model('Contact',contactSchema);

module.exports = Contact;
