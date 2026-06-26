const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: true, len: [1, 200] },
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        defaultValue: 'pending',
      },
    },
    { tableName: 'tasks', timestamps: true }
  );

  const toJSON = (task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  });

  const { Op } = require('sequelize');

  return {
    sync: () => Task.sync({ alter: true }),

    findAll: async ({ search, status, sort } = {}) => {
      const where = {};
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }
      if (status && status !== 'all') {
        where.status = status;
      }
      const order = [['createdAt', sort === 'oldest' ? 'ASC' : 'DESC']];
      const tasks = await Task.findAll({ where, order });
      return tasks.map(toJSON);
    },

    findById: async (id) => {
      const task = await Task.findByPk(id);
      return task ? toJSON(task) : null;
    },

    create: async (data) => {
      const task = await Task.create(data);
      return toJSON(task);
    },

    update: async (id, data) => {
      const task = await Task.findByPk(id);
      if (!task) return null;
      await task.update(data);
      return toJSON(task);
    },

    delete: async (id) => {
      const rows = await Task.destroy({ where: { id } });
      return rows > 0;
    },

    getStats: async () => {
      const [total, pending, inProgress, completed] = await Promise.all([
        Task.count(),
        Task.count({ where: { status: 'pending' } }),
        Task.count({ where: { status: 'in-progress' } }),
        Task.count({ where: { status: 'completed' } }),
      ]);
      return { total, pending, inProgress, completed };
    },
  };
};
