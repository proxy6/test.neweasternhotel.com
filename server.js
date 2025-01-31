require('dotenv').config();
const cron = require('node-cron');
const express = require("express");
const ejs = require("ejs");
const path = require('path');
const app = express();
const routerIndex = require('./routers/index.router');
// const sequelize = require("./config/database");
// const association = require('./models/association');
const configSession = require('./config/session');
// const db = require('./config/database'); // Load m`odels

const CronService  = require('./services/cron.service'); // Import the cron job


// // Define associations here, after importing models
// association(db);

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Config app session
configSession(app);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(routerIndex);

// Initialize database connection and sync models if needed
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database: ', error);
//   });

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log("Server listening on port " + port);
  // Schedule the cron job to run once a day at midnight
cron.schedule('0 0 * * *', () => {
    console.error('Running daily house keeping cron...');
    CronService.callCron();
});

});
