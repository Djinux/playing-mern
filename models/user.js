const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Task } = require('./task');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      minLength: [3, 'Username has to be at least 8 characters long.'],
      maxLength: [50, 'Username cannot be longer than 50 characters.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minLength: [8, 'Password has to be at least 8 characters long.'],
      maxLength: [50, 'Password cannot be longer than 50 characters.'],
      validate: {
        validator: function (value) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
          return passwordRegex.test(value);
        }
      }
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
          return emailRegex.test(value);
        }
      }
    }
  },
  { timestamps: true }
);

/* use 'pre hook' to hash user password before it gets saved in database  
    -> before it gets saved in database -> use bcrypt to hash the password
    -> 'pre' is mongoose middleware
    -> 'save' is event
    -> because event is save which gets called when new user is created or existing user is updated, mongoose 
        knows 'this' is the current document I am working with
*/

userSchema.pre('remove', async function (next) {
  try {
    await Task.deleteMany({ userId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports.User = userModel;
