const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    hotelId: {
        type: String,
        required: true
    },
    email: {
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
    booking: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    vaccination: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('bookings', BookingSchema)