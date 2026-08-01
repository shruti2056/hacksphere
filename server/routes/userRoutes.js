import express from 'express';
import { getAllUsers, toggleBlockUser, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('Administrator', 'Organizer'), getAllUsers);
router.put('/:id/block', protect, authorize('Administrator'), toggleBlockUser);
router.put('/:id/role', protect, authorize('Administrator'), updateUserRole);
router.delete('/:id', protect, authorize('Administrator'), deleteUser);

export default router;
