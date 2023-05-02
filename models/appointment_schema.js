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
    },

    // employee side
    status: {
        type: String,
        required: true,
    },

    icNumber: {
        type: String,
        required: false
    },

    dirtInfo: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model('appointment', appointmentSchema)