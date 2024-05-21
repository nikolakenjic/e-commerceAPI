const User = require('./../models/userModel');
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse, createTokenUser } = require('./../utils');
const { BadRequestError, UnauthenticatedError } = require('./../errors');

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
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({
      message: 'Success',
      user: tokenUser,
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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Please provide correct email and password');
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError('Can not find this user');
    }

    // Compare Password
    const isPasswordCorrect = await user.comparePasswords(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Password are not correct');
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({
      message: 'Success',
      user: tokenUser,
    });
  } catch (err) {
    console.error(err);
    next(err); // Pass the error to the Express error handler
  }
};

const logout = async (req, res, next) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

module.exports = { register, login, logout };
