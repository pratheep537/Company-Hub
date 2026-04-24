const { Router } = require('express');
const { getLogs, getTaskLogs } = require('../controllers/log.controller');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = Router();

// All log routes require authentication and ADMIN role
router.use(auth);
router.use(requireRole('ADMIN'));

// GET /api/logs — get all audit logs for the org
router.get('/', getLogs);

// GET /api/logs/task/:taskId — get logs for a specific task
router.get('/task/:taskId', getTaskLogs);

module.exports = router;
