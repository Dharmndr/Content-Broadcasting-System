import catchAsync from '../utils/catchAsync.js';
import authService from '../services/auth.service.js';

const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  const token = authService.generateToken(user.id);
  res.status(201).send({ 
    message: 'Registration successful',
    user, 
    token 
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const token = authService.generateToken(user.id);
  res.send({ 
    message: 'Login successful',
    user, 
    token 
  });
});

export default {
  register,
  login,
};
