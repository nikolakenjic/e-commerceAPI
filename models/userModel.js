const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = mongoose.model('User', userSchema);
