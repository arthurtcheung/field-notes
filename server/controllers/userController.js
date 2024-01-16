const User = require('../models/User.js');

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

    // Save user in db and send response
    const registeredUser = await newUser.save(); // adds User obj 'newUser' to db, returns document
    res.locals.userId = registeredUser._id; // send the '._id' property to next middleware
    console.log('* New user registered: ', registeredUser); // CL
    return next();
  } catch (err) {
    return next('> Error in userController.registerUser: ', err);
  }
};

module.exports = userController;
