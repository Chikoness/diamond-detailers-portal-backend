const mongoose = require('mongoose');

const JournalsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('journals', JournalsSchema)