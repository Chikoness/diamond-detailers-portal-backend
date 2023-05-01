const mongoose = require('mongoose');

const employeesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icNumber: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: true
    },
    securityLvl: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('employees', employeesSchema)