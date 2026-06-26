import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Circle, Edit2, Flag, Timer, Trash2, Zap } from 'lucide-react';
import clsx from 'clsx';
import { useTasks } from '../context/TaskContext';

const STATUS_CONFIG = {
  pending:     { badge: 'badge-pending',     icon: Circle,       label: 'Pending',     border: 'border-l-amber-400',  next: 'in-progress' },
  'in-progress': { badge: 'badge-in-progress', icon: Timer,        label: 'In Progress', border: 'border-l-blue-500',   next: 'completed'   },
  completed:   { badge: 'badge-completed',   icon: CheckCircle2, label: 'Completed',   border: 'border-l-emerald-500', next: null          },
};

const PRIORITY_CONFIG = {
  high:   { badge: 'badge-high',   label: 'HIGH',   icon: 'text-red-500'   },
  medium: { badge: 'badge-medium', label: 'MED',    icon: 'text-amber-500' },
  low:    { badge: 'badge-low',    label: 'LOW',    icon: 'text-slate-400' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

const isDueSoon = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const diff = new Date(dueDate) - new Date();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { quickStatusUpdate } = useTasks();
  const cfg  = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const pcfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const StatusIcon = cfg.icon;
  const overdue  = isOverdue(task.dueDate, task.status);
  const dueSoon  = isDueSoon(task.dueDate, task.status);

  const handleQuickStatus = async (e) => {
    e.stopPropagation();
    if (!cfg.next) return;
    await quickStatusUpdate(task.id, cfg.next);
  };

  return (
    <div className={clsx(
      'relative bg-white dark:bg-slate-800 rounded-2xl p-5 flex flex-col gap-3',
      'border border-slate-100 dark:border-slate-700 border-l-4',
      'shadow-lg shadow-slate-100/80 dark:shadow-slate-900/30',
      'group hover:shadow-xl hover:-translate-y-1 transition-all duration-200 animate-slide-up',
      cfg.border
    )}>
      {/* Overdue ribbon */}
      {overdue && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5" /> OVERDUE
        </div>
      )}
      {dueSoon && !overdue && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" /> DUE SOON
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mt-1">
        <h3 className={clsx(
          'font-semibold text-sm leading-snug line-clamp-2 flex-1',
          task.status === 'completed'
            ? 'line-through text-slate-400 dark:text-slate-500'
            : 'text-slate-800 dark:text-slate-100'
        )}>
          {task.title}
        </h3>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
          {cfg.next && (
            <button
              id={`quick-status-${task.id}`}
              onClick={handleQuickStatus}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              title={`Mark as ${cfg.next}`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            id={`edit-task-${task.id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`delete-task-${task.id}`}
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Priority + Status row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={clsx(pcfg.badge, 'flex items-center gap-1')}>
          <Flag className="w-2.5 h-2.5" />
          {pcfg.label}
        </span>
        <span className={cfg.badge}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      {/* Due date footer */}
      {task.dueDate && (
        <div className={clsx(
          'flex items-center gap-1.5 text-[11px] font-medium pt-2 border-t',
          'border-slate-100 dark:border-slate-700',
          overdue  ? 'text-red-500 dark:text-red-400' :
          dueSoon  ? 'text-amber-500 dark:text-amber-400' :
          task.status === 'completed' ? 'text-emerald-500 dark:text-emerald-400' :
          'text-slate-400 dark:text-slate-500'
        )}>
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>
            {task.status === 'completed' ? 'Done · ' : overdue ? 'Overdue · ' : 'Due '}
            {formatDate(task.dueDate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
