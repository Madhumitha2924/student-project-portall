import { BookOpen, GraduationCap, Moon, RefreshCw, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { refreshAll, loading }  = useTasks();

  return (
    <nav className="sticky top-0 z-40 w-full">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                  Student Project Portal
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight hidden sm:block">
                  Mini Project Management System
                </p>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Docs */}
              <a
                href="#"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Docs
              </a>

              {/* Refresh */}
              <button
                id="refresh-btn"
                onClick={() => refreshAll()}
                disabled={loading}
                aria-label="Refresh tasks"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-slate-500 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Dark mode toggle */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200 group"
              >
                {isDark ? (
                  <Sun className="w-[18px] h-[18px] text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Avatar */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold shadow-md cursor-pointer hover:scale-105 transition-transform select-none">
                SP
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
