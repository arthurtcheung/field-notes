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
      min: 4,
      max: 14,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 8,
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
