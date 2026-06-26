const { getAdapter } = require('../db');
const { AppError } = require('../middleware/errorHandler');

// GET /api/tasks
const getAllTasks = async (req, res, next) => {
  try {
    const { search = '', status = 'all', priority = 'all', sort = 'newest' } = req.query;
    const db = getAdapter();
    const tasks = await db.findAll({ search, status, priority, sort });
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    const db = getAdapter();
    const stats = await db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const db = getAdapter();
    const task = await db.findById(req.params.id);
    if (!task) throw new AppError('Task not found', 404);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const db = getAdapter();
    const task = await db.create({ title, description, status, priority, dueDate });
    res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const db = getAdapter();
    const task = await db.update(req.params.id, { title, description, status, priority, dueDate });
    if (!task) throw new AppError('Task not found', 404);
    res.json({ success: true, data: task, message: 'Task updated successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const db = getAdapter();
    const deleted = await db.delete(req.params.id);
    if (!deleted) throw new AppError('Task not found', 404);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTasks, getStats, getTaskById, createTask, updateTask, deleteTask };
