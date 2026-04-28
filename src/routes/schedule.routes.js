import express from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validation.middleware.js';
import scheduleController from '../controllers/schedule.controller.js';
import auth from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = express.Router();

// Public/Common route to get active content
router.get('/active', scheduleController.getActiveContent);

// Principal route to manage schedules
router.post(
  '/:contentId',
  auth,
  authorize('principal'),
  validate([
    body('rotation_order').isInt({ min: 0 }).withMessage('Rotation order must be a positive integer'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
    body('start_time').optional().isISO8601().toDate().withMessage('Invalid start time'),
    body('end_time').optional().isISO8601().toDate().withMessage('Invalid end time'),
  ]),
  scheduleController.upsertSchedule
);

export default router;
