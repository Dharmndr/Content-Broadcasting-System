import ApiError from '../utils/ApiError.js';

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: You do not have the required role'));
    }

    next();
  };
};

export default authorize;
