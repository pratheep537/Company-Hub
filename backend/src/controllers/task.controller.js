const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const AuditService = require('../services/audit.service');

const prisma = new PrismaClient();

/**
 * POST /api/tasks
 * Create a new task. orgId and createdById are always from JWT.
 */
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { title, description, priority, deadline, assignedToId } = req.body;
  const orgId = req.user.orgId;
  const createdById = req.user.id;

  try {
    // If assigning, verify the assignee exists AND belongs to the same org
    if (assignedToId) {
      const assignee = await prisma.user.findFirst({
        where: { id: assignedToId, orgId },
      });
      if (!assignee) {
        return res.status(400).json({ error: 'Assigned user not found in your organization' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        deadline: deadline ? new Date(deadline) : null,
        assignedToId: assignedToId || null,
        orgId,
        createdById,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    // Write audit log
    await AuditService.log({
      action: 'CREATED',
      entityType: 'TASK',
      entityId: task.id,
      performedById: createdById,
      orgId,
      taskId: task.id,
      newValue: task,
    });

    return res.status(201).json({ task });
  } catch (err) {
    console.error('[task.createTask]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/tasks
 * Get all tasks for the current organization.
 * ADMIN: sees ALL tasks. MEMBER: sees only tasks they created or are assigned to.
 * Supports ?status, ?priority, ?assignedToId query params.
 */
const getTasks = async (req, res) => {
  const orgId = req.user.orgId;
  const { status, priority, assignedToId } = req.query;

  try {
    // Build where clause
    const where = { orgId };

    // Role-based visibility
    if (req.user.role === 'MEMBER') {
      where.OR = [
        { createdById: req.user.id },
        { assignedToId: req.user.id },
      ];
    }

    // Optional filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error('[task.getTasks]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task by ID. Always validates task belongs to the requesting user's org.
 */
const getTaskById = async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;

  try {
    const task = await prisma.task.findFirst({
      where: { id, orgId }, // orgId enforces tenant isolation
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // MEMBER can only view tasks they created or are assigned to
    if (req.user.role === 'MEMBER') {
      const isMine = task.createdById === req.user.id || task.assignedToId === req.user.id;
      if (!isMine) {
        return res.status(404).json({ error: 'Task not found' });
      }
    }

    return res.status(200).json({ task });
  } catch (err) {
    console.error('[task.getTaskById]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/tasks/:id
 * Update a task. Partial updates allowed.
 * ADMIN: can update any task in the org.
 * MEMBER: can only update tasks they created.
 */
const updateTask = async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;
  const { title, description, status, priority, deadline, assignedToId } = req.body;

  try {
    // Fetch existing task, verifying org membership
    const existingTask = await prisma.task.findFirst({
      where: { id, orgId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // MEMBER can only update their own created tasks
    if (req.user.role === 'MEMBER' && existingTask.createdById !== req.user.id) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // If assigning to someone, verify they belong to the same org
    if (assignedToId !== undefined && assignedToId !== null) {
      const assignee = await prisma.user.findFirst({
        where: { id: assignedToId, orgId },
      });
      if (!assignee) {
        return res.status(400).json({ error: 'Assigned user not found in your organization' });
      }
    }

    // Snapshot old value before update
    const oldSnapshot = {
      title: existingTask.title,
      description: existingTask.description,
      status: existingTask.status,
      priority: existingTask.priority,
      deadline: existingTask.deadline,
      assignedToId: existingTask.assignedToId,
    };

    // Build update data (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId || null;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    const newSnapshot = {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      deadline: updatedTask.deadline,
      assignedToId: updatedTask.assignedToId,
    };

    // Determine action: STATUS_CHANGED if status changed, otherwise UPDATED
    const action = status !== undefined && status !== existingTask.status ? 'STATUS_CHANGED' : 'UPDATED';

    await AuditService.log({
      action,
      entityType: 'TASK',
      entityId: id,
      performedById: req.user.id,
      orgId,
      taskId: id,
      oldValue: oldSnapshot,
      newValue: newSnapshot,
    });

    return res.status(200).json({ task: updatedTask });
  } catch (err) {
    console.error('[task.updateTask]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/tasks/:id
 * ADMIN only. Logs before deleting.
 */
const deleteTask = async (req, res) => {
  const orgId = req.user.orgId;
  const { id } = req.params;

  try {
    // Verify task exists and belongs to this org
    const task = await prisma.task.findFirst({
      where: { id, orgId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Write audit log BEFORE deleting (so taskId reference still exists)
    await AuditService.log({
      action: 'DELETED',
      entityType: 'TASK',
      entityId: id,
      performedById: req.user.id,
      orgId,
      taskId: id,
      oldValue: task,
    });

    // Delete audit logs first to avoid foreign key constraint, then delete the task
    await prisma.auditLog.deleteMany({ where: { taskId: id } });
    await prisma.task.delete({ where: { id } });

    return res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error('[task.deleteTask]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
