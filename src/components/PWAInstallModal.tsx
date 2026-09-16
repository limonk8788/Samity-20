import React, { useState } from 'react';
import { 
  X, Smartphone, Monitor, Apple, CheckCircle2, Download, 
  Share, PlusSquare, ArrowRight, ShieldCheck, Zap, WifiOff 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectInstall?: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onDirectInstall,
  isInstallable,
  isInstalled,
  isIOS
}) => {
  const { lang, settings } = useApp();
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Brand */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shadow-emerald-900/30 flex items-center justify-center shrink-0">
              <img src="/icons/icon-192.png" alt="Samity App" className="w-10 h-10 rounded-lg object-cover" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                {lang === 'bn' ? 'অফিসিয়াল ডিজিটাল অ্যাপ ইনস্টলেশন' : 'Official Progressive Web App'}
              </p>
            </div>
          </div>

          {/* Quick Perks */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-500/40 text-[11px] text-emerald-50">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{lang === 'bn' ? 'সুপার ফাস্ট' : 'Super Fast'}</span>
            </div>
            <div className="flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span>{lang === 'bn' ? 'অফলাইন তৈরি' : 'Offline Ready'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-200 shrink-0" />
              <span>{lang === 'bn' ? 'নিরাপদ' : 'Secure'}</span>
            </div>
          </div>
        </div>

        {/* Status / Direct Action */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
          {isInstalled ? (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">
                  {lang === 'bn' ? 'অ্যাপটি ইতোমধ্যে ইনস্টল করা আছে!' : 'App is already installed!'}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {lang === 'bn' ? 'আপনার মোবাইল বা পিসির হোমস্ক্রিন থেকে এটি সরাসরি চালু করুন।' : 'Open directly from your device home screen.'}
                </span>
              </div>
            </div>
          ) : isInstallable && onDirectInstall ? (
            <button
              onClick={() => {
                onDirectInstall();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? 'এক ক্লিকে এখনই ইনস্টল করুন' : 'Install Directly Now'}</span>
            </button>
          ) : (
            <div className="text-xs text-slate-600 dark:text-slate-300 text-center font-medium">
              {lang === 'bn' 
                ? 'নিচের নির্দেশিকা অনুসরণ করে আপনার ডিভাইসে অ্যাপটি সহজে ইনস্টল করুন:' 
                : 'Follow the device instructions below to install:'}
            </div>
          )}
        </div>

        {/* Platform Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold bg-white dark:bg-slate-900">
          <button
            onClick={() => setActivePlatform('android')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activePlatform === 'android'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android / Chrome</span>
          </button>
          <button
            onClick={() => setActivePlatform('ios')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activePlatform === 'ios'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActivePlatform('desktop')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activePlatform === 'desktop'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>PC / Mac</span>
          </button>
        </div>

        {/* Instruction Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          {activePlatform === 'android' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">১</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'ব্রাউজার মেনু খুলুন' : 'Open Browser Menu'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'ক্রোম বা স্যামসাং ব্রাউজারের উপরে ডানদিকের তিনটি ডট (⋮) চাপুন।' : 'Tap the three dots menu (⋮) in Chrome or Samsung Internet.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">২</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'bn' ? '"অ্যাপ ইনস্টল করুন" বা "হোম স্ক্রিনে যোগ করুন" চাপুন' : 'Select "Install App" or "Add to Home screen"'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'মেনু থেকে "Install app" বা "Add to Home screen" অপশনটিতে ক্লিক করুন।' : 'Choose Install app / Add to Home screen from the dropdown list.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">৩</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'ইনস্টল নিশ্চিত করুন' : 'Confirm Installation'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'পপআপে "Install" চাপলেই অ্যাপটি মোবাইলের হোম স্ক্রিনে সেভ হয়ে যাবে।' : 'Tap "Install" to place the app icon directly on your phone.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'ios' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">১</span>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <span>{lang === 'bn' ? 'শেয়ার আইকন চাপুন' : 'Tap the Share Button'}</span>
                    <Share className="w-4 h-4 text-sky-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'সাফারি (Safari) ব্রাউজারের নিচের বারে মাঝখানের শেয়ার আইকনটি চাপুন।' : 'Tap the Share icon at the bottom center of Safari.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">২</span>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <span>{lang === 'bn' ? '"Add to Home Screen" নির্বাচন করুন' : 'Select "Add to Home Screen"'}</span>
                    <PlusSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'একটু নিচে স্ক্রল করে "Add to Home Screen" (+) অপশনে ক্লিক করুন।' : 'Scroll down and tap "Add to Home Screen".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">৩</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'উপরে "Add" চাপুন' : 'Tap "Add" in Top Right'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'স্ক্রিনের উপরে ডানদিকের "Add" বাটনে চাপলেই আইফোনে অ্যাপ তৈরি হয়ে যাবে।' : 'Tap "Add" to finish installing on your iPhone or iPad.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">১</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'bn' ? 'ব্রাউজার এড্রেস বারে নজর দিন' : 'Look at the Address Bar'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'Chrome বা Edge ব্রাউজারের ইউআরএল বারের ডানপাশে একটি ছোট কম্পিউটার বা ডাউনলোড আইকন দেখতে পাবেন।' : 'Look for the Install icon on the right side of the browser URL bar.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">২</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {lang === 'bn' ? '"Install সমিতি" ক্লিক করুন' : 'Click "Install Samity"'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'আইকনে ক্লিক করে "Install" চাপলেই ডেক্সটপে আলাদা উইন্ডোতে অ্যাপ হিসেবে চালু হবে।' : 'Click Install to open Samity as a standalone desktop application.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{lang === 'bn' ? 'সাইজ: মাত্র ১ MB এর কম' : 'Size: Less than 1 MB'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'বুঝেছি' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
