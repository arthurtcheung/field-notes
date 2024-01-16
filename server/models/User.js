const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const saltFactor = Number(process.env.SALT_FACTOR);
// console.log('* Salt factor: ', saltFactor); // CL

// Mongoose Schema constructor
const Schema = mongoose.Schema;

// Create instance of Schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 14,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      validate: {
        validator: function (password) {
          return password.length >= 8; // check if pw meets min length required
        },
        message: 'Password must be at least 8 characters long',
      },
    },
  },
  { timestamps: true }
); // two add'l properties: 1) date created 2) date updated

// Before saving user to db, hash password
UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, saltFactor, (err, hashedPassword) => {
    if (err) {
      console.log(`> Error hashing password: ${err}`); // CL
      return next(err);
    }
    user.password = hashedPassword; // overwrite user password property w/ hashed password
    console.log(`* Password hashed: ${hashedPassword}`); // CL
    return next();
  });
});

module.exports = mongoose.model('User', UserSchema);
