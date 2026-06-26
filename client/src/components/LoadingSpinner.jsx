const LoadingSpinner = ({ message = 'Loading tasks…' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
    {/* Animated dots */}
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full bg-primary-500 animate-bounce-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
