const Order = require('./../models/orderModel');
const Product = require('./../models/productModel.js');
const CustomError = require('./../errors');
const { StatusCodes } = require('http-status-codes');
const checkPermissions = require('../utils/checkPermissions.js');

const fakeStripeAPI = async ({ amount }) => {
  const client_secret = 'someRandomValue';

  return { client_secret, amount };
};

const getAllOrders = async (req, res, next) => {
  const orders = await Order.find();

  res
    .status(StatusCodes.OK)
    .json({ message: 'Success', orders, count: orders.length });
};

const getSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      throw new CustomError.NotFoundError(`No order with id: ${id}`);
    }

    checkPermissions(req.user, order.user);

    res.status(StatusCodes.OK).json({ order });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getCurrentUserOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res, next) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
      throw new CustomError.BadRequestError('No cart items Provided');
    }

    if (!tax || !shippingFee) {
      throw new CustomError.BadRequestError(
        'Please provide tax and shipping fee'
      );
    }

    let orderItems = [];
    let subtotal = 0;

    // // When we have async operation inside loop we we create for of loop, we dont be able to do that with for each or map
    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });

      if (!dbProduct) {
        throw new CustomError.NotFoundError(
          `No product with id: ${item.product}`
        );
      }
      const { name, price, image, _id } = dbProduct;

      const singleOrderItem = {
        amount: item.amount,
        name,
        price,
        image,
        product: _id,
      };
      //   Add items to order
      orderItems = [...orderItems, singleOrderItem];
      //   calculate subtotal
      subtotal += item.amount * price;
    }
    //    Calculate total
    const total = tax + shippingFee + subtotal;

    // Get client secret
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: 'USD',
    });

    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.client_secret,
      user: req.user.userId,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'success', order, clientSecret: order.clientSecret });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      throw new CustomError.NotFoundError(`No order with id: ${id}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
