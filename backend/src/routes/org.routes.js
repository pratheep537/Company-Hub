const { Router } = require('express');
const { body } = require('express-validator');
const { inviteMember, getMembers, getMyOrg } = require('../controllers/org.controller');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const router = Router();

// All org routes require authentication
router.use(auth);

// POST /api/org/invite — ADMIN only
router.post(
  '/invite',
  requireRole('ADMIN'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  inviteMember
);

// GET /api/org/members — Any authenticated user
router.get('/members', getMembers);

// GET /api/org/me — any authenticated user
router.get('/me', getMyOrg);

module.exports = router;
