import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatDisplayDate, formatCurrency, formatMonthYear, toBengaliNumber } from '../utils/translations';
import { 
  X, Bell, Check, Trash2, AlertCircle, FileText, CreditCard, 
  CheckCircle2, Clock, Phone, Search, ArrowRight, UserCheck, Receipt
} from 'lucide-react';
import { Payment } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipts: () => void;
  onOpenReceipt?: (payment: Payment) => void;
  onRecordPaymentForMember?: (memberId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose,
  onOpenReceipts,
  onOpenReceipt,
  onRecordPaymentForMember
}) => {
  const { 
    lang, notifications, markNotificationRead, clearAllNotifications, 
    setActiveTab, subscriptionStatus, settings 
  } = useApp();
  const t = translations[lang];

  // Tabs: 'due' | 'paid' | 'general'
  const [activeSubTab, setActiveSubTab] = useState<'due' | 'paid' | 'general'>('due');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handlePayForMember = (memberId: string) => {
    if (onRecordPaymentForMember) {
      onRecordPaymentForMember(memberId);
    } else {
      setActiveTab('chanda');
    }
    onClose();
  };

  // Filter due members
  const filteredDueMembers = subscriptionStatus.dueMembers.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  });

  // Filter paid members
  const filteredPaidMembers = subscriptionStatus.paidMembers.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      (m.payment?.receiptNo && m.payment.receiptNo.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-tight">
                  {lang === 'bn' ? 'চলতি মাসের সাবস্ক্রিপশন ও নোটিফিকেশন' : 'Subscription Status & Alerts'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatMonthYear(subscriptionStatus.currentMonth, lang)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Subscription Overview Banner */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveSubTab('due')}
              className={`p-2 rounded-xl text-left border transition-all ${
                activeSubTab === 'due'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  {lang === 'bn' ? 'বকেয়া চাঁদা' : 'Unpaid'}
                </span>
                <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                  {toBengaliNumber(subscriptionStatus.dueCount)}
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {toBengaliNumber(subscriptionStatus.dueCount)} {lang === 'bn' ? 'সদস্য বাকি' : 'members'}
              </div>
            </button>

            <button
              onClick={() => setActiveSubTab('paid')}
              className={`p-2 rounded-xl text-left border transition-all ${
                activeSubTab === 'paid'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {lang === 'bn' ? 'পরিশোধিত' : 'Paid'}
                </span>
                <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  {toBengaliNumber(subscriptionStatus.paidCount)}
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                ৳{toBengaliNumber(subscriptionStatus.totalCollected)} {lang === 'bn' ? 'আদায়' : 'collected'}
              </div>
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 mt-3 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-950">
            <button
              onClick={() => setActiveSubTab('due')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'due'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'পরিশোধ করেনি' : 'Unpaid'}</span>
              <span className="text-[10px] px-1.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-mono">
                {toBengaliNumber(subscriptionStatus.dueCount)}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('paid')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'paid'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'পরিশোধ করেছে' : 'Paid'}</span>
              <span className="text-[10px] px-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono">
                {toBengaliNumber(subscriptionStatus.paidCount)}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('general')}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeSubTab === 'general'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'বিজ্ঞপ্তি' : 'Alerts'}</span>
              {notifications.length > 0 && (
                <span className="text-[10px] px-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                  {toBengaliNumber(notifications.length)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar for member lists */}
        {(activeSubTab === 'due' || activeSubTab === 'paid') && (
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'সদস্যের নাম বা আইডি দিয়ে খুঁজুন...' : 'Search by name or ID...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* TAB 1: UNPAID MEMBERS (চলতি মাসে পরিশোধ করেনি) */}
          {activeSubTab === 'due' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                <span>{lang === 'bn' ? 'চলতি মাসের চাঁদা এখনও দেননি:' : 'Pending monthly subscription:'}</span>
                <span className="font-mono font-bold">{toBengaliNumber(filteredDueMembers.length)} জন</span>
              </div>

              {filteredDueMembers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/80" />
                  <p>{lang === 'bn' ? 'অভিনন্দন! সকল সদস্যের চলতি মাসের চাঁদা পরিশোধিত।' : 'All members have paid for this month!'}</p>
                </div>
              ) : (
                filteredDueMembers.map((member) => {
                  const fee = member.monthlyFee || settings.defaultMonthlyFee || 500;
                  return (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800/80 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-rose-200 dark:border-rose-800 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {member.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              <span>{member.memberId}</span>
                              {member.designation && <span>• {member.designation}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            {lang === 'bn' ? 'অপরিশোধিত' : 'Due'}
                          </span>
                          <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                            ৳{toBengaliNumber(fee)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                        <a
                          href={`tel:${member.phone}`}
                          className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{member.phone}</span>
                        </a>

                        <button
                          onClick={() => handlePayForMember(member.memberId)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <span>{lang === 'bn' ? 'চাঁদা গ্রহণ' : 'Record Fee'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PAID MEMBERS (চলতি মাসে পরিশোধ করেছে) */}
          {activeSubTab === 'paid' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                <span>{lang === 'bn' ? 'চলতি মাসে চাঁদা পরিশোধিত সদস্যগণ:' : 'Members paid for this month:'}</span>
                <span className="font-mono font-bold">{toBengaliNumber(filteredPaidMembers.length)} জন</span>
              </div>

              {filteredPaidMembers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  {lang === 'bn' ? 'চলতি মাসে এখনও কোনো চাঁদা জমা হয়নি।' : 'No payments collected yet for this month.'}
                </div>
              ) : (
                filteredPaidMembers.map((member) => {
                  const payment = member.payment;
                  const paidAmount = payment?.paidAmount || member.monthlyFee || settings.defaultMonthlyFee || 500;
                  return (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-800/80 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-200 dark:border-emerald-800 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                              {member.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              <span>{member.memberId}</span>
                              {payment?.method && (
                                <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                                  {payment.method === 'cash' ? 'ক্যাশ' : payment.method === 'bkash' ? 'বিকাশ' : payment.method === 'bank' ? 'ব্যাংক' : payment.method}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            ✓ {lang === 'bn' ? 'পরিশোধিত' : 'Paid'}
                          </span>
                          <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            ৳{toBengaliNumber(paidAmount)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {payment?.date ? formatDisplayDate(payment.date, lang) : formatMonthYear(subscriptionStatus.currentMonth, lang)}
                        </span>

                        {payment && (
                          <button
                            onClick={() => {
                              if (onOpenReceipt) {
                                onOpenReceipt(payment);
                                onClose();
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                          >
                            <Receipt className="w-3 h-3 text-emerald-600" />
                            <span>{lang === 'bn' ? 'রসিদ দেখুন' : 'View Receipt'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: GENERAL NOTIFICATIONS (সাধারণ সিস্টেম বিজ্ঞপ্তি) */}
          {activeSubTab === 'general' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">
                  {lang === 'bn' ? 'মোট বিজ্ঞপ্তি' : 'All Notifications'}: {toBengaliNumber(notifications.length)}
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{lang === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  {lang === 'bn' ? 'কোনো সাধারণ নোটিফিকেশন নেই' : 'No general notifications'}
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
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {formatDisplayDate(n.date, lang)}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
