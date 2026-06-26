const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { taskValidationRules, validate } = require('../middleware/validate');

// Stats route must be before /:id to avoid "stats" being treated as an id
router.get('/stats', getStats);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', taskValidationRules, validate, createTask);
router.put('/:id', taskValidationRules, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
