import express from 'express';
import {
  createOrUpdateSubmission,
  getMySubmission,
  getSubmissionsForHackathon,
  getSubmission,
  updateSubmission,
} from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('Participant', 'Administrator'), createOrUpdateSubmission);
router.get('/my/:hackathonId', protect, getMySubmission);
router.get('/hackathon/:hackathonId', protect, authorize('Organizer', 'Administrator', 'Judge'), getSubmissionsForHackathon);
router.get('/:id', protect, getSubmission);
router.put('/:id', protect, updateSubmission);

export default router;
