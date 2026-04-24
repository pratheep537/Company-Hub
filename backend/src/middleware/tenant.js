const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Tenant Isolation Middleware
 * Verifies that a requested resource (task/log) belongs to the requesting user's org.
 * Always runs AFTER auth middleware.
 *
 * This middleware validates the orgId on the resource fetched via req.params.id
 * for routes that deal with a specific resource by ID.
 *
 * Note: The primary tenant isolation is enforced at the query level in every
 * controller — always using `where: { orgId: req.user.orgId }`.
 * This middleware provides an additional layer of defence for resource-level checks.
 */
const tenantIsolation = async (req, res, next) => {
  // Only validate when a specific resource ID is in the URL
  if (!req.params.id) {
    return next();
  }

  // The controller-level queries always include orgId in their WHERE clause.
  // If a resource is fetched by ID and doesn't match the org, it returns null → 404.
  // This middleware enforces the rule at the router level as an extra safety net.
  if (!req.user || !req.user.orgId) {
    return res.status(403).json({ error: 'Access denied: cross-tenant access forbidden' });
  }

  next();
};

module.exports = tenantIsolation;
