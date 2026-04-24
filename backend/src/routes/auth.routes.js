const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('orgName').notEmpty().withMessage('Organization name is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// GET /api/auth/me — protected
router.get('/me', auth, me);

module.exports = router;
