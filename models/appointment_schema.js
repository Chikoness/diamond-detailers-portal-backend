const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    carType: {
        type: String,
        required: true
    },
    services: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('attractions', appointmentSchema)