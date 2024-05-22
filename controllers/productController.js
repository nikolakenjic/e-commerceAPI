const createProduct = async (req, res, next) => {
  res.send('createProduct');
};
const getAllProducts = async (req, res, next) => {
  res.send('getAllProducts');
};
const getSingleProduct = async (req, res, next) => {
  res.send('getSingleProduct');
};
const updateProduct = async (req, res, next) => {
  res.send('updateProduct');
};
const deleteProduct = async (req, res, next) => {
  res.send('deleteProduct');
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
