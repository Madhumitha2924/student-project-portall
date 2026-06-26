import clsx from 'clsx';

const StatCard = ({ label, value, icon: Icon, color, subLabel, loading }) => {
  const colorMap = {
    primary: {
      gradient: 'from-primary-500 to-primary-600',
      shadow:   'shadow-primary-500/30',
      text:     'text-primary-600 dark:text-primary-400',
      bg:       'bg-primary-50 dark:bg-primary-900/20',
      ring:     'ring-primary-100 dark:ring-primary-900/40',
    },
    amber: {
      gradient: 'from-amber-400 to-orange-500',
      shadow:   'shadow-amber-400/30',
      text:     'text-amber-600 dark:text-amber-400',
      bg:       'bg-amber-50 dark:bg-amber-900/20',
      ring:     'ring-amber-100 dark:ring-amber-900/40',
    },
    blue: {
      gradient: 'from-blue-500 to-indigo-500',
      shadow:   'shadow-blue-500/30',
      text:     'text-blue-600 dark:text-blue-400',
      bg:       'bg-blue-50 dark:bg-blue-900/20',
      ring:     'ring-blue-100 dark:ring-blue-900/40',
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-500',
      shadow:   'shadow-emerald-500/30',
      text:     'text-emerald-600 dark:text-emerald-400',
      bg:       'bg-emerald-50 dark:bg-emerald-900/20',
      ring:     'ring-emerald-100 dark:ring-emerald-900/40',
    },
    red: {
      gradient: 'from-red-500 to-rose-500',
      shadow:   'shadow-red-500/30',
      text:     'text-red-600 dark:text-red-400',
      bg:       'bg-red-50 dark:bg-red-900/20',
      ring:     'ring-red-100 dark:ring-red-900/40',
    },
    violet: {
      gradient: 'from-violet-500 to-purple-600',
      shadow:   'shadow-violet-500/30',
      text:     'text-violet-600 dark:text-violet-400',
      bg:       'bg-violet-50 dark:bg-violet-900/20',
      ring:     'ring-violet-100 dark:ring-violet-900/40',
    },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={clsx(
      'relative overflow-hidden rounded-2xl p-5',
      'bg-white dark:bg-slate-800',
      'border border-slate-100 dark:border-slate-700',
      'shadow-lg shadow-slate-100/80 dark:shadow-slate-900/40',
      'group hover:scale-[1.02] hover:shadow-xl transition-all duration-200 animate-fade-in'
    )}>
      {/* Decorative background circle */}
      <div className={clsx('absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 bg-gradient-to-br', c.gradient)} />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className={clsx(
          'flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br flex-shrink-0',
          'shadow-lg ring-4',
          c.gradient, c.shadow, c.ring
        )}>
          {Icon && <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate mb-1">
            {label}
          </p>
          {loading ? (
            <div className="h-7 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ) : (
            <p className={clsx('text-2xl font-extrabold', c.text)}>
              {value ?? 0}
            </p>
          )}
          {subLabel && !loading && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{subLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
