import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const register = async (userData) => {
  if (await User.findOne({ where: { email: userData.email } })) {
    throw new ApiError(400, 'User already exists');
  }
  
  // userData should contain name, email, password_hash, role
  return User.create({
    name: userData.name,
    email: userData.email,
    password_hash: userData.password, // Hook will hash it
    role: userData.role
  });
};

const login = async (email, password) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  return user;
};

export default {
  generateToken,
  register,
  login,
};
