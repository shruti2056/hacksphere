import express from 'express';
import {
  submitReview,
  getJudgeAssignedSubmissions,
  getSubmissionReviews,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/assigned', protect, authorize('Judge', 'Administrator'), getJudgeAssignedSubmissions);
router.get('/submission/:submissionId', getSubmissionReviews);
router.post('/', protect, authorize('Judge', 'Administrator'), submitReview);

export default router;
