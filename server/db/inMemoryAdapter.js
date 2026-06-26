const { v4: uuidv4 } = require('uuid');

// In-memory store for tasks
let tasks = [
  {
    id: uuidv4(),
    title: 'Build Authentication Module',
    description: 'Implement JWT-based login and registration for the student portal using bcrypt and JWT tokens.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Design Database Schema',
    description: 'Create ER diagram and define tables for students, projects, and tasks with proper normalization.',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Develop REST API Endpoints',
    description: 'Build CRUD endpoints for task management using Express.js, Mongoose, and express-validator.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Create React Dashboard UI',
    description: 'Build the frontend dashboard with statistics, search, filter, and sort capabilities using Tailwind CSS.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Write Unit Tests',
    description: 'Write Jest unit tests for all API controllers and React components to ensure code quality.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Deploy to Production',
    description: 'Deploy backend to Render and frontend to Vercel with CI/CD pipeline and environment variables.',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Setup Project Documentation',
    description: 'Write comprehensive README, API docs using Swagger, and user guide for the project.',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Code Review & Refactoring',
    description: 'Conduct peer code review, refactor duplicated logic, improve code readability and maintainability.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // overdue
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const inMemoryAdapter = {
  findAll: async ({ search, status, priority, sort } = {}) => {
    let result = [...tasks];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      result = result.filter((t) => t.status === status);
    }

    if (priority && priority !== 'all') {
      result = result.filter((t) => t.priority === priority);
    }

    if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'due-date') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sort === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  },

  findById: async (id) => tasks.find((t) => t.id === id) || null,

  create: async (data) => {
    const now = new Date().toISOString();
    const task = {
      id: uuidv4(),
      title: data.title,
      description: data.description || '',
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);
    return task;
  },

  update: async (id, data) => {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = {
      ...tasks[idx],
      ...data,
      id: tasks[idx].id,
      createdAt: tasks[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    return tasks[idx];
  },

  delete: async (id) => {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    return true;
  },

  getStats: async () => {
    const total     = tasks.length;
    const pending   = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue   = tasks.filter((t) => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

    return { total, pending, inProgress, completed, overdue, highPriority };
  },
};

module.exports = inMemoryAdapter;
