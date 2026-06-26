const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Ensure virtual id field is included in JSON
taskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Task = mongoose.model('Task', taskSchema);

const mongoAdapter = {
  findAll: async ({ search, status, sort } = {}) => {
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const tasks = await Task.find(query).sort(sortOrder);
    return tasks.map((t) => t.toJSON());
  },

  findById: async (id) => {
    const task = await Task.findById(id);
    return task ? task.toJSON() : null;
  },

  create: async (data) => {
    const task = await Task.create(data);
    return task.toJSON();
  },

  update: async (id, data) => {
    const task = await Task.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return task ? task.toJSON() : null;
  },

  delete: async (id) => {
    const result = await Task.findByIdAndDelete(id);
    return !!result;
  },

  getStats: async () => {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'pending' }),
      Task.countDocuments({ status: 'in-progress' }),
      Task.countDocuments({ status: 'completed' }),
    ]);
    return { total, pending, inProgress, completed };
  },
};

module.exports = mongoAdapter;
