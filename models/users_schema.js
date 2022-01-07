const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // passwordResetToken: {
    //     type: String
    // },
    // passwordResetTokenDate: {
    //     type: Date
    // }
});

module.exports = mongoose.model('users', UserSchema)