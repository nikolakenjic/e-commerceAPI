const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide correct email',
    },
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'Please provide password'],
    minlength: 6,
    maxlength: 30,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

// Hash password
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any errors to the error-handling middleware
  }
});

userSchema.methods.comparePasswords = async function (compPwd) {
  const isMatch = await bcrypt.compare(compPwd, this.password);

  return isMatch;
};

userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;

  return obj;
};

module.exports = mongoose.model('User', userSchema);
