const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoute = require('./routes/userRoutes.js');

dotenv.config();
const app = express();

const port = process.env.SERVER_PORT || 3000;
const dbUrl = process.env.MONGO_URL;

// Handle parsing the JSON body of every req
app.use(express.json());

// Connect to db server
mongoose
  .connect(dbUrl)
  .then(console.log('* Db connected')) // CL
  .catch(err => console.log(err));

// Define route handlers
app.use('/api/user', userRoute);

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: '> Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occured' },
  };

  const errorObj = Object.assign(defaultErr, err); // overwrite properties of defaultErr if err is provided by middleware
  return res.status(errorObj.status).json(errorObj.message);
});

// Listen for incoming reqs
app.listen(
  port,
  () => console.log(`* Server listening @ http://localhost:${port}`) // CL
);
