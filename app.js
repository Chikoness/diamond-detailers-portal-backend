const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('express-async-errors');
const cors = require('cors');

// const log = require('./utils/log');

const employeesRouter = require('./controllers/employees');
// const journalsRouter = require('./controllers/journals')
// const travelPlannerRouter = require('./controllers/travelPlanners');
// const hotelsRouter = require('./controllers/hotels');
// const bookingRouter = require('./controllers/booking');
// const schedulerRouter = require('./controllers/scheduler');
// const eateriesRouter = require('./controllers/eateries');
// const attractionsRouter = require('./controllers/attractions');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/employees/', employeesRouter);
// app.use('/api/journals', journalsRouter);
// app.use('/api/travelplanner', travelPlannerRouter);
// app.use('/api/hotels', hotelsRouter);
// app.use('/api/booking', bookingRouter);
// app.use('/api/scheduler', schedulerRouter);
// app.use('/api/eateries', eateriesRouter);
// app.use('/api/attractions', attractionsRouter);

module.exports = app;