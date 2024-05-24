const createReview = async (req, res, next) => {
  res.send('createReview');
};

const getAllReviews = async (req, res, next) => {
  res.send('getAllReviews');
};

const getSingleReview = async (req, res, next) => {
  res.send('getSingleReview');
};

const updateReview = async (req, res, next) => {
  res.send('updateReview');
};

const deleteReview = async (req, res, next) => {
  res.send('deleteReview');
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
