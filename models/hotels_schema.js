const mongoose = require('mongoose');

const HotelsSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
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
    websites: {
        type: Array,
        required: true
    },
    star: {
        type: String,
        required: true
    },
    rooms: {
        type: Object,
        required: true
    },
    facilities: {
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

module.exports = mongoose.model('hotels', HotelsSchema)