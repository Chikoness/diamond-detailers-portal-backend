const bookings = require("../models/booking_schema");
const schedulers = require("../models/scheduler_schema");
const schedulerRouter = require("express").Router();

const updateScheduler = (req, res) => {
  const query = schedulers.findOne({ hotelId: req.body.hotelId });
  query.exec(async (err, data) => {
    let saveSchedule = new schedulers;
    
    if (data) {
      let newBooking = data.bookings
      // hotel exists in schedulers
      console.log("Hotel " + req.body.hotelId + " exists. Updating...");
      
      for (let i = 0; i < req.body.dates.length; i++) {
        let date = req.body.dates[i]
        let roomChosen = req.body.roomChosen;

        if (typeof data.bookings[date] === "undefined") {
            console.log("No rooms booked for " + date + " yet. Making a new one...")

            Object.assign(newBooking, { [date]: { [roomChosen] : req.body.quantity } })

            saveSchedule = await schedulers.updateMany(
            { hotelId: req.body.hotelId },
            {
                $set: {
                    bookings: newBooking,
                },
            }
            );
        } else if (typeof data.bookings[date][roomChosen] === "undefined") {
            console.log("No " + roomChosen + " booked for " + date + " yet. Making a new one...")

            Object.assign(newBooking[date], { [roomChosen] : req.body.quantity })

            saveSchedule = await schedulers.updateMany(
            { hotelId: req.body.hotelId },
            {
                $set: {
                    bookings: newBooking,
                },
            }
            );
        } else {
            console.log("Room of this type has been made for this date before. Updating it...")
            data.bookings[date][roomChosen] = String(parseInt(data.bookings[date][roomChosen]) + parseInt(req.body.quantity));

            Object.assign(newBooking, data.bookings)

            saveSchedule = await schedulers.updateMany(
                { hotelId: req.body.hotelId },
                {
                $set: {
                    bookings: newBooking
                },
                }
            );
        }
      }      
    } else {
      // hotel doesn't exist in schedulers
      console.log(
        "Hotel " + req.body.hotelId + " doesn't exist. Making one...."
      );

      const schedule = new schedulers({
        hotelId: req.body.hotelId,
        bookings: req.body.booking,
      });

      saveSchedule = await schedule.save();
    }

    if (saveSchedule) {
        console.log("scheduler updated successfully!")
        return res
            .status(200)
            .send({ message: "scheduler updated successfully!" });
    }
  });
};

const getScheduler = (req, res) => {
  const query = schedulers.findOne({ hotelId: req.query.hotelId });
  query.exec(async (err, data) => {
    if (err) {
      return res.status(500).send({ message: "Error: " + err });
    }

    if (data) {
      return res.status(200).send({
        data: data,
      });
    }

    return res.status(200).send({
      data: [],
    });
  });
}

schedulerRouter.post("/updateScheduler", async (req, res) => {
  return updateScheduler(req, res);
});

schedulerRouter.get("/getScheduler", async (req, res) => {
  return getScheduler(req, res);
});

module.exports = schedulerRouter;
