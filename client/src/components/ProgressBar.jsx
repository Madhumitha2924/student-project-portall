import clsx from 'clsx';

const ProgressBar = ({ stats }) => {
  const { total, pending, inProgress, completed } = stats;
  if (!total) return null;

  const pctPending    = Math.round((pending / total) * 100);
  const pctInProgress = Math.round((inProgress / total) * 100);
  const pctCompleted  = Math.round((completed / total) * 100);
  const completionPct = pctCompleted;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-100/80 dark:shadow-slate-900/30 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Project Progress</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Overall task completion</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completionPct}%</span>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">completed</p>
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
        {pctCompleted > 0 && (
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pctCompleted}%` }}
          />
        )}
        {pctInProgress > 0 && (
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pctInProgress}%` }}
          />
        )}
        {pctPending > 0 && (
          <div
            className="bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pctPending}%` }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] font-medium">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {completed} done
        </span>
        <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          {inProgress} active
        </span>
        <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          {pending} pending
        </span>
        <span className="text-slate-400 dark:text-slate-500">{total} total</span>
      </div>
    </div>
  );
};

export default ProgressBar;
