import { ArrowDownUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const STATUS_FILTERS = [
  { value: 'all',         label: 'All' },
  { value: 'pending',     label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'due-date', label: 'Due Date' },
  { value: 'priority', label: 'By Priority' },
];

const PRIORITY_FILTERS = [
  { value: 'all',    label: 'All Priority' },
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '⚪ Low' },
];

const FilterBar = ({ status, priority, sort, onStatusChange, onPriorityChange, onSortChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status pill filters */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            id={`filter-${f.value}`}
            onClick={() => onStatusChange(f.value)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap',
              status === f.value
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Priority filter dropdown */}
      <div className="relative">
        <select
          id="priority-filter"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="input-field py-2 pr-7 text-xs font-semibold appearance-none cursor-pointer min-w-[120px]"
        >
          {PRIORITY_FILTERS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field pl-8 pr-7 py-2 text-xs font-semibold appearance-none cursor-pointer min-w-[140px]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default FilterBar;
