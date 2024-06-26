const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
} = require('./../controllers/userController');
const {
  authenticateUser,
  authorizePermissions,
} = require('./../middleware/authentication');

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers);

router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').post(authenticateUser, updateUser);
router.route('/updateUserPassword').post(authenticateUser, updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
