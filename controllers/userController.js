const User = require('./../models/userModel');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require('./../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

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
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      throw new BadRequestError('Please provide all values');
    }
    const user = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      { email, name },
      { new: true, runValidators: true }
    );

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ message: 'Success', user: tokenUser });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// // Update with user.save()
// const updateUser = async (req, res, next) => {
//   try {
//     const { email, name } = req.body;
//     if (!email || !name) {
//       throw new BadRequestError('Please provide all values');
//     }
//     const user = await User.findOne({ _id: req.user.userId });

//     user.email = email;
//     user.name = name;
//     await user.save();

//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ message: 'Success', user: tokenUser });
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// };

const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new BadRequestError('Please provide both passwords');
    }

    const user = await User.findById(req.user.userId);

    const isPasswordCorrect = await user.comparePasswords(oldPassword);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Wrong old password');
    }

    user.password = newPassword;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: 'Successfully update password' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
};
