const User = require('./../models/userModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('./../errors');

const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    // Check for duplicate email
    const emailAlreadyExist = await User.findOne({ email });
    if (emailAlreadyExist) {
      throw new Error('Email already exists');
    }

    // Check if user is first
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // Create new User
    const user = await User.create({ email, name, password, role });

    res.status(StatusCodes.CREATED).json({
      message: 'Success',
      user,
    });
  } catch (err) {
    if (err.message === 'Email already exists') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message,
      });
    }
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
};

const login = async (req, res, next) => {
  res.send('login user');
};

const logout = async (req, res, next) => {
  res.send('logout user');
};

module.exports = { register, login, logout };
