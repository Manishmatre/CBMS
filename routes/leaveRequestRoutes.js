import express from 'express';
import { createLeaveRequest, getLeaveRequests, updateLeaveRequestStatus, getHRStats } from '../controllers/leaveRequestController.js';

const router = express.Router();

router.post('/create', createLeaveRequest);
router.get('/all', getLeaveRequests);
router.put('/:id/status', updateLeaveRequestStatus);
router.get('/hr-stats', getHRStats);

export default router;
