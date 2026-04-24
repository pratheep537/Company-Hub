const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/logs
 * ADMIN only. Get all audit logs for the current organization.
 * Supports ?entityType, ?action, ?limit query params.
 * Returns in descending order (most recent first).
 */
const getLogs = async (req, res) => {
  const orgId = req.user.orgId;
  const { entityType, action, limit } = req.query;

  try {
    const where = { orgId }; // Always filter by org — never trust user input

    if (entityType) where.entityType = entityType;
    if (action) where.action = action;

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        performedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return res.status(200).json({ logs });
  } catch (err) {
    console.error('[log.getLogs]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/logs/task/:taskId
 * ADMIN only. Get all audit logs for a specific task.
 * Verifies the task belongs to the current org before returning logs.
 */
const getTaskLogs = async (req, res) => {
  const orgId = req.user.orgId;
  const { taskId } = req.params;

  try {
    // Verify the task belongs to this org (security check)
    const task = await prisma.task.findFirst({
      where: { id: taskId, orgId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const logs = await prisma.auditLog.findMany({
      where: {
        taskId,
        orgId, // double-enforce org isolation
      },
      include: {
        performedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return res.status(200).json({ logs });
  } catch (err) {
    console.error('[log.getTaskLogs]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getLogs, getTaskLogs };
