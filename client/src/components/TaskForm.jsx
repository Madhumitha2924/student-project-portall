import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Circle, FileText, Flag, Loader2, Tag, Timer, X } from 'lucide-react';
import clsx from 'clsx';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending',     icon: Circle,       color: 'text-amber-500' },
  { value: 'in-progress', label: 'In Progress', icon: Timer,        color: 'text-blue-500' },
  { value: 'completed',   label: 'Completed',   icon: CheckCircle2, color: 'text-emerald-500' },
];

const PRIORITY_OPTIONS = [
  { value: 'high',   label: 'High',   color: 'text-red-500',   dot: 'bg-red-500'   },
  { value: 'medium', label: 'Medium', color: 'text-amber-500', dot: 'bg-amber-500' },
  { value: 'low',    label: 'Low',    color: 'text-slate-400', dot: 'bg-slate-400' },
];

const INITIAL = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' };

const validate = (data) => {
  const errors = {};
  if (!data.title.trim())            errors.title = 'Title is required';
  else if (data.title.trim().length > 200) errors.title = 'Title must be at most 200 characters';
  if (data.description.length > 1000)     errors.description = 'Description must be at most 1000 characters';
  if (data.dueDate) {
    const d = new Date(data.dueDate);
    if (isNaN(d.getTime())) errors.dueDate = 'Please enter a valid date';
  }
  return errors;
};

const TaskForm = ({ isOpen, onClose, editTask }) => {
  const { createTask, updateTask } = useTasks();
  const [form, setForm]         = useState(INITIAL);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!editTask;

  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        setForm({
          title:       editTask.title || '',
          description: editTask.description || '',
          status:      editTask.status || 'pending',
          priority:    editTask.priority || 'medium',
          dueDate:     editTask.dueDate ? editTask.dueDate.slice(0, 10) : '',
        });
      } else {
        setForm(INITIAL);
      }
      setErrors({});
    }
  }, [isOpen, editTask]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      };
      if (isEdit) await updateTask(editTask.id, payload);
      else        await createTask(payload);
      onClose();
    } catch (err) {
      if (err.errors?.length) {
        const serverErrors = {};
        err.errors.forEach(({ field, message }) => { serverErrors[field] = message; });
        setErrors(serverErrors);
      } else {
        toast.error(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEdit ? 'Update the task details below' : 'Fill in the details to add a new task'}
            </p>
          </div>
          <button id="task-form-close" onClick={onClose} className="btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form id="task-form" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Title */}
          <div>
            <label htmlFor="task-title" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-500" />
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Design login page UI"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              maxLength={200}
              className={clsx('input-field', errors.title && 'border-red-400 dark:border-red-500 focus:ring-red-400')}
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
            <p className="mt-1 text-[11px] text-slate-400 text-right">{form.title.length}/200</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-description" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-primary-500" />
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="task-description"
              placeholder="Add more context about this task…"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={1000}
              className={clsx('input-field resize-none', errors.description && 'border-red-400 dark:border-red-500 focus:ring-red-400')}
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
            <p className="mt-1 text-[11px] text-slate-400 text-right">{form.description.length}/1000</p>
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <Flag className="w-3.5 h-3.5 text-primary-500" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map(({ value, label, color, dot }) => (
                <button
                  key={value}
                  type="button"
                  id={`priority-${value}`}
                  onClick={() => handleChange('priority', value)}
                  className={clsx(
                    'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all duration-150',
                    form.priority === value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800/50'
                  )}
                >
                  <span className={clsx('w-2 h-2 rounded-full', dot)} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  id={`status-${value}`}
                  onClick={() => handleChange('status', value)}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all duration-150',
                    form.status === value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800/50'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', form.status === value ? 'text-primary-500' : color)} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="task-due-date" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              Due Date <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={clsx('input-field', errors.dueDate && 'border-red-400 dark:border-red-500 focus:ring-red-400')}
            />
            {errors.dueDate && <p className="mt-1.5 text-xs text-red-500">{errors.dueDate}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700 mt-1">
            <button type="button" id="task-form-cancel" onClick={onClose} disabled={submitting} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" id="task-form-submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{isEdit ? 'Updating…' : 'Creating…'}</>
              ) : (
                isEdit ? '✏️ Update Task' : '✅ Create Task'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskForm;
