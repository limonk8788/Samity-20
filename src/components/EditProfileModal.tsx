import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { X, Save, User as UserIcon, Mail, Phone, ShieldCheck, Image as ImageIcon, Upload, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { lang, currentUser, updateCurrentUser } = useApp();
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    designation: currentUser.designation || (currentUser.role === 'admin' ? 'এডমিন / সাধারণ সম্পাদক' : 'সাধারণ সদস্য'),
    avatar: currentUser.avatar || PRESET_AVATARS[0]
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        designation: currentUser.designation || (currentUser.role === 'admin' ? 'এডমিন / সাধারণ সম্পাদক' : 'সাধারণ সদস্য'),
        avatar: currentUser.avatar || PRESET_AVATARS[0]
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      designation: formData.designation.trim(),
      avatar: formData.avatar
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                {currentUser.role === 'admin' 
                  ? (lang === 'bn' ? 'এডমিন প্রোফাইল পরিবর্তন' : 'Edit Admin Profile')
                  : (lang === 'bn' ? 'প্রোফাইল পরিবর্তন' : 'Edit Profile')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'bn' ? 'নাম, ইমেইল, মোবাইল ও ছবি পরিবর্তন করুন' : 'Update name, email, phone and photo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {isSaved && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
            </div>
          )}

          {/* Profile Photo Preview & Presets */}
          <div className="flex flex-col items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative group">
              <img
                src={formData.avatar}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-500/20 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold"
                title="ছবি আপলোড করুন"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'bn' ? 'নতুন ছবি আপলোড' : 'Upload Image'}</span>
              </button>
            </div>

            {/* Avatar Presets */}
            <div className="w-full">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 text-center">
                {lang === 'bn' ? 'অথবা অবতার নির্বাচন করুন:' : 'Or choose a preset avatar:'}
              </label>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: url }))}
                    className={`relative rounded-full p-0.5 transition-all ${
                      formData.avatar === url 
                        ? 'ring-2 ring-emerald-500 scale-110' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Preset ${idx + 1}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder={lang === 'bn' ? 'যেমন: মোঃ রেজাউল করিম' : 'e.g. John Doe'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'bn' ? 'লগইন ইমেইল এড্রেস' : 'Login Email Address'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="admin@samity.org"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {lang === 'bn' 
                ? 'এডমিন একাউন্টে সাইন ইন ও নোটিফিকেশনের জন্য ব্যবহৃত হবে।'
                : 'Used for admin sign in and account notifications.'}
            </p>
          </div>

          {/* Phone Field & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'bn' ? 'পদবী / রোল' : 'Designation / Role'}
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder={lang === 'bn' ? 'যেমন: সাধারণ সম্পাদক' : 'e.g. Secretary'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
