const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// configure dotenv so I can use variables from .env (with process.env.VARIABLE_NAME)
dotenv.config();

// connect to database (in this case: I have my database locally)
try {
  mongoose.connect('mongodb://127.0.0.1:27017/TaskManager-test');
  console.info('Connected to database!');
} catch (error) {
  next(error);
}

// **********       Step 1: create express App and configure it     **********
const app = express();

// we use body-parser, so we have to turn off urlencoded (by default equals true)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ***********      Step 2: require needed routes and app.use them      **********
const authRoutes = require('./routes/auth.js');

app.use('/', authRoutes);

// if it falls trough -> 404 page not found (wrond url)
app.use((req, res, next) => {
  const error = new Error('Page not found: ');
  error.status = 404;
  next(error);
});

// let it fall through to error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);

  // in my case: error.status will always have a value because I don't trow my own Error (it will have value by default -> provided by browser)
  const statusCode = error.status || 500;

  return res.status(error.status).json({ message: error.message });
});

module.exports = app;
