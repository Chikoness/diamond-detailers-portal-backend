const mongoose = require('mongoose');

const TravelPlannersSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    until: {
        type: String,
        required: true
    },
    typeOfTravel: {
        type: String,
        // required: true
    },
    plans: {
        type: Array,
        // required: true
    },
    reminderNote: {
        type: Array,
        // required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('travelPlanners', TravelPlannersSchema)