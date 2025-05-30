const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  otp: {
    code: { type: String, default: null },
    expiresAt: { type: Date, default: null },
    otpCreatedAt: { type: Date, default: Date.now },
  },
    createdAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model("Admin", adminSchema);
