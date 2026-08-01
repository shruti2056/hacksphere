import express from 'express';
import {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  assignJudges,
} from '../controllers/hackathonController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHackathons);
router.get('/:id', getHackathonById);

router.post('/', protect, authorize('Administrator', 'Organizer'), createHackathon);
router.put('/:id', protect, authorize('Administrator', 'Organizer'), updateHackathon);
router.delete('/:id', protect, authorize('Administrator', 'Organizer'), deleteHackathon);
router.put('/:id/assign-judges', protect, authorize('Administrator', 'Organizer'), assignJudges);

export default router;
