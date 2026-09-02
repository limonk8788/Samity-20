import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatDisplayDate } from '../utils/translations';
import { 
  Bell, PlusCircle, Calendar, User, Trash2, AlertCircle, 
  CheckCircle2, Megaphone, X, Pin 
} from 'lucide-react';
import { Notice } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

export const NoticesView: React.FC = () => {
  const { lang, notices, addNotice, deleteNotice, currentUser, settings } = useApp();
  const t = translations[lang];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Notice, 'id'>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    publishedBy: currentUser.name,
    isImportant: false,
    targetAudience: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    addNotice({
      ...formData,
      publishedBy: currentUser.name
    });

    setIsAddModalOpen(false);
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      publishedBy: currentUser.name,
      isImportant: false,
      targetAudience: 'all'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header & Write Notice Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.notices}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {lang === 'bn' 
              ? 'সমিতির সকল জরুরি বিজ্ঞপ্তি ও সাধারণ ঘোষণা'
              : 'Official announcements and notices for Samity members'}
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            id="write-new-notice-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.newNotice}</span>
          </button>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
            {t.noNotices}
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-xs ${
                notice.isImportant
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isImportant && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200">
                        <Pin className="w-3 h-3" />
                        {t.importantNotice}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDisplayDate(notice.date, lang)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-1">
                    {notice.title}
                  </h3>
                </div>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setDeletingNoticeId(notice.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Description Body */}
              <div className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {notice.description}
              </div>

              {/* Notice Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'bn' ? 'প্রকাশক:' : 'Published by:'}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{notice.publishedBy}</span>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  {t.newNotice}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.noticeTitle} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="যেমন: সেপ্টেম্বর মাসের সাধারণ সভা ও চাঁদা জমাদানের আহ্বান"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.noticeDescription} *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.date} *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.importantNotice}
                  </label>
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isImportantNoticeCheckbox"
                      checked={formData.isImportant}
                      onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="isImportantNoticeCheckbox" className="text-xs text-slate-700 dark:text-slate-300">
                      জরুরি হিসেবে হাইলাইট করুন
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t.publishNotice}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingNoticeId}
        title="নোটিশ মুছে ফেলুন"
        message="আপনি কি এই নোটিশটি মুছে ফেলতে চান?"
        onConfirm={() => {
          if (deletingNoticeId) {
            deleteNotice(deletingNoticeId);
            setDeletingNoticeId(null);
          }
        }}
        onCancel={() => setDeletingNoticeId(null)}
      />
    </div>
  );
};
