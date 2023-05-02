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
    }
});

module.exports = mongoose.model('customers', customersSchema)