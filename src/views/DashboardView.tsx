import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate, formatMonthYear } from '../utils/translations';
import { 
  Users, UserCheck, CreditCard, AlertCircle, TrendingUp, TrendingDown, 
  Wallet, Bell, ArrowRight, CheckCircle2, XCircle, FileText, 
  PlusCircle, Phone, Calendar, Upload
} from 'lucide-react';
import { Payment } from '../types';

interface DashboardViewProps {
  onOpenReceipt: (payment: Payment) => void;
  onOpenRecordPayment: (memberId?: string) => void;
  onOpenAddMember: () => void;
  onOpenAddTransaction: () => void;
  onOpenUploadReceipt: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenReceipt,
  onOpenRecordPayment,
  onOpenAddMember,
  onOpenAddTransaction,
  onOpenUploadReceipt
}) => {
  const { lang, members, payments, transactions, notices, currentUser, setActiveTab } = useApp();
  const t = translations[lang];

  // Current month string "YYYY-MM"
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-09"
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [paymentStatusTab, setPaymentStatusTab] = useState<'all' | 'paid' | 'due'>('all');

  // Member statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;

  // Monthly Chanda statistics
  const currentMonthPayments = payments.filter(p => p.month === selectedMonth);
  const thisMonthCollected = currentMonthPayments.reduce((acc, curr) => acc + curr.paidAmount, 0);

  // Determine who paid and who is due for selected month
  const activeMembersList = members.filter(m => m.status === 'active');
  const paidMemberIds = new Set<string>(currentMonthPayments.filter(p => p.status === 'paid').map(p => p.memberId));
  const partialPaymentMap = new Map<string, Payment>(currentMonthPayments.filter(p => p.status === 'partial').map(p => [p.memberId, p]));

  const memberStatusList = activeMembersList.map(member => {
    const isFullPaid = paidMemberIds.has(member.memberId);
    const partialPayment = partialPaymentMap.get(member.memberId);
    
    if (isFullPaid) {
      const payment = currentMonthPayments.find(p => p.memberId === member.memberId);
      return {
        member,
        status: 'paid' as const,
        paidAmount: payment?.paidAmount || member.monthlyFee,
        dueAmount: 0,
        paymentDate: payment?.paymentDate,
        payment
      };
    } else if (partialPayment) {
      return {
        member,
        status: 'partial' as const,
        paidAmount: partialPayment.paidAmount,
        dueAmount: partialPayment.dueAmount,
        paymentDate: partialPayment.paymentDate,
        payment: partialPayment
      };
    } else {
      return {
        member,
        status: 'due' as const,
        paidAmount: 0,
        dueAmount: member.monthlyFee,
        paymentDate: null,
        payment: null
      };
    }
  });

  // Calculate total outstanding dues for active members for this month
  const totalOutstandingDues = memberStatusList.reduce((acc, curr) => acc + curr.dueAmount, 0);

  // Accounts statistics: Total Income, Total Expense, Net Balance
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Latest notice
  const latestNotice = notices[0];

  // Filtered members for the "Who Paid vs Who Is Due" table
  const filteredMemberStatus = memberStatusList.filter(item => {
    if (paymentStatusTab === 'paid') return item.status === 'paid' || item.status === 'partial';
    if (paymentStatusTab === 'due') return item.status === 'due' || item.status === 'partial';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-700 to-teal-800 dark:from-emerald-900 dark:to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/60 backdrop-blur-xs text-xs font-semibold">
            <span>{formatMonthYear(selectedMonth, lang)}</span>
            <span>•</span>
            <span>{currentUser.role === 'admin' ? t.asAdmin : t.asMember}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {lang === 'bn' ? 'সমিতি ওভারভিউ ড্যাশবোর্ড' : 'Samity Overview Dashboard'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {lang === 'bn' 
              ? 'সমিতির মাসিক চাঁদা আদায়, বকেয়া তালিকা, আয়-ব্যয় এবং সার্বিক হিসাবের লাইভ সারসংক্ষেপ।'
              : 'Live summary of Samity members, monthly chanda, income, expense, and dues.'}
          </p>
        </div>

        {/* Quick Actions in Banner */}
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          {currentUser.role === 'admin' ? (
            <>
              <button
                id="quick-record-payment-btn"
                onClick={() => onOpenRecordPayment()}
                className="px-3.5 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>{t.recordPayment}</span>
              </button>
              <button
                id="quick-add-transaction-btn"
                onClick={onOpenAddTransaction}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-400/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'আয়/ব্যয় যোগ' : 'Add Txn'}</span>
              </button>
            </>
          ) : (
            <button
              id="member-upload-receipt-banner-btn"
              onClick={onOpenUploadReceipt}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>{t.uploadReceipt}</span>
            </button>
          )}
        </div>
      </div>

      {/* Latest Notice Highlight (Requirement #7: নতুন Notice প্রকাশ হলে Dashboard-এ সেটি Highlight হবে) */}
      {latestNotice && (
        <div 
          id="dashboard-notice-highlight"
          onClick={() => setActiveTab('notices')}
          className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/70 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  {latestNotice.isImportant ? t.importantNotice : (lang === 'bn' ? 'সাম্প্রতিক নোটিশ' : 'Recent Notice')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDisplayDate(latestNotice.date, lang)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {latestNotice.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                {latestNotice.description}
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold text-amber-800 dark:text-amber-300 shrink-0 gap-1">
            <span>{lang === 'bn' ? 'সকল নোটিশ দেখুন' : 'View Notices'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* 7 Key Dashboard Metric Cards (Requirement #3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Members */}
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.totalMembers}</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {lang === 'bn' ? totalMembers : totalMembers}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">{activeMembers} {t.active}</span>
          </div>
        </div>

        {/* Active Members */}
        <div 
          onClick={() => setActiveTab('members')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.activeMembers}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activeMembers}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round((activeMembers / (totalMembers || 1)) * 100)}% {lang === 'bn' ? 'সক্রিয় হার' : 'active rate'}
          </div>
        </div>

        {/* This Month's Chanda Collection */}
        <div 
          onClick={() => setActiveTab('chanda')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.thisMonthChanda}</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400">
            {formatCurrency(thisMonthCollected, lang)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {formatMonthYear(selectedMonth, lang)}
          </div>
        </div>

        {/* Total Dues */}
        <div 
          onClick={() => {
            setPaymentStatusTab('due');
          }}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.totalDues}</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(totalOutstandingDues, lang)}
          </div>
          <div className="text-[11px] text-rose-500 font-semibold mt-1">
            {memberStatusList.filter(m => m.status === 'due' || m.status === 'partial').length} {lang === 'bn' ? 'সদস্যের বকেয়া আছে' : 'members due'}
          </div>
        </div>

        {/* Total Income */}
        <div 
          onClick={() => setActiveTab('accounts')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.totalIncome}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatCurrency(totalIncome, lang)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {lang === 'bn' ? 'চাঁদা ও অনুদানসহ' : 'Including donations'}
          </div>
        </div>

        {/* Total Expense */}
        <div 
          onClick={() => setActiveTab('accounts')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{t.totalExpense}</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(totalExpense, lang)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {lang === 'bn' ? 'অফিস ও কর্মচারীদের খরচ' : 'Utilities & salaries'}
          </div>
        </div>

        {/* Current Total Balance (Span 2 on lg screens) */}
        <div 
          onClick={() => setActiveTab('accounts')}
          className="col-span-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t.currentBalance} (মোট আয় - মোট ব্যয়)</span>
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300">
            {formatCurrency(currentBalance, lang)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {lang === 'bn' 
              ? `হাতে নগদ ও ব্যাংক ব্যালেন্সের সমন্বিত হিসাব`
              : `Net calculated samity cash reserves`}
          </div>
        </div>
      </div>

      {/* Requirement #3: মোট বকেয়া চাঁদা কে দেয়নি কে দিয়েছে নাম প্রকাশ করা */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Card Header & Month Switcher */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.whoPaidWhoNot} ({formatMonthYear(selectedMonth, lang)})
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'bn' 
                ? 'সদস্যদের তালিকা এবং চলতি মাসের চাঁদা পরিশোধের লাইভ অবস্থা'
                : 'Member list and real-time payment status for the selected month'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
        </div>

        {/* Tab Switcher: All, Paid, Due */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setPaymentStatusTab('all')}
            className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
              paymentStatusTab === 'all'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t.all} ({memberStatusList.length})
          </button>
          <button
            onClick={() => setPaymentStatusTab('paid')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              paymentStatusTab === 'paid'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.paidMembers} ({memberStatusList.filter(m => m.status === 'paid' || m.status === 'partial').length})</span>
          </button>
          <button
            onClick={() => setPaymentStatusTab('due')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              paymentStatusTab === 'due'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.dueMembers} ({memberStatusList.filter(m => m.status === 'due' || m.status === 'partial').length})</span>
          </button>
        </div>

        {/* Mobile View: Clean, readable touch-friendly cards */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredMemberStatus.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              কোনো তথ্য পাওয়া যায়নি
            </div>
          ) : (
            filteredMemberStatus.map(({ member, status, paidAmount, dueAmount, payment }) => (
              <div 
                key={`mobile-${member.id}`}
                className={`p-3.5 transition-colors ${
                  status === 'due' ? 'bg-rose-50/20 dark:bg-rose-950/15' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">{member.memberId}</span>
                        <span>•</span>
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : status === 'partial'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {status === 'paid' ? t.paid : status === 'partial' ? t.partial : t.due}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">{t.assignedAmount}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(member.monthlyFee, lang)}
                    </span>
                  </div>
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-1.5 rounded-lg">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">{t.paidAmount}</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(paidAmount, lang)}
                    </span>
                  </div>
                  <div className="bg-rose-50/60 dark:bg-rose-950/30 p-1.5 rounded-lg">
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 block">{t.dueAmount}</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(dueAmount, lang)}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate">
                    {member.address}
                  </span>
                  {payment ? (
                    <button
                      onClick={() => onOpenReceipt(payment)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'রসিদ দেখুন' : 'Receipt'}</span>
                    </button>
                  ) : (
                    currentUser.role === 'admin' ? (
                      <button
                        onClick={() => onOpenRecordPayment(member.memberId)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'চাঁদা আদায়' : 'Collect'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-rose-500 font-semibold italic">
                        {lang === 'bn' ? 'পরিশোধ বাকি' : 'Payment Pending'}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Member List Table (hidden on mobile, visible on md+) */}
        <div className="hidden md:block divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-3 pl-4">{t.member}</th>
                <th className="p-3">{t.address}</th>
                <th className="p-3 text-right">{t.assignedAmount}</th>
                <th className="p-3 text-right">{t.paidAmount}</th>
                <th className="p-3 text-right">{t.dueAmount}</th>
                <th className="p-3 text-center">{t.statusField}</th>
                <th className="p-3 pr-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMemberStatus.map(({ member, status, paidAmount, dueAmount, paymentDate, payment }) => (
                <tr 
                  key={member.id} 
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    status === 'due' ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                  }`}
                >
                  {/* Member Name & ID */}
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{member.memberId}</span>
                          <span>•</span>
                          <span className="truncate">{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Address / Location */}
                  <td className="p-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                    {member.address}
                  </td>

                  {/* Assigned Amount */}
                  <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(member.monthlyFee, lang)}
                  </td>

                  {/* Paid Amount */}
                  <td className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(paidAmount, lang)}
                  </td>

                  {/* Due Amount */}
                  <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(dueAmount, lang)}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 text-center">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : status === 'partial'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {status === 'paid' ? t.paid : status === 'partial' ? t.partial : t.due}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 pr-4 text-right">
                    {payment ? (
                      <button
                        onClick={() => onOpenReceipt(payment)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 ml-auto"
                        title={t.moneyReceipt}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'রসিদ' : 'Receipt'}</span>
                      </button>
                    ) : (
                      currentUser.role === 'admin' ? (
                        <button
                          onClick={() => onOpenRecordPayment(member.memberId)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 ml-auto shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'আদায়' : 'Collect'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {lang === 'bn' ? 'পরিশোধ বাকি' : 'Pending'}
                        </span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
