const getAllOrders = async (req, res, next) => {
  res.send('getAllOrders');
};

const getSingleOrder = async (req, res, next) => {
  res.send('getSingleOrder');
};

const getCurrentUserOrders = async (req, res, next) => {
  res.send('getCurrentUserOrders');
};

const createOrder = async (req, res, next) => {
  res.send('createOrder');
};

const updateOrder = async (req, res, next) => {
  res.send('updateOrder');
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
