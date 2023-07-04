const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('express-async-errors');
const cors = require('cors');
const nodemailer = require('nodemailer'); // disable forgot password for now
const cron = require("node-cron");
const APPPASSWORD = process.env.APPPASSWORD;

const appointment = require("./models/appointment_schema")
const customers = require('./models/customer_schema')

const AppRouter = require('express').Router()

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

// cron scheduler for appointment reminder - everyday at midnight will fire up
cron.schedule("0 0 * * *", function() {
    console.log("------------------")
    console.log("Checking if got upcoming appointments...")
    console.log("------------------")

    checkIfGotUpcomingAppointments();
})

// cron scheduler for appointment reminder - everyday monday midnight will fire up (per week)
cron.schedule("0 0 * * MON", function() {
    console.log("------------------")
    console.log("Sending recommended date and services email...")
    console.log("------------------")

    checkDistanceWeather();
})

const checkIfGotUpcomingAppointments = () => {
    const query = appointment.find({ });
    query.exec(async (err, data) => {
        Object.values(data).forEach(async d => {
            let currentDate = new Date();
            let date = new Date(d.date)
            // const oneday = 60 * 60 * 24 * 1000

            if (currentDate.getDate() + 1 == d.date.getDate() || currentDate.getDate() == d.date.getDate()) {
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

                let dateString = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()

                if (d.status == "Pending") {
                    await email.sendMail(carWashReminderEmail(time, dateString, d.email))
                }
            }
        })
    })
}

const checkDistanceWeather = (req, res) => {
    const query = customers.findOne({ email: req.body.email })
    query.exec(async (err, data) => {
        Object.values(data).forEach(async d => {
            let recommendedDate = 30;
            if (d.weatherDistance !== undefined) {
                if (d.weatherDistance.distance > 35) {
                    // when the user has traveled over 35km, fire up the email recommendation algorithm
                    recommendedDate = checkWeatherDistanceAlgorithm(d.weatherDistance.distance, d.weatherDistance.new.weather)

                    let date = new Date();
                    let newDate = date.setDate(date.getDate() + recommendedDate)
                    let dateString = new Date(newDate).getDate() + " " + months[new Date(newDate).getMonth()] + " " + new Date(newDate).getFullYear()
                    
                    await email.sendMail(
                        carWashRecommendedEmail(
                            dateString, 
                            d.weatherDistance.distance.toFixed(1), 
                            decodeWeatherCode(d.weatherDistance.new.weather), 
                            findRecommendedService(d.weatherDistance.new.weather, d.weatherDistance.distance), 
                            req.body.email
                        )
                    )

                    let newWeatherDistance = {
                        old: {
                            lat: d.weatherDistance.old.lat,
                            long: d.weatherDistance.old.long,
                            weather: d.weatherDistance.old.weather,
                            distance: d.weatherDistance.old.distance
                        },
                        new: {
                            lat: d.weatherDistance.new.lat,
                            long: d.weatherDistance.new.long,
                            weather: d.weatherDistance.new.weather,
                            distance: d.weatherDistance.new.distance
                        },
                        distance: 0, // reset the distance
                        dateRecommended: date
                    }

                    await customers.updateOne(
                        { id: req.body.email },
                        {
                          $set: {
                            weatherDistance: newWeatherDistance
                          }
                        }
                    )
                }
            }
        })

        return res.status(200).send({
            message:
              'checkWeatherDistance done.'
        })
    })
}

const checkWeatherDistanceAlgorithm = (distance, weather) => {
    /*
        For every 5km:
            - Clouds: -1
            - Clear: -1
            - Drizzle: -5
            - Rain: -7
            - Thunderstorm: -10
            - Atmosphere is -0 because there is less chance of tornado and volanic ash
    */
    const clearClouds = -1
    const drizzle = -5
    const rain = -7
    const thunderstorm = -10

    let startDays = 120 // 30 days in a month, and slowly minus off based on distance travelled and weather travelled under
    
    let numberOf5kms = Math.floor(distance / 5);

    if (weather >= 200 && weather < 300)
        startDays += (numberOf5kms * thunderstorm)
    else if (weather >= 300 && weather < 400) {
        startDays += (numberOf5kms * drizzle)
    }
    else if (weather >= 500 && weather < 600)
        startDays += (numberOf5kms * rain)
    else if (weather >= 800)
        startDays += (numberOf5kms * clearClouds)

    if (startDays < 0) { // if calculation reached < 0 days
        return 1;
    } else {
        return startDays
    }
}

const decodeWeatherCode = (weather) => {
    if (weather >= 200 && weather < 300)
        return "thunderstorm"
    else if (weather >= 300 && weather < 400)
        return "drizzle"
    else if(weather >= 500 && weather < 600)
        return "rain"
    else
        return "cloudy/clear"
}

const findRecommendedService = (weather, distance) => {
    let arrayOfServices = []

    // taking weather into consideration

    switch (decodeWeatherCode(weather)) {
        case "thunderstorm":
            arrayOfServices.push("premium polish and protection")
            arrayOfServices.push("watermark removal and protection")
            arrayOfServices.push("sealant and wax solution")
            break;
        case "drizzle":
            arrayOfServices.push("sealant solution")
            break;
        case "rain":
            arrayOfServices.push("sealant and wax solution")
            arrayOfServices.push("polish and protection")
            break;
        case "cloudy/clear":
            arrayOfServices.push("maintenance")
            break;
    }

    switch (distance) {
        case distance < 15:
            arrayOfServices.push("wash and vacuum")
            break;
        default:
            arrayOfServices.push("premium wash")
            break;
    }

    let stringArrayTogether = "";

    if (arrayOfServices.length <= 1) {
        stringArrayTogether += arrayOfServices[0]
    }

    for (let i = 0; i < arrayOfServices.length; i++) {
        if (i == arrayOfServices.length - 1) {
            stringArrayTogether += "and " + arrayOfServices[i]
        } else {
            stringArrayTogether += arrayOfServices[i] + ", "
        }
    }

    return stringArrayTogether
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
            @Facebook: https://www.facebook.com/DiamondDetailersPLT`
    }
}

const carWashRecommendedEmail = (date, distance, weather, services, recipientEmail) => {
    return {
        to: `${recipientEmail}`,
        subject: `🚗 You Should Wash Your Car Soon!`,
        html: `<h2>Hello from Diamond Detailers PLT,</h2> <br />
            It seems like you have been traveling for a long period of time! According to our calculation, you have driven:<br /><br />
            <b>${distance}km</b> driven last week, with the latest weather being <b>${weather}</b>.<br /><br />
            We recommend for you to come for your car wash by <b>${date}</b>. You might want to consider getting the <b>${services}</b>.<br /><br />
            We hope to see you soon!<br /><br /><br /><br />
            Regards,<br />
            Diamond Detailers PLT<br />
            @instagram: diamonddetailersplt<br />
            @Facebook: https://www.facebook.com/DiamondDetailersPLT`
    }
}

const employeesRouter = require('./controllers/employees');
const appointmentRouter = require('./controllers/appointments')
const customerRouter = require('./controllers/customers');

AppRouter.post('/test', async (req, res) => {
    return checkDistanceWeather(req, res)
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/employees/', employeesRouter);
app.use('/api/appointment/', appointmentRouter);
app.use('/api/customer/', customerRouter);
app.use('/api/', AppRouter)

module.exports = app;