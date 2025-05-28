const mongoose = require('mongoose');

const adminContact = new mongoose.Schema({
    officeLocation: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    otherInfo: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const AdminContact = mongoose.model('AdminContact', adminContact);
module.exports = AdminContact