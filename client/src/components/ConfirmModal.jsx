import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box max-w-sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">{title}</h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed pl-13">
          {message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="confirm-cancel"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            id="confirm-delete"
            onClick={onConfirm}
            disabled={loading}
            className="btn-danger"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting…
              </span>
            ) : (
              'Delete Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
