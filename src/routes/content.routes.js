import express from 'express';
import { body } from 'express-validator';
import validate from '../middlewares/validation.middleware.js';
import contentController from '../controllers/content.controller.js';
import auth from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// --- Public Routes ---

// Live content for a specific teacher (No auth required)
router.get('/live/:teacherId', contentController.getLiveContent);

// --- Protected Routes ---
router.use(auth);

// --- Teacher Routes ---

router.post(
  '/upload',
  authorize('teacher'),
  upload.single('file'),
  validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
  ]),
  contentController.uploadContent
);

router.get(
  '/my-uploads',
  authorize('teacher'),
  contentController.getMyUploads
);

// --- Principal Routes ---

router.get(
  '/pending',
  authorize('principal'),
  contentController.getPendingContent
);

router.post(
  '/:id/approve',
  authorize('principal'),
  contentController.approveContent
);

router.post(
  '/:id/reject',
  authorize('principal'),
  validate([
    body('rejection_reason').notEmpty().withMessage('Rejection reason is required'),
  ]),
  contentController.rejectContent
);

router.get('/', authorize('principal'), contentController.getAllContent);

export default router;
