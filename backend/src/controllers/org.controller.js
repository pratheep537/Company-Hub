const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * POST /api/org/invite
 * ADMIN only. Add a new MEMBER user to the current organization.
 */
const inviteMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, email, password, role } = req.body;
  const orgId = req.user.orgId; // ALWAYS from JWT, never from body

  try {
    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user linked to calling user's org
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'MEMBER',
        orgId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        orgId: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: 'Member invited successfully',
      user: newUser,
    });
  } catch (err) {
    console.error('[org.inviteMember]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/org/members
 * ADMIN only. Get all users in the current organization.
 */
const getMembers = async (req, res) => {
  const orgId = req.user.orgId;

  try {
    const members = await prisma.user.findMany({
      where: { orgId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({ members });
  } catch (err) {
    console.error('[org.getMembers]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/org/me
 * Any authenticated user. Get the current user's organization details.
 */
const getMyOrg = async (req, res) => {
  const orgId = req.user.orgId;

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        _count: {
          select: { users: true, tasks: true },
        },
      },
    });

    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.status(200).json({ organization: org });
  } catch (err) {
    console.error('[org.getMyOrg]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { inviteMember, getMembers, getMyOrg };
