const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Centralized Audit Logging Service
 *
 * Writes a single row to the AuditLog table.
 * This function will NEVER throw — if logging fails, it logs to console
 * but does NOT fail the main request.
 *
 * Usage:
 *   await AuditService.log({
 *     action: 'UPDATED',
 *     entityType: 'TASK',
 *     entityId: task.id,
 *     performedById: req.user.id,
 *     orgId: req.user.orgId,
 *     taskId: task.id,       // optional
 *     oldValue: oldSnapshot, // optional
 *     newValue: newSnapshot, // optional
 *   });
 */
const AuditService = {
  log: async ({ action, entityType, entityId, performedById, orgId, taskId, oldValue, newValue }) => {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          performedById,
          orgId,
          taskId: taskId || null,
          oldValue: oldValue || null,
          newValue: newValue || null,
        },
      });
    } catch (err) {
      console.error('[AuditService] Failed to write audit log:', err.message);
      // Do not rethrow — audit failures must not break the main request
    }
  },
};

module.exports = AuditService;
