import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

const auth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Please authenticate');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
});

export default auth;
