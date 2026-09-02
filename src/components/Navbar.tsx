import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { 
  Building2, Globe, Sun, Moon, Bell, Shield, User as UserIcon, 
  Settings, LogOut, CheckCheck, Menu, X, ArrowLeftRight
} from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenReceiptsList: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSettings, 
  onOpenNotifications,
  onOpenReceiptsList
}) => {
  const { 
    lang, setLang, theme, setTheme, currentUser, setRole, 
    settings, notifications, activeTab, setActiveTab 
  } = useApp();
  const t = translations[lang];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const handleRoleToggle = (targetRole: 'admin' | 'member') => {
    setRole(targetRole);
    setRoleMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard },
    { id: 'members', label: t.members },
    { id: 'chanda', label: t.chanda },
    { id: 'accounts', label: t.accounts },
    { id: 'notices', label: t.notices },
    { id: 'reports', label: t.reports },
    ...(currentUser.role === 'member' ? [{ id: 'profile', label: t.myProfile }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div 
            id="brand-header-logo"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
                  {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {currentUser.role === 'admin' ? t.admin : t.member}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {lang === 'bn' ? settings.taglineBn : settings.taglineEn}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Pill (Crucial for easy demo testing) */}
            <div className="relative">
              <button
                id="quick-role-switch-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors"
                title={t.switchRole}
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">{t.role}:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {currentUser.role === 'admin' ? t.admin : t.member}
                </span>
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.switchRole}
                  </div>
                  <button
                    onClick={() => handleRoleToggle('admin')}
                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-700/50 ${
                      currentUser.role === 'admin' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      {t.asAdmin} (ম্যানেজমেন্ট)
                    </span>
                    {currentUser.role === 'admin' && <CheckCheck className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleRoleToggle('member')}
                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-700/50 ${
                      currentUser.role === 'member' ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      {t.asMember} (সদস্য ভিউ)
                    </span>
                    {currentUser.role === 'member' && <CheckCheck className="w-4 h-4" />}
                  </button>
                  <div className="px-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700 mt-1">
                    {currentUser.role === 'admin' ? t.adminLoginNotice : 'সদস্যরা শুধু নিজের তথ্য দেখতে ও রসিদ আপলোড করতে পারে।'}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              id="language-toggle-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <button
              id="navbar-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.notifications}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Settings (Admin only or General) */}
            {currentUser.role === 'admin' && (
              <button
                id="navbar-settings-btn"
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t.settings}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          {currentUser.role === 'admin' && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  onOpenReceiptsList();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 text-xs font-medium rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-center"
              >
                {t.bankReceipts}
              </button>
              <button
                onClick={() => {
                  onOpenSettings();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-3 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-center"
              >
                {t.settings}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
