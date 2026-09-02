import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatDisplayDate } from '../utils/translations';
import { X, Bell, Check, Trash2, AlertCircle, FileText, CreditCard } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipts: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose,
  onOpenReceipts 
}) => {
  const { lang, notifications, markNotificationRead, clearAllNotifications, setActiveTab } = useApp();
  const t = translations[lang];

  if (!isOpen) return null;

  const handleNotificationClick = (id: string, type: string) => {
    markNotificationRead(id);
    if (type === 'receipt') {
      onOpenReceipts();
      onClose();
    } else if (type === 'payment' || type === 'due') {
      setActiveTab('chanda');
      onClose();
    } else if (type === 'notice') {
      setActiveTab('notices');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              {t.notifications}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              {notifications.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-rose-600 hover:text-rose-700 p-1 flex items-center gap-1"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              {lang === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No notifications'}
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id, n.type)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  n.isRead
                    ? 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    {n.type === 'receipt' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                    {n.type === 'notice' && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                    {n.type === 'payment' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    {n.type === 'due' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatDisplayDate(n.date, lang)}
                  </span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
