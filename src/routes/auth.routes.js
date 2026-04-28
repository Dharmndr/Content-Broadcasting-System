import express from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validation.middleware.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

const registerValidation = [
  body('name').isString().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['principal', 'teacher']).withMessage('Invalid role. Must be principal or teacher'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);

export default router;
