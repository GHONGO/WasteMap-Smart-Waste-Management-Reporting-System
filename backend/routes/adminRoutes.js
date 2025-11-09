import express from 'express';
import {
  getDashboardStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getTeams,
  createTeam,
  updateTeam,
  optimizeRoutes,
  getPasswordResetRequests,
  resetUserPassword,
} from '../controllers/adminController.js';
import { protect, admin, superadmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/teams', getTeams);
router.post('/teams', createTeam);
router.put('/teams/:id', updateTeam);
router.get('/optimize-routes', optimizeRoutes);

// Password reset routes (superadmin only)
router.get('/password-reset-requests', superadmin, getPasswordResetRequests);
router.post('/reset-password/:userId', superadmin, resetUserPassword);

export default router;
