const customers = require("../models/customer_schema");
const appointment = require("../models/appointment_schema");
const slot = require("../models/slots_schema")
const services = require("../models/services_schema");
// const e = require("cors");
const appointmentRouter = require("express").Router();

const makeAppointment = (req, res) => {
    let date = new Date(req.body.date)
    let dateInString =
        date.getFullYear() + "/" +
        ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
        ((date.getDate()).toString().length == 1 ? '0' + (date.getDate()) : (date.getDate()))

    const querySlot = slot.findOne({ date: dateInString })
    querySlot.exec(async (err, data) => {
        let getAllAppointments = await appointment.find({});
        let dateInStringNoSlash =
            date.getFullYear() + "" +
            ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "" +
            ((date.getDate()).toString().length == 1 ? '0' + (date.getDate()) : (date.getDate()))

        let id = req.body.name.substring(0, 3) + "-" + dateInStringNoSlash + "-" + Object.keys(getAllAppointments).length;

        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            // Date exists, add into date and check if there is slot
            // slots are : 9am - 12pm, 2pm - 5pm, 6pm - 9pm
            // Example of a slot entry in MongoDB :
            //
            // date: 01012024
            // slot: {
            //      0900: [ Cla-01012024-0 ]
            //      1400: [ Cla-01012024-0, Jas-01012024-1, Che-01012024-2 ]
            //      1800: [ Jon-01012024-3, Jon-01012024-3, Jon-01012024-3 ]
            // }
            //
            // Note: max 3 slots allowed for each time slots
            // If time slot is full, reject creating appointment

            let timeSlotLocal = data.timeSlots

            for (let i = 0; i < req.body.services.length; i++) {
                if (timeSlotLocal[req.body.timeSlot].length < 3) {
                    timeSlotLocal[req.body.timeSlot].push(id)
                } else {
                    return res.status(403).send({ message: "Slot for " + req.body.timeSlot + " is full. Please pick a different slot." });
                }
            }

            await slot.updateOne(
                { date: dateInString },
                {
                    $set: {
                        timeSlots: timeSlotLocal
                    },
                }
            );

            const query = customers.findOne({ email: req.body.email });
            query.exec(async (err2, data2) => {
                if (err2) {
                    console.log("Error: " + err);
                    return res.status(500).send({ message: "Error: " + err });
                }

                if (data2) {
                    // if customer exists, check if customer has such carType, if not, add it to the array of carType
                    if (!data2.carType.includes(req.body.carType)) {
                        let carTypeArray = data2.carType
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
                    return res.status(200).send({
                        message: "appointment " + id + " created!",
                        id: id
                    });
                }
            });
        } else {
            return res.status(403).send({ message: "Slot not found. Please run the Check Slot Availability button again" })
        }
    })
}

const checkSlotAvailability = (req, res) => {
    let date = new Date(req.body.date)
    let dateInString =
        date.getFullYear() + "/" +
        ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
        ((date.getDate()).toString().length == 1 ? '0' + (date.getDate()) : (date.getDate()))

    const querySlot = slot.findOne({ date: dateInString })

    querySlot.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            return res.status(200).send({
                timeSlots: data.timeSlots
            });
        } else {
            // Date doesn't exist yet, create new slot entry
            let slotArray = {
                "0900": [],
                "1400": [],
                "1800": []
            }

            const slUpdate = new slot({
                date: dateInString,
                timeSlots: slotArray
            })

            await slUpdate.save();

            if (slUpdate) {
                return res.status(200).send({
                    timeSlots: slotArray
                });
            }
        }
    })
}

const getAllAppointments = (req, res) => {
    const query = appointment.find({});
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            return res.status(200).send({
                data
            });
        } else {
            return res.status(403).send({
                message: 'No appointments made.',
                data: []
            })
        }
    })
}

const getFullPrice = (req, res) => {
    const query = services.find({})
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            let price = 0

            data.forEach(s => {
                for (let i = 0; i < req.body.services.length; i++) {
                    if (s.name == req.body.services[i]) {
                        price += s.price
                    }
                }
            })

            if (price > 0) {
                return res.status(200).send({ price: price });
            } else {
                return res.status(404).send({ message: "Price compilation error, please try again" });
            }
        }
    })
}

