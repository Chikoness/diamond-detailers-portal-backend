const hotels = require("../models/hotels_schema");
const bookings = require("../models/booking_schema");
const schedulers = require("../models/scheduler_schema");
const bookingRouter = require("express").Router();

const registerBooking = (req, res) => {
  const query = bookings.findOne({ id: req.body.id });
  query.exec(async (data) => {
    if (data) {
      return res.status(400).send({
        message:
          "booking " +
          id +
          " exists! Please make a new booking by refreshing the page.",
      });
    } else {
      let _booking = await bookings.find({});

      var str = "" + Object.keys(_booking).length;
      var pad = "000";
      var id = "b-" + pad.substring(0, pad.length - str.length) + str;

      const booking = new bookings({
        id: id,
        hotelId: req.body.hotelId,
        email: req.body.email,
        booking: req.body.booking,
      });

      const saved = await booking.save();

      if (saved) {
        console.log("booking " + id + " created!");
        return res.status(200).send({ message: "booking " + id + " created!" });
      }
    }

    return res.status(404).send({ message: "Hotel doesn't exist" });
  });
};

const getBooking = (req, res) => {
  const query = bookings.findOne({ hotelId: req.query.hotelId });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        data: data,
      });
    }

    return res.status(404).send({ message: "No bookings for this hotel yet!" });
  });
};

bookingRouter.post("/registerBooking", async (req, res) => {
  return registerBooking(req, res);
});

bookingRouter.get("/getBooking", async (req, res) => {
  return getBooking(req, res);
});

module.exports = bookingRouter;
