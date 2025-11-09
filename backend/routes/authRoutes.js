import express from 'express';
import { register, login, getMe, requestPasswordReset, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/request-password-reset', requestPasswordReset);
router.post('/change-password', protect, changePassword);

export default router;
