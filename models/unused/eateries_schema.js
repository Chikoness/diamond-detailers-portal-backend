const mongoose = require('mongoose');

const EateriesSchema = mongoose.Schema({
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
    email: {
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
    menu: {
        type: Object,
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

module.exports = mongoose.model('eateries', EateriesSchema)