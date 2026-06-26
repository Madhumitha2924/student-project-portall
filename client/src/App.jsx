import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <Navbar />
          <main>
            <Dashboard />
          </main>
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              padding: '12px 16px',
            },
            success: {
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
              },
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
              },
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
