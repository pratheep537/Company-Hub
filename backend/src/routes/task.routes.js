const { Router } = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const tenantIsolation = require('../middleware/tenant');

const router = Router();

// All task routes require authentication
router.use(auth);

// POST /api/tasks — any authenticated user
router.post(
  '/',
  [body('title').notEmpty().withMessage('Title is required')],
  createTask
);

// GET /api/tasks — any authenticated user (role-filtered in controller)
router.get('/', getTasks);

// GET /api/tasks/:id — any authenticated user (role-filtered in controller)
router.get('/:id', tenantIsolation, getTaskById);

// PATCH /api/tasks/:id — any authenticated user (MEMBER limited to own tasks)
router.patch('/:id', tenantIsolation, updateTask);

// DELETE /api/tasks/:id — ADMIN only
router.delete('/:id', requireRole('ADMIN'), tenantIsolation, deleteTask);

module.exports = router;
