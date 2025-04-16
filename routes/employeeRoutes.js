import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartmentStats
} from '../controllers/employeeController.js';

const router = express.Router();

// Employee routes
router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/department-stats', getDepartmentStats); // NEW: department-wise stats
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;