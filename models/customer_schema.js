const mongoose = require('mongoose');

const customersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    carType: {
        type: Array,
        required: true
    },
    weatherDistance: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model('customers', customersSchema)