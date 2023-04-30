const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('express-async-errors');
const cors = require('cors');

const log = require('./utils/log');

const usersRouter = require('./controllers/users');
const journalsRouter = require('./controllers/journals')
const travelPlannerRouter = require('./controllers/travelPlanners')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/journals', journalsRouter);
app.use('/api/travelplanner', travelPlannerRouter);

module.exports = app;