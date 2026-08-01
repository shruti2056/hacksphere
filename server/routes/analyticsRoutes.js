import express from 'express';
import {
  getAdminStats,
  getOrganizerStats,
  getLeaderboard,
  getPublicGallery,
  getActivityLogs,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/gallery', getPublicGallery);
router.get('/leaderboard/:hackathonId', getLeaderboard);
router.get('/admin', protect, authorize('Administrator'), getAdminStats);
router.get('/organizer', protect, authorize('Organizer', 'Administrator'), getOrganizerStats);
router.get('/logs', protect, authorize('Administrator'), getActivityLogs);

export default router;
