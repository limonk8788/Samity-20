import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { 
  X, Save, Download, Upload, RotateCcw, Building2, 
  CreditCard, ShieldCheck, Mail, Phone, Edit3 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenEditProfile }) => {
  const { 
    lang, settings, updateSettings, currentUser, updateCurrentUser,
    exportDatabaseJson, importDatabaseJson, resetDemoData 
  } = useApp();
  const t = translations[lang];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ ...settings });
  const [adminData, setAdminData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    designation: currentUser.designation || (currentUser.role === 'admin' ? 'এডমিন' : 'সদস্য')
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...settings });
      setAdminData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        designation: currentUser.designation || (currentUser.role === 'admin' ? 'এডমিন' : 'সদস্য')
      });
    }
  }, [isOpen, settings, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);

    if (currentUser.role === 'admin') {
      updateCurrentUser({
        name: adminData.name.trim(),
        email: adminData.email.trim(),
        phone: adminData.phone.trim(),
        designation: adminData.designation.trim()
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = importDatabaseJson(text);
        if (success) {
          setImportStatus(lang === 'bn' ? 'ডাটা সফলভাবে রিস্টোর হয়েছে!' : 'Data restored successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus(lang === 'bn' ? 'ভুল JSON ফাইল!' : 'Invalid JSON file!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {t.settings}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                সমিতি ও আর্থিক সেটিং ব্যবস্থাপনা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold text-center">
              {lang === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings saved successfully!'}
            </div>
          )}

          {importStatus && (
            <div className="p-3 bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 rounded-xl text-xs font-semibold text-center">
              {importStatus}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                {lang === 'bn' ? 'সমিতির তথ্য' : 'Samity Information'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    সমিতির নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.associationNameBn}
                    onChange={(e) => setFormData({ ...formData, associationNameBn: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Samity Name (English)
                  </label>
                  <input
                    type="text"
                    value={formData.associationNameEn}
                    onChange={(e) => setFormData({ ...formData, associationNameEn: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    স্লোগান / ট্যাগলাইন
                  </label>
                  <input
                    type="text"
                    value={formData.taglineBn}
                    onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ডিফল্ট মাসিক চাঁদা (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.defaultMonthlyFee}
                    onChange={(e) => setFormData({ ...formData, defaultMonthlyFee: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'অফিসিয়াল ইমেইল এড্রেস' : 'Official Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="info@samity.org"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল / হেল্পলাইন
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    অফিস ঠিকানা
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Admin Profile & Credentials Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  {lang === 'bn' ? 'এডমিন প্রোফাইল ও লগইন একাউন্ট' : 'Admin Profile & Login Account'}
                </h4>
                {onOpenEditProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenEditProfile();
                    }}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'ছবি ও সম্পূর্ণ প্রোফাইল এডিট' : 'Full Profile & Avatar Edit'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'এডমিন নাম' : 'Admin Name'}
                  </label>
                  <input
                    type="text"
                    value={adminData.name}
                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                    required
                    placeholder={lang === 'bn' ? 'এডমিনের নাম' : 'Admin Name'}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'এডমিন লগইন ইমেইল' : 'Admin Login Email'}
                  </label>
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    required
                    placeholder="admin@samity.org"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'এডমিন মোবাইল' : 'Admin Phone'}
                  </label>
                  <input
                    type="text"
                    value={adminData.phone}
                    onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'এডমিন পদবী' : 'Admin Designation'}
                  </label>
                  <input
                    type="text"
                    value={adminData.designation}
                    onChange={(e) => setAdminData({ ...adminData, designation: e.target.value })}
                    placeholder={lang === 'bn' ? 'যেমন: সাধারণ সম্পাদক' : 'e.g. Secretary'}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Bank & Payment Info */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                {t.associationAccountDetails}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যাংকের নাম
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যাংক একাউন্ট নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    বিকাশ মার্চেন্ট নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.bkashNumber}
                    onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    নগদ মার্চেন্ট নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.nagadNumber}
                    onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{t.save}</span>
              </button>
            </div>
          </form>

          {/* Database Backup & Restore */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'ডাটা ব্যাকআপ ও রক্ষণাবেক্ষণ' : 'Data Backup & Maintenance'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={exportDatabaseJson}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>{t.backupData}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>{t.restoreData}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => {
                  if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে ডেমো ডাটা রিসেট করতে চান?' : 'Reset to default demo data?')) {
                    resetDemoData();
                    onClose();
                  }
                }}
                className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-xs font-semibold flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.resetDefaultData}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
