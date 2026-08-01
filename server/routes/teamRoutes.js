import express from 'express';
import {
  createTeam,
  joinTeamByCode,
  getTeamById,
  getHackathonTeams,
  getUserTeams,
  transferLeadership,
  removeMember,
  approveRejectTeam,
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-teams', protect, getUserTeams);
router.get('/hackathon/:hackathonId', getHackathonTeams);
router.get('/:id', getTeamById);

router.post('/', protect, authorize('Participant', 'Administrator'), createTeam);
router.post('/join', protect, authorize('Participant', 'Administrator'), joinTeamByCode);
router.put('/:id/transfer', protect, transferLeadership);
router.put('/:id/remove-member', protect, removeMember);
router.put('/:id/status', protect, authorize('Organizer', 'Administrator'), approveRejectTeam);

export default router;
