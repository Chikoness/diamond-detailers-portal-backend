const mongoose = require('mongoose');

const employeesSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    websites: {
        type: Array,
        required: true
    },
    sop: {
        type: Array,
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
});

module.exports = mongoose.model('attractions', employeesSchema)