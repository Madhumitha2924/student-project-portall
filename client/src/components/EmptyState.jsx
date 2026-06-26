import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({ hasFilters, onCreateTask }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-in">
    {/* Icon */}
    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
      <ClipboardList className="w-10 h-10 text-primary-400 dark:text-primary-500" />
    </div>

    {/* Text */}
    <div className="text-center max-w-xs">
      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
        {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
        {hasFilters
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Create your first task to get started managing your mini project.'}
      </p>
    </div>

    {/* CTA */}
    {!hasFilters && (
      <button id="empty-create-task" onClick={onCreateTask} className="btn-primary">
        <Plus className="w-4 h-4" />
        Create First Task
      </button>
    )}
  </div>
);

export default EmptyState;
