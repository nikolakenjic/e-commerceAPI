const Review = require('./../models/reviewModel');
const Product = require('./../models/productModel');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require('./../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const createReview = async (req, res, next) => {
  try {
    const { product: productId } = req.body;

    const isValidProduct = await Product.findById(productId);

    if (!isValidProduct) {
      throw new NotFoundError(`No product with id: ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({
      product: productId,
      user: req.user.userId,
    });

    if (alreadySubmitted) {
      throw new BadRequestError('Already submitted review for this product');
    }

    req.body.user = req.user.userId;

    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ message: 'Success', review });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    res.status(StatusCodes.OK).json({ message: 'Success', reviews });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getSingleReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new NotFoundError('Review Not Found');
    }

    res.status(StatusCodes.OK).json({ message: 'Success', review });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const review = await Review.findOne({ _id: req.params.id });

    if (!review) {
      throw new NotFoundError('Review Not Found');
    }

    checkPermissions(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({ message: 'Successfully update', review });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id });

    if (!review) {
      throw new NotFoundError('Review Not Found');
    }

    checkPermissions(req.user, review.user);

    await review.remove();
    res.status(StatusCodes.OK).json({ message: 'Successfully delete' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
