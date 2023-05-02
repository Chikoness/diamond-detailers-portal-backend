const customers = require("../models/customer_schema");
const appointment = require("../models/appointment_schema");
const appointmentRouter = require("express").Router();

const makeAppointment = (req, res) => {
    const query = customers.findOne({ email: req.body.email });
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            // if customer exists, check if customer has such carType, if not, add it to the array of carType
            if (!data.carType.includes(req.body.carType)) {
                let carTypeArray = data.carType
                carTypeArray.push(req.body.carType)

                let cust = await customers.updateOne(
                    { id: req.body.id },
                    {
                        $set: {
                            carType: carTypeArray
                        },
                    }
                );

                if (cust) {
                    console.log("Car type " + req.body.carType + " added to customer " + req.body.email + "!")
                }
            }
        } else {
            // if customer doesn't exist, make new customer entry
            let carTypeArray = []
            carTypeArray.push(req.body.carType)

            const cust = new customers({
                name: req.body.name,
                email: req.body.email,
                carType: carTypeArray
            })

            const save = await cust.save();

            if (save) {
                console.log("New customer registered!")
            }
        }

        let getAllAppointments = await appointment.find({});
        let date = new Date(req.body.date)
        let id = req.body.name.substring(0, 3) + "-" + (date.getDate() + 1) + date.getMonth() + date.getFullYear() + "-" + Object.keys(getAllAppointments).length;

        const appt = new appointment({
            id: id,
            name: req.body.name,
            email: req.body.email,
            carType: req.body.carType,
            services: req.body.services,
            date: req.body.date,
            timeSlot: req.body.timeSlot,
            status: "Pending"

        });

        const saved = await appt.save();

        if (saved) {
            console.log("appointment " + id + " created!");
            return res.status(200).send({ message: "appointment " + id + " created!" });
        }
    });
}

const getAppointment = (req, res) => {
    const query = appointment.findOne({ id: req.body.id });
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            return res.status(200).send({
                data,
            });
        }

        return res.status(404).send({ message: "Appointment doesn't exist" });
    })
}

const deleteAppointment = (req, res) => {
    const query = appointment.findOne({ id: req.body.id });
    query.exec(async (err, data) => {
      if (err) {
        return res.status(500).send({ message: "Error: " + err });
      }
  
      if (data) {
        let appt = await appointment.deleteOne({
          id: req.body.id,
        });
  
        if (appt) {
          return res.status(200).send({
            message: `Appointment ${req.body.id} deleted!`,
          });
        }
  
        return res.status(500).send({ message: "Error: " + err });
      }
  
      return res.status(404).send({ message: "Appointment doesn't exist" });
    });
  };

const editAppointment = (req, res) => {
    const query = appointment.findOne({ id: req.body.id });
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            let appt = await appointment.updateOne(
                { id: req.body.id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        carType: req.body.carType,
                        services: req.body.services,
                        date: req.body.date,
                        timeSlot: req.body.timeSlot,
                        status: req.body.status
                    },
                }
            );

            if (appt) {
                return res.status(200).send({ message: "Appointment " + data.id + " edited!" });
            }
        } else {
            return res.status(400).send({ message: "Appointment not in database. Please make new appointment or try again." });
        }
    });
}

appointmentRouter.post("/new", async (req, res) => {
    return makeAppointment(req, res);
});

appointmentRouter.post("/edit", async (req, res) => {
    return editAppointment(req, res);
});

appointmentRouter.post("/get", async (req, res) => {
    return getAppointment(req, res);
});

appointmentRouter.post("/delete", async (req, res) => {
    return deleteAppointment(req, res);
  });

module.exports = appointmentRouter;
