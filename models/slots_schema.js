const mongoose = require('mongoose');

const slotsSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    timeSlots: {
        type: Object,
        required: true
    },
});

module.exports = mongoose.model('slots', slotsSchema)