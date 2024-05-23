const Product = require('./../models/productModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({ message: 'Success', product });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      throw new CustomError.NotFoundError('Not found products');
    }

    res.status(StatusCodes.OK).json({ message: 'Success', products });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new CustomError.NotFoundError('Not found products');
    }

    res.status(StatusCodes.OK).json({ message: 'Success', product });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new CustomError.NotFoundError('Not found products');
    }

    res.status(StatusCodes.OK).json({ message: 'Success', product });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new CustomError.NotFoundError('Not found products');
    }

    res.status(StatusCodes.OK).json({ message: 'Successfully deleted' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  res.send('uploadImage');
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
