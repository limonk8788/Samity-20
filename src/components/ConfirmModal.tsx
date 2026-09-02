import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const { lang } = useApp();
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          {title || t.confirmDelete}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {message || t.deleteWarning}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
