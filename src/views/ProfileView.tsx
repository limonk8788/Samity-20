import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate, formatMonthYear } from '../utils/translations';
import { 
  User, Shield, Phone, Mail, MapPin, Briefcase, Calendar, 
  CreditCard, FileText, Upload, Settings, CheckCircle2, AlertCircle, 
  Wallet, ShieldCheck, LogOut, Edit3, UserCheck
} from 'lucide-react';
import { Payment } from '../types';

interface ProfileViewProps {
  onOpenReceipt: (payment: Payment) => void;
  onOpenUploadReceipt: () => void;
  onOpenReceiptsList: () => void;
  onOpenSettings: () => void;
  onOpenEditProfile: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenReceipt,
  onOpenUploadReceipt,
  onOpenReceiptsList,
  onOpenSettings,
  onOpenEditProfile
}) => {
  const { lang, currentUser, members, payments, settings, setRole } = useApp();
  const t = translations[lang];

  // If member, find their member object
  const memberData = members.find(m => m.memberId === currentUser.memberId);
  const myPayments = payments.filter(p => p.memberId === currentUser.memberId);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthPayment = myPayments.find(p => p.month === currentMonth);
  const hasPaidCurrentMonth = currentMonthPayment && currentMonthPayment.status === 'paid';

  const totalPaidByMe = myPayments.reduce((acc, curr) => acc + curr.paidAmount, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/20 shadow-md"
            />
            <div className={`absolute bottom-0 right-0 p-1.5 rounded-full text-white shadow-xs ${
              currentUser.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-600'
            }`}>
              {currentUser.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {currentUser.role === 'admin' ? t.admin : t.member}
              </span>
            </div>

            {currentUser.memberId && (
              <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {t.memberId}: {currentUser.memberId}
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.associationNameBn} ({settings.associationNameEn})
              {currentUser.designation && (
                <span className="ml-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  • {currentUser.designation}
                </span>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </div>
              {currentUser.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.email}</span>
                </div>
              )}
              {memberData?.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{memberData.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={onOpenEditProfile}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{currentUser.role === 'admin' ? (lang === 'bn' ? 'এডমিন প্রোফাইল পরিবর্তন' : 'Edit Admin Profile') : (lang === 'bn' ? 'প্রোফাইল পরিবর্তন' : 'Edit Profile')}</span>
            </button>

            {currentUser.role === 'admin' ? (
              <button
                onClick={onOpenSettings}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>{t.settings}</span>
              </button>
            ) : (
              <button
                onClick={onOpenUploadReceipt}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadReceipt}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MEMBER SPECIFIC DASHBOARD: My Chanda Status */}
      {currentUser.role === 'member' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">{t.monthlyFee}</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(memberData?.monthlyFee || settings.defaultMonthlyFee, lang)}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">চলতি মাসের চাঁদা ({formatMonthYear(currentMonth, lang)})</span>
              <div className="flex items-center gap-2 mt-1">
                {hasPaidCurrentMonth ? (
                  <span className="text-emerald-600 font-bold text-base flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    পরিশোধিত
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold text-base flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    বকেয়া
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">আমার সর্বমোট প্রদানকৃত চাঁদা</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalPaidByMe, lang)}
              </span>
            </div>
          </div>

          {/* Member's Payment Receipts List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>আমার চাঁদা পরিশোধের ইতিহাস ও রসিদ সমূহ</span>
            </h3>

            {/* Mobile View for receipts */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {myPayments.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  আপনার কোনো পরিশোধ রেকর্ড পাওয়া যায়নি
                </div>
              ) : (
                myPayments.map((p) => (
                  <div key={`mob-receipt-${p.id}`} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                        {p.receiptNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{formatMonthYear(p.month, lang)}</span>
                        <span>•</span>
                        <span>{formatDisplayDate(p.paymentDate, lang)}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                        {formatCurrency(p.paidAmount, lang)} <span className="uppercase text-[10px] font-normal text-slate-400">({p.paymentMethod})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenReceipt(p)}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>রসিদ</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">রসিদ নং</th>
                    <th className="p-2.5">মাস</th>
                    <th className="p-2.5">তারিখ</th>
                    <th className="p-2.5">মাধ্যম</th>
                    <th className="p-2.5 text-right">পরিশোধিত টাকা</th>
                    <th className="p-2.5 text-right">রসিদ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        আপনার কোনো পরিশোধ রেকর্ড পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    myPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{p.receiptNumber}</td>
                        <td className="p-2.5 font-medium">{formatMonthYear(p.month, lang)}</td>
                        <td className="p-2.5 text-slate-500">{formatDisplayDate(p.paymentDate, lang)}</td>
                        <td className="p-2.5 uppercase text-slate-600">{p.paymentMethod}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(p.paidAmount, lang)}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => onOpenReceipt(p)}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-md transition-colors inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>রসিদ দেখুন</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Role Switcher in Profile for seamless testing */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
          {lang === 'bn' ? 'ব্যবহারকারী ভূমিকা পরিবর্তন (Testing Mode)' : 'Role Switcher (Testing Mode)'}
        </h4>
        <p className="text-xs text-slate-500 mb-3">
          {lang === 'bn' 
            ? 'এডমিন এবং সাধারণ সদস্য উভয় ভিউ সহজেই টেস্ট করার জন্য নিচের বাটন চাপুন:'
            : 'Toggle between Admin and Member interface instantly:'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRole('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentUser.role === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-300 text-slate-700 dark:text-slate-200'
            }`}
          >
            {t.admin} মোড
          </button>
          <button
            onClick={() => setRole('member')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentUser.role === 'member'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-300 text-slate-700 dark:text-slate-200'
            }`}
          >
            {t.member} মোড
          </button>
        </div>
      </div>
    </div>
  );
};
