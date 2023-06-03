const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('express-async-errors');
const cors = require('cors');

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