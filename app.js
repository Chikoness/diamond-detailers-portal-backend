const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('express-async-errors');
const cors = require('cors');
const nodemailer = require('nodemailer'); // disable forgot password for now
const cron = require("node-cron");
const APPPASSWORD = process.env.APPPASSWORD;

const appointment = require("./models/appointment_schema");

// cron scheduler
cron.schedule("* 23 * * *", function() {
    console.log("------------------")
    console.log("Checking if got upcoming appointments...")
    console.log("------------------")
})

function checkIfGotUpcomingAppointments() {
    const query = appointment.find({ });
    query.exec(async (err, data) => {
        Object.values(data).forEach(async d => {
            let date = new Date(d.date)
            const oneday = 60 * 60 * 24 * 1000

            if (date >= oneday) {
                time = null

                switch (d.timeSlot) {
                    case "0900":
                        time = "9.00a.m. - 12.00p.m."
                        break;
                    case "1400":
                        time = "2.00p.m. - 5.00p.m."
                        break;
                    case "1800":
                        time = "6.00p.m. - 9.00p.m."
                        break;
                }
                const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ]


                let dateString = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
                await email.sendMail(carWashReminderEmail(time, date, req.body.email))
            }
        })
    })
}

const email = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        secure: false,
        auth: {
            user: "diamonddetailers8@gmail.com",
            pass: APPPASSWORD
        },
        logger: true,
        transactionLog: true // include SMTP traffic in the logs
    },
    {
        from: 'Diamond Detailers Plt <diamonddetailers8@gmail.com>'
    }
);

const carWashReminderEmail = (time, date, recipientEmail) => {
    return {
        to: `${recipientEmail}`,
        subject: `🚗 Reminder For Your Car Wash Service`,
        html: `<h2>Hello from Diamond Detailers PLT,</h2> <br />
            This is a reminder for your car wash and service appointment you have made with us some time ago.<br /><br />
            Date: ${date}<br />
            Time: ${time}<br /><br />
            We hope to see you soon!<br /><br /><br /><br />
            Regards,<br />
            Diamond Detailers PLT<br />
            @instagram: diamonddetailersplt<br />
            @Facebook: https://www.facebook.com/DiamondDetailersPLOT`
    }
}

const employeesRouter = require('./controllers/employees');
const appointmentRouter = require('./controllers/appointments')
const customerRouter = require('./controllers/customers');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/employees/', employeesRouter);
app.use('/api/appointment/', appointmentRouter);
app.use('/api/customer/', customerRouter);

module.exports = app;