const CustomErr = require('../errors');
const { verifyToken } = require('../utils');

const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.signedCookies;

    if (!token) {
      throw new CustomErr.UnauthenticatedError('Authentication Invalid');
    }

    const { name, userId, role } = verifyToken({ token });
    req.user = { name, userId, role };

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError(
        'Do not have permission to this route'
      );
    }
    console.log('admin route');
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
