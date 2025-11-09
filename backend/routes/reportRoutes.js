import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  assignReport,
  getNearbyReports,
} from '../controllers/reportController.js';
import { protect, admin, adminOrWorker } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/', protect, getReports);
router.get('/nearby', protect, getNearbyReports);
router.get('/:id', protect, getReportById);
router.post('/', protect, createReport);
router.put('/:id/status', protect, adminOrWorker, updateReportStatus);
router.put('/:id/assign', protect, admin, assignReport);

export default router;
