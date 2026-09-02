import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate, formatMonthYear } from '../utils/translations';
import { 
  FileText, Printer, Download, Filter, Calendar, Users, 
  TrendingUp, TrendingDown, Wallet, Building2, CheckCircle2 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { Payment } from '../types';

export const ReportsView: React.FC = () => {
  const { lang, members, payments, transactions, settings } = useApp();
  const t = translations[lang];
  const reportRef = useRef<HTMLDivElement>(null);

  const currentYearMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-09"
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [activeReportTab, setActiveReportTab] = useState<'summary' | 'chanda' | 'dues' | 'members'>('summary');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Download PNG Handler
  const handleDownloadPng = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Report_${selectedMonth}_${activeReportTab}.png`;
      a.click();
    } catch (err) {
      console.error('Error generating image', err);
    }
  };

  // Monthly filtered data
  const monthlyPayments = payments.filter(p => p.month === selectedMonth);
  const totalCollectedChanda = monthlyPayments.reduce((acc, curr) => acc + curr.paidAmount, 0);

  const monthlyIncomeTx = transactions.filter(t => t.type === 'income' && t.date.startsWith(selectedMonth));
  const totalMonthlyIncome = monthlyIncomeTx.reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyExpenseTx = transactions.filter(t => t.type === 'expense' && t.date.startsWith(selectedMonth));
  const totalMonthlyExpense = monthlyExpenseTx.reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyNetBalance = totalMonthlyIncome - totalMonthlyExpense;

  // Dues calculation for selected month
  const paidMemberIds = new Set<string>(monthlyPayments.filter(p => p.status === 'paid').map(p => p.memberId));
  const partialPaymentMap = new Map<string, Payment>(monthlyPayments.filter(p => p.status === 'partial').map(p => [p.memberId, p]));

  const duesList = members.filter(m => m.status === 'active').map(member => {
    const isFullPaid = paidMemberIds.has(member.memberId);
    const partial = partialPaymentMap.get(member.memberId);
    if (isFullPaid) {
      return { member, dueAmount: 0, paidAmount: member.monthlyFee, status: 'paid' as const };
    } else if (partial) {
      return { member, dueAmount: partial.dueAmount, paidAmount: partial.paidAmount, status: 'partial' as const };
    } else {
      return { member, dueAmount: member.monthlyFee, paidAmount: 0, status: 'due' as const };
    }
  }).filter(item => item.dueAmount > 0);

  const totalOutstandingDues = duesList.reduce((acc, curr) => acc + curr.dueAmount, 0);

  // Member-wise payment history
  const memberHistoryPayments = selectedMemberId === 'all' 
    ? payments 
    : payments.filter(p => p.memberId === selectedMemberId);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header and Download Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.reports}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {lang === 'bn' 
              ? 'সমিতির মাসিক চাঁদা, আয়-ব্যয়, বকেয়া এবং সদস্যভিত্তিক সার্বিক আর্থিক প্রতিবেদন'
              : 'Samity financial statements and member dues reports'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>{t.printReceipt} / PDF</span>
          </button>
          <button
            onClick={handleDownloadPng}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadPng}</span>
          </button>
        </div>
      </div>

      {/* Filter and Tab Selectors */}
      <div className="no-print bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 text-xs font-semibold w-full md:w-auto">
          <button
            onClick={() => setActiveReportTab('summary')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeReportTab === 'summary'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t.balanceSummary}
          </button>
          <button
            onClick={() => setActiveReportTab('chanda')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeReportTab === 'chanda'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t.monthlyChandaReport}
          </button>
          <button
            onClick={() => setActiveReportTab('dues')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeReportTab === 'dues'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t.duesReport}
          </button>
          <button
            onClick={() => setActiveReportTab('members')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeReportTab === 'members'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t.memberPaymentHistory}
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium">{lang === 'bn' ? 'প্রতিবেদনের মাস:' : 'Month:'}</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          />
        </div>
      </div>

      {/* Styled Printable Report Sheet Container */}
      <div className="flex justify-center">
        <div
          ref={reportRef}
          id="printable-report-sheet"
          className="w-full max-w-4xl bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-lg relative"
        >
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-emerald-700 pb-5 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight">
                {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}
              </h1>
            </div>
            <p className="text-xs text-slate-600">
              {settings.address} • ফোন: {settings.phone} • ইমেইল: {settings.email}
            </p>
            <div className="mt-3 inline-block bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full border border-slate-300">
              {activeReportTab === 'summary' && `${t.balanceSummary} - ${formatMonthYear(selectedMonth, lang)}`}
              {activeReportTab === 'chanda' && `${t.monthlyChandaReport} - ${formatMonthYear(selectedMonth, lang)}`}
              {activeReportTab === 'dues' && `${t.duesReport} - ${formatMonthYear(selectedMonth, lang)}`}
              {activeReportTab === 'members' && `${t.memberPaymentHistory}`}
            </div>
          </div>

          {/* Report Date & Generator Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 py-3 border-b border-slate-100">
            <span>প্রতিবেদন তৈরির তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
            <span>হিসাবকাল: {formatMonthYear(selectedMonth, lang)}</span>
          </div>

          {/* TAB 1: Monthly Financial Summary */}
          {activeReportTab === 'summary' && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 font-bold block">{t.totalIncome}</span>
                  <span className="text-xl font-black text-emerald-700">{formatCurrency(totalMonthlyIncome, lang)}</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[11px] text-rose-800 font-bold block">{t.totalExpense}</span>
                  <span className="text-xl font-black text-rose-700">{formatCurrency(totalMonthlyExpense, lang)}</span>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-[11px] text-teal-900 font-bold block">{t.currentBalance} (উদ্বৃত্ত)</span>
                  <span className="text-xl font-black text-teal-800">{formatCurrency(monthlyNetBalance, lang)}</span>
                </div>
              </div>

              {/* Incomes Breakdown */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 border-b pb-1 mb-2">
                  আয় বিবরণী ({formatMonthYear(selectedMonth, lang)})
                </h4>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="p-2">{t.date}</th>
                      <th className="p-2">{t.category}</th>
                      <th className="p-2">{t.description}</th>
                      <th className="p-2 text-right">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {monthlyIncomeTx.length === 0 ? (
                      <tr><td colSpan={4} className="p-3 text-center text-slate-400">এই মাসে কোনো অতিরিক্ত আয় নেই</td></tr>
                    ) : (
                      monthlyIncomeTx.map(tx => (
                        <tr key={tx.id}>
                          <td className="p-2">{formatDisplayDate(tx.date, lang)}</td>
                          <td className="p-2 font-medium">{tx.category}</td>
                          <td className="p-2">{tx.description}</td>
                          <td className="p-2 text-right font-bold text-emerald-700">{formatCurrency(tx.amount, lang)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Expenses Breakdown */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800 border-b pb-1 mb-2">
                  ব্যয় বিবরণী ({formatMonthYear(selectedMonth, lang)})
                </h4>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="p-2">{t.date}</th>
                      <th className="p-2">{t.category}</th>
                      <th className="p-2">{t.description}</th>
                      <th className="p-2 text-right">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {monthlyExpenseTx.length === 0 ? (
                      <tr><td colSpan={4} className="p-3 text-center text-slate-400">এই মাসে কোনো ব্যয় রেকর্ড নেই</td></tr>
                    ) : (
                      monthlyExpenseTx.map(tx => (
                        <tr key={tx.id}>
                          <td className="p-2">{formatDisplayDate(tx.date, lang)}</td>
                          <td className="p-2 font-medium">{tx.category}</td>
                          <td className="p-2">{tx.description}</td>
                          <td className="p-2 text-right font-bold text-rose-700">{formatCurrency(tx.amount, lang)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Monthly Chanda Report */}
          {activeReportTab === 'chanda' && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900">মোট আদায়কৃত চাঁদা:</span>
                <span className="text-base font-black text-emerald-700">{formatCurrency(totalCollectedChanda, lang)}</span>
              </div>

              <table className="w-full text-xs text-left border rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-2.5">রসিদ নং</th>
                    <th className="p-2.5">সদস্যের নাম</th>
                    <th className="p-2.5">সদস্য আইডি</th>
                    <th className="p-2.5">তারিখ</th>
                    <th className="p-2.5">মাধ্যম</th>
                    <th className="p-2.5 text-right">আদায় (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyPayments.length === 0 ? (
                    <tr><td colSpan={6} className="p-4 text-center text-slate-400">এই মাসে কোনো চাঁদা জমা পড়েনি</td></tr>
                  ) : (
                    monthlyPayments.map(p => (
                      <tr key={p.id}>
                        <td className="p-2.5 font-mono font-semibold">{p.receiptNumber}</td>
                        <td className="p-2.5 font-bold">{p.memberName}</td>
                        <td className="p-2.5">{p.memberId}</td>
                        <td className="p-2.5">{formatDisplayDate(p.paymentDate, lang)}</td>
                        <td className="p-2.5 uppercase font-medium">{p.paymentMethod}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(p.paidAmount, lang)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Outstanding Dues Report */}
          {activeReportTab === 'dues' && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs">
                <span className="font-bold text-rose-900">বকেয়া চাঁদার মোট পরিমাণ:</span>
                <span className="text-base font-black text-rose-700">{formatCurrency(totalOutstandingDues, lang)}</span>
              </div>

              <table className="w-full text-xs text-left border rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-2.5">সদস্য আইডি</th>
                    <th className="p-2.5">সদস্যের নাম</th>
                    <th className="p-2.5">মোবাইল</th>
                    <th className="p-2.5">ঠিকানা</th>
                    <th className="p-2.5 text-right">নির্ধারিত চাঁদা</th>
                    <th className="p-2.5 text-right">বকেয়া পরিমাণ (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {duesList.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-emerald-600 font-bold">এই মাসে সকল সদস্যের চাঁদা পরিশোধিত! কোনো বকেয়া নেই।</td></tr>
                  ) : (
                    duesList.map(({ member, dueAmount }) => (
                      <tr key={member.id}>
                        <td className="p-2.5 font-bold text-emerald-800">{member.memberId}</td>
                        <td className="p-2.5 font-bold">{member.name}</td>
                        <td className="p-2.5">{member.phone}</td>
                        <td className="p-2.5 text-slate-600">{member.address}</td>
                        <td className="p-2.5 text-right font-medium">{formatCurrency(member.monthlyFee, lang)}</td>
                        <td className="p-2.5 text-right font-bold text-rose-600">{formatCurrency(dueAmount, lang)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Member Payment History */}
          {activeReportTab === 'members' && (
            <div className="space-y-4 pt-4">
              <div className="no-print flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500 font-semibold">সদস্য নির্বাচন:</span>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-medium"
                >
                  <option value="all">সকল সদস্য ({members.length})</option>
                  {members.map(m => (
                    <option key={m.id} value={m.memberId}>
                      {m.name} ({m.memberId})
                    </option>
                  ))}
                </select>
              </div>

              <table className="w-full text-xs text-left border rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-2.5">রসিদ নং</th>
                    <th className="p-2.5">সদস্য</th>
                    <th className="p-2.5">মাস</th>
                    <th className="p-2.5">তারিখ</th>
                    <th className="p-2.5">মাধ্যম</th>
                    <th className="p-2.5 text-right">পরিশোধ</th>
                    <th className="p-2.5 text-right">বকেয়া</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {memberHistoryPayments.map(p => (
                    <tr key={p.id}>
                      <td className="p-2.5 font-mono font-semibold">{p.receiptNumber}</td>
                      <td className="p-2.5 font-bold">{p.memberName}</td>
                      <td className="p-2.5">{formatMonthYear(p.month, lang)}</td>
                      <td className="p-2.5">{formatDisplayDate(p.paymentDate, lang)}</td>
                      <td className="p-2.5 uppercase font-medium">{p.paymentMethod}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(p.paidAmount, lang)}</td>
                      <td className="p-2.5 text-right font-bold text-rose-600">{formatCurrency(p.dueAmount, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Signature Footer */}
          <div className="mt-16 pt-6 border-t border-slate-300 grid grid-cols-3 text-center text-xs text-slate-600">
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
              <span>হিসাব নিরীক্ষক</span>
            </div>
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
              <span>কোষাধ্যক্ষ</span>
            </div>
            <div>
              <div className="w-28 border-b border-slate-400 mx-auto mb-1"></div>
              <span className="font-semibold text-emerald-900">সভাপতি / সাধারণ সম্পাদক</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
