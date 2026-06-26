import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { taskApi } from '../api/taskApi';
import { subscribeToLoading } from '../api/axiosInstance';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks]     = useState([]);
  const [stats, setStats]     = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0, highPriority: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', sort: 'newest' });

  useEffect(() => {
    const unsub = subscribeToLoading(setLoading);
    return unsub;
  }, []);

  const fetchTasks = useCallback(async (overrideFilters) => {
    try {
      const f = overrideFilters || filters;
      const res = await taskApi.getAll(f);
      setTasks(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load tasks');
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      setStats(res.data.data);
    } catch {
      // non-critical
    }
  }, []);

  const refreshAll = useCallback(async (overrideFilters) => {
    await Promise.all([fetchTasks(overrideFilters), fetchStats()]);
  }, [fetchTasks, fetchStats]);

  useEffect(() => { refreshAll(); }, []);
  useEffect(() => { fetchTasks(); }, [filters]);

  const createTask = async (data) => {
    const res = await taskApi.create(data);
    toast.success('✅ Task created successfully!');
    await refreshAll();
    return res.data.data;
  };

  const updateTask = async (id, data) => {
    const res = await taskApi.update(id, data);
    toast.success('✏️ Task updated successfully!');
    await refreshAll();
    return res.data.data;
  };

  const quickStatusUpdate = async (id, status) => {
    const res = await taskApi.update(id, { status });
    const labels = { 'completed': '🎉 Marked as completed!', 'in-progress': '🔄 Marked as in progress!', 'pending': '⏳ Marked as pending!' };
    toast.success(labels[status] || 'Status updated!');
    await refreshAll();
    return res.data.data;
  };

  const deleteTask = async (id) => {
    await taskApi.delete(id);
    toast.success('🗑️ Task deleted successfully!');
    await refreshAll();
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <TaskContext.Provider value={{
      tasks, stats, loading, filters,
      createTask, updateTask, quickStatusUpdate, deleteTask,
      updateFilters, refreshAll,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
