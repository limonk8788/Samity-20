import React, { useState } from 'react';
import { 
  Building2, Phone, Mail, MapPin, ShieldCheck, HeartHandshake, 
  FileSpreadsheet, Users, Wallet, Bell, ChevronRight, Smartphone, 
  Download, CheckCircle2, HelpCircle, Laptop, WifiOff, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { usePWA } from '../hooks/usePWA';
import { PWAInstallModal } from './PWAInstallModal';

export const Footer: React.FC = () => {
  const { lang, settings, setActiveTab, currentUser } = useApp();
  const t = translations[lang];
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleInstallClick = async () => {
    const result = await installApp();
    if (result === 'unsupported' || result === 'ios') {
      setIsInstallModalOpen(true);
    }
  };

  return (
    <footer 
      id="main-app-footer"
      className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors text-slate-600 dark:text-slate-300 pt-10 pb-28 sm:pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & User Tagline */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
                  {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {currentUser.role === 'admin' ? t.admin : t.member}
                </span>
              </div>
            </div>

            {/* Requested Tagline Banner */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
              <div className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {lang === 'bn' ? settings.taglineBn : settings.taglineEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {lang === 'bn' 
                ? 'সদস্যদের কল্যাণ, মাসিক চাঁদা আদায়, আয়-ব্যয়ের হিসাব ও সহযোগিতার জন্য সমন্বিত ডিজিটাল ব্যবস্থাপনা।'
                : 'Integrated management system for samity members, monthly dues, accounting and mutual collaboration.'}
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5 flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.dashboard}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('members')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.members}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('chanda')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.chanda}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('accounts')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.accounts}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.notices}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Office */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'যোগাযোগ ও কার্যালয়' : 'Office & Contact'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Accounts */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'তহবিল জমাদান একাউন্ট' : 'Payment Accounts'}</span>
            </h4>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{settings.bankName}</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{settings.bankAccountNumber}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-pink-600 font-semibold">বিকাশ:</span>
                <span className="font-mono">{settings.bkashNumber}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-600 font-semibold">নগদ:</span>
                <span className="font-mono">{settings.nagadNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PWA App Install Banner Section */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-emerald-900/10 dark:from-emerald-950/40 dark:via-slate-800 dark:to-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 transition-all shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-2 flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'মোবাইল ও কম্পিউটারে অ্যাপ ইনস্টল করুন' : 'Install App on Mobile & Desktop'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700">
                    PWA Ready
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {lang === 'bn'
                    ? 'প্লে-স্টোর ছাড়াই সরাসরি ব্রাউজার থেকে অ্যাপের মতো ইনস্টল করুন। হোমস্ক্রিন থেকে দ্রুত প্রবেশ ও নিরবচ্ছিন্ন ব্যবহারের সুবিধা।'
                    : 'Install directly from your browser like a native app with offline capability and instant home screen access.'}
                </p>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'bn' ? 'তাত্ক্ষণিক লোডিং' : 'Instant Loading'}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{lang === 'bn' ? 'অফলাইন ক্যাশ' : 'Offline Cached'}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{lang === 'bn' ? 'মোবাইল ও পিসি সাপোর্ট' : 'Mobile & PC'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-1 md:pt-0">
              {isInstalled ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'bn' ? 'অ্যাপটি ইনস্টল রয়েছে' : 'App is Installed'}</span>
                  </span>
                  <button
                    onClick={() => setIsInstallModalOpen(true)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={lang === 'bn' ? 'ইনস্টলেশন তথ্য' : 'Installation Info'}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    id="footer-pwa-install-btn"
                    onClick={handleInstallClick}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
                    title={lang === 'bn' ? 'সমিতি অ্যাপটি ডিভাইসে ইনস্টল করুন' : 'Install Samity app on your device'}
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}</span>
                  </button>
                  <button
                    onClick={() => setIsInstallModalOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title={lang === 'bn' ? 'ইনস্টল করার নিয়মাবলী' : 'Installation Instructions'}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">{lang === 'bn' ? 'নিয়মাবলী' : 'Guide'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Tagline Echo */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
          <div>
            © ২০২৬ {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}। {lang === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            {lang === 'bn' ? settings.taglineBn : settings.taglineEn}
          </div>
        </div>
      </div>

      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onDirectInstall={handleInstallClick}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
      />
    </footer>
  );
};