const getAppointment = (req, res) => {
    const query = appointment.findOne({ id: req.query.id });
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            console.log(data)
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
                let date = new Date(req.body.date)
                let dateInString =
                    date.getFullYear() + "/" +
                    ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
                    ((date.getDate()).toString().length == 1 ? '0' + (date.getDate()) : (date.getDate()))

                const querySlot = slot.findOne({ date: dateInString })
                querySlot.exec(async (err2, data2) => {
                    if (err2) {
                        return res.status(500).send({ message: "Error: " + err });
                    }

                    if (data2) {
                        let tempData = data2.timeSlots

                        const deleteId = tempData[req.body.timeSlot].filter(ts => {
                            return ts !== req.body.id;
                        });

                        tempData[req.body.timeSlot] = deleteId

                        await slot.updateOne(
                            { date: dateInString },
                            {
                                $set: {
                                    timeSlots: tempData
                                },
                            }
                        );
                    } else {
                        return res.status(403).send({ message: "Appointment does not exist: " + err });
                    }
                })

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
            // Delete the apppointment off the slots database
            let date = new Date(req.body.oldDate)
            let dateInString =
                date.getFullYear() + "/" +
                ((date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
                ((date.getDate()).toString().length == 1 ? '0' + (date.getDate()) : (date.getDate()))

            const querySlotOld = slot.findOne({ date: dateInString })
            querySlotOld.exec(async (err2, data2) => {
                if (err2) {
                    return res.status(500).send({ message: "Error: " + err });
                }

                if (data2) {
                    let tempData = data2.timeSlots

                    const deleteId = tempData[req.body.oldTimeSlot].filter(ts => {
                        return ts !== req.body.id;
                    });

                    tempData[req.body.oldTimeSlot] = deleteId

                    await slot.updateOne(
                        { date: dateInString },
                        {
                            $set: {
                                timeSlots: tempData
                            },
                        }
                    );

                    // Add the new appointment to slot database
                    let newDate = new Date(req.body.date)
                    let newDateInString =
                        newDate.getFullYear() + "/" +
                        ((newDate.getMonth() + 1).toString().length == 1 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1)) + "/" +
                        ((newDate.getDate()).toString().length == 1 ? '0' + (newDate.getDate()) : (newDate.getDate()))

                    const querySlotNew = slot.findOne({ date: newDateInString })
                    querySlotNew.exec(async (err3, data3) => {
                        if (err3) {
                            return res.status(500).send({ message: "Error: " + err });
                        }

                        if (data3) {
                            let timeSlotLocal = data3.timeSlots

                            for (let i = 0; i < req.body.services.length; i++) {
                                if (timeSlotLocal[req.body.timeSlot].length < 3) {
                                    timeSlotLocal[req.body.timeSlot].push(req.body.id)
                                } else {
                                    return res.status(403).send({ message: "Slot for " + req.body.timeSlot + " is full. Please pick a different slot." });
                                }
                            }

                            await slot.updateOne(
                                { date: newDateInString },
                                {
                                    $set: {
                                        timeSlots: timeSlotLocal
                                    },
                                }
                            );

                            // add the car to customer's entry in customer database if not exist
                            const query = customers.findOne({ email: req.body.email });
                            query.exec(async (err4, data4) => {
                                if (err4) {
                                    console.log("Error: " + err);
                                    return res.status(500).send({ message: "Error: " + err });
                                }

                                if (data4) {
                                    // if customer exists, check if customer has such carType, if not, add it to the array of carType
                                    if (!data4.carType.includes(req.body.carType)) {
                                        let carTypeArray = data4.carType
                                        carTypeArray.push(req.body.carType)

                                        await customers.updateOne(
                                            { id: req.body.id },
                                            {
                                                $set: {
                                                    carType: carTypeArray
                                                },
                                            }
                                        );
                                    }
                                }
                            })
                        }
                    })
                } else {
                    return res.status(403).send({ message: "Appointment does not exist: " + err });
                }
            })

            let appt = await appointment.updateOne(
                { id: req.body.id },
                {
                    $set: {
                        carType: req.body.carType,
                        services: req.body.services,
                        date: req.body.date,
                        timeSlot: req.body.timeSlot,
                        status: req.body.status
                    },
                }
            );

            if (appt) {
                return res.status(200).send(
                    {
                        message: "Appointment " + data.id + " edited - from " + req.body.oldDate + "; " + req.body.oldTimeSlot + " --> " + req.body.date + "; " + req.body.timeSlot + "."
                    });
            }
        } else {
            return res.status(400).send({ message: "Appointment not in database. Please make new appointment or try again." });
        }
    });
}

const getAllServices = (req, res) => {
    const query = services.find({});
    query.exec(async (err, data) => {
        if (err) {
            console.log("Error: " + err);
            return res.status(500).send({ message: "Error: " + err });
        }

        if (data) {
            return res.status(200).send({
                data
            });
        }
    })
}

appointmentRouter.post("/new", async (req, res) => {
    return makeAppointment(req, res);
});

appointmentRouter.post("/new/checkSlotAvailable", async (req, res) => {
    return checkSlotAvailability(req, res);
});

appointmentRouter.post("/new/getFullPrice", async (req, res) => {
    return getFullPrice(req, res)
})

appointmentRouter.post("/edit", async (req, res) => {
    return editAppointment(req, res);
});

appointmentRouter.get("/get", async (req, res) => {
    return getAppointment(req, res);
});

appointmentRouter.get('/all', async (req, res) => {
    return getAllAppointments(req, res);
})

appointmentRouter.post("/delete", async (req, res) => {
    return deleteAppointment(req, res);
});

appointmentRouter.get("/new/getAllServices", async (req, res) => {
    return getAllServices(req, res)
})

module.exports = appointmentRouter;
