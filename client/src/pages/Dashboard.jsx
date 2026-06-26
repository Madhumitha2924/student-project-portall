import { useEffect, useState } from 'react';
import {
  AlertCircle, CheckCircle2, Circle,
  ClipboardList, Flag, Plus, Timer
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useDebounce } from '../hooks/useDebounce';
import StatCard    from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import SearchBar   from '../components/SearchBar';
import FilterBar   from '../components/FilterBar';
import TaskCard    from '../components/TaskCard';
import TaskForm    from '../components/TaskForm';
import ConfirmModal   from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState     from '../components/EmptyState';

const Dashboard = () => {
  const { tasks, stats, loading, filters, updateFilters, deleteTask } = useTasks();

  const [searchInput, setSearchInput]   = useState('');
  const [formOpen, setFormOpen]         = useState(false);
  const [editTask, setEditTask]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);
  useEffect(() => { updateFilters({ search: debouncedSearch }); }, [debouncedSearch]);

  const openCreate = () => { setEditTask(null); setFormOpen(true); };
  const openEdit   = (task) => { setEditTask(task); setFormOpen(true); };
  const closeForm  = () => { setFormOpen(false); setEditTask(null); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteTask(deleteTarget.id); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const hasFilters = !!(filters.search || filters.status !== 'all' || filters.priority !== 'all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Project Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and manage all your mini project tasks
          </p>
        </div>
        <button id="create-task-btn" onClick={openCreate} className="btn-primary self-start sm:self-auto shadow-lg">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={ClipboardList}
          color="primary"
          loading={loading && tasks.length === 0}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Circle}
          color="amber"
          loading={loading && tasks.length === 0}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={Timer}
          color="blue"
          loading={loading && tasks.length === 0}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          loading={loading && tasks.length === 0}
        />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Progress bar spans 2 cols */}
        <div className="sm:col-span-2">
          <ProgressBar stats={stats} />
        </div>
        {/* Alert stats */}
        <div className="flex flex-col gap-3">
          <StatCard
            label="Overdue"
            value={stats.overdue ?? 0}
            icon={AlertCircle}
            color="red"
            subLabel="tasks past due date"
            loading={loading && tasks.length === 0}
          />
          <StatCard
            label="High Priority"
            value={stats.highPriority ?? 0}
            icon={Flag}
            color="violet"
            subLabel="unfinished high priority"
            loading={loading && tasks.length === 0}
          />
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-5 border border-slate-100 dark:border-slate-700 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <div className="flex-1 min-w-0" />
          <FilterBar
            status={filters.status}
            priority={filters.priority}
            sort={filters.sort}
            onStatusChange={(s)   => updateFilters({ status: s })}
            onPriorityChange={(p) => updateFilters({ priority: p })}
            onSortChange={(s)     => updateFilters({ sort: s })}
          />
        </div>
      </div>

      {/* Results info */}
      {!loading && tasks.length > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 px-1">
          Showing <span className="font-semibold text-slate-600 dark:text-slate-300">{tasks.length}</span> task{tasks.length !== 1 ? 's' : ''}
          {filters.status !== 'all' && <> · <span className="capitalize font-medium">{filters.status}</span></>}
          {filters.priority !== 'all' && <> · <span className="capitalize font-medium">{filters.priority}</span> priority</>}
          {filters.search && <> · matching "<span className="font-medium">{filters.search}</span>"</>}
        </p>
      )}

      {/* Task Grid */}
      {loading && tasks.length === 0 ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onCreateTask={openCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Refresh overlay pill */}
      {loading && tasks.length > 0 && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-lg animate-fade-in z-30">
          <span className="w-3 h-3 border-2 border-primary-500/40 border-t-primary-500 rounded-full animate-spin" />
          Refreshing…
        </div>
      )}

      {/* Mobile FAB */}
      <button
        id="mobile-fab"
        onClick={openCreate}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:hidden flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 active:scale-95 transition-all duration-200 z-30"
      >
        <Plus className="w-4 h-4" />
        New Task
      </button>

      {/* Modals */}
      <TaskForm isOpen={formOpen} onClose={closeForm} editTask={editTask} />
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Dashboard;
