const mongoose = require('mongoose');

const SchedulerSchema = mongoose.Schema({
    hotelId: {
        type: String,
        required: true
    },
    /*
        bookings: {
            1/22/22: { // mm/dd/yy
                King Suite: 2,
                Deluxe Suite: 1
            },
            1/23/22: {
                King Suite: 1
            }
        }
    */
    bookings: {
        type: Object,
        required: true,
    }
});

module.exports = mongoose.model('scheduler', SchedulerSchema)