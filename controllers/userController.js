const User = require('./../models/userModel');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('./../errors');

const getAllUsers = async (req, res, next) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' });

  res.status(StatusCodes.OK).json({ message: 'Success', users });
};

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    res.status(StatusCodes.OK).json({ message: 'Success', user });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const showCurrentUser = async (req, res, next) => {
  res.status(StatusCodes.OK).json({ message: 'Success', user: req.user });
};

const updateUser = async (req, res, next) => {
  res.send('updateUser');
};

const updateUserPassword = async (req, res, next) => {
  res.send('updateUserPassword');
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
};
