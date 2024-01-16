const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

const userController = {};

// Register a user
userController.registerUser = async (req, res, next) => {
  console.log('* Registering a new user...'); // CL

  try {
    const { username, email, password } = req.body;

    // Handle missing fields
    if (!username || !email || !password) {
      const missingFieldsErr = {
        log: '> Express error handler caught userController.registerUser Error',
        status: 400,
        message: { err: 'Missing required fields' },
      };
      console.log(`${missingFieldsErr.log} -> ${missingFieldsErr.message.err}`); // CL
      return next(missingFieldsErr);
    }

    // Create new user based on info from req body
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save user in db and invoke next middleware
    const registeredUser = await newUser.save(); // adds User obj 'newUser' to db, returns document
    res.locals.userId = registeredUser._id; // send the '._id' property to next middleware
    console.log('- New user registered: ', registeredUser); // CL
    return next();
  } catch (err) {
    // Invoke global error handler
    return next('> Error in userController.registerUser: ', err);
  }
};

// Log in a user
userController.loginUser = async (req, res, next) => {
  console.log('* Logging in user...'); // CL

  try {
    const { username, password } = req.body;

    // Handle missing field
    if (!username || !password) {
      const missingFieldsErr = {
        log: '> Express error handler caught userController.registerUser Error',
        status: 400,
        message: { err: 'Missing required fields' },
      };
      console.log(`${missingFieldsErr.log} -> ${missingFieldsErr.message.err}`); // CL
      return next(missingFieldsErr);
    }

    // Find user in db
    const foundUser = await User.findOne({ username: username }); // returns doc or null
    if (foundUser) console.log('- User found in db: ', foundUser._id);
    else {
      const userDneErr = {
        log: '> Express error handler caught userController.loginUser Error',
        status: 400,
        message: { err: 'Username does not exist in db' },
      };
      console.log(`${userDneErr.log} -> ${userDneErr.message.err}`); // CL
      return next(userDneErr);
    }

    // Compare user entered password w/ password in db
    const validPassword = await bcrypt.compare(password, foundUser.password); // return a boolean
    if (validPassword) {
      console.log('- Valid password entered: ', foundUser.password); // CL
      res.locals.userId = foundUser._id; // send '_.id' property to next middleware
      return next();
    } else {
      const invalidPasswordErr = {
        log: '> Express error handler caught userController.loginUser Error',
        status: 400,
        message: { err: 'Invalid password entered' },
      };
      console.log(
        `${invalidPasswordErr.log} -> ${invalidPasswordErr.message.err}`
      ); // CL
      return next(invalidPasswordErr);
    }
  } catch (err) {
    // Invoke global error handler
    return next('> Error in userController.loginUser: ', err);
  }
};

module.exports = userController;
