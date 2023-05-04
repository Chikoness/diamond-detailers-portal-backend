const mongoose = require('mongoose');

const servicesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('services', servicesSchema)