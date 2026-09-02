import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate, formatMonthYear } from '../utils/translations';
import { 
  CreditCard, PlusCircle, Search, Filter, FileText, CheckCircle2, 
  Clock, AlertCircle, Trash2, Printer, Upload, CheckCheck, X
} from 'lucide-react';
import { Payment } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

interface ChandaViewProps {
  onOpenReceipt: (payment: Payment) => void;
  onOpenUploadReceipt: () => void;
  onOpenReceiptsList: () => void;
  initialMemberId?: string;
}

export const ChandaView: React.FC<ChandaViewProps> = ({
  onOpenReceipt,
  onOpenUploadReceipt,
  onOpenReceiptsList,
  initialMemberId
}) => {
  const { 
    lang, payments, members, recordPayment, deletePayment, 
    currentUser, settings, bankReceipts 
  } = useApp();
  const t = translations[lang];

  const currentYearMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-09"
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'due'>('all');

  // Record Payment Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

  // New Payment Form Data
  const [newPayMemberId, setNewPayMemberId] = useState(initialMemberId || (members[0]?.memberId || ''));
  const [newPayMonth, setNewPayMonth] = useState(currentYearMonth);
  const [newPayAmount, setNewPayAmount] = useState<number>(settings.defaultMonthlyFee || 500);
  const [newPayMethod, setNewPayMethod] = useState<'cash' | 'bank' | 'bkash' | 'nagad'>('cash');
  const [newPayDate, setNewPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPayNotes, setNewPayNotes] = useState('');

  const selectedMemberData = members.find(m => m.memberId === newPayMemberId);
  const assignedMonthlyFee = selectedMemberData ? selectedMemberData.monthlyFee : (settings.defaultMonthlyFee || 500);

  const openRecordModalWithMember = (memberId?: string) => {
    const memId = memberId || members[0]?.memberId || '';
    setNewPayMemberId(memId);
    const target = members.find(m => m.memberId === memId);
    setNewPayAmount(target ? target.monthlyFee : 500);
    setIsRecordModalOpen(true);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayMemberId) return;

    const mem = members.find(m => m.memberId === newPayMemberId);
    const assigned = mem ? mem.monthlyFee : 500;
    const paid = Number(newPayAmount);
    const due = Math.max(0, assigned - paid);

    let status: 'paid' | 'partial' | 'due' = 'paid';
    if (paid <= 0) status = 'due';
    else if (paid < assigned) status = 'partial';

    const recorded = recordPayment({
      memberId: newPayMemberId,
      memberName: mem?.name || 'অজ্ঞাত সদস্য',
      month: newPayMonth,
      assignedAmount: assigned,
      paidAmount: paid,
      dueAmount: due,
      paymentDate: newPayDate,
      paymentMethod: newPayMethod,
      status,
      receivedBy: currentUser.name,
      notes: newPayNotes
    });

    setIsRecordModalOpen(false);
    // Show receipt immediately!
    onOpenReceipt(recorded);
  };

  // Compile full table of members for selected month (including those who haven't paid yet)
  const monthPaymentsMap = new Map<string, Payment>(
    payments.filter(p => p.month === selectedMonth).map(p => [p.memberId, p])
  );

  const combinedMonthRecords = members.map(member => {
    const payment = monthPaymentsMap.get(member.memberId);
    if (payment) {
      return {
        member,
        payment,
        assigned: payment.assignedAmount,
        paid: payment.paidAmount,
        due: payment.dueAmount,
        date: payment.paymentDate,
        status: payment.status,
        method: payment.paymentMethod
      };
    } else {
      return {
        member,
        payment: null,
        assigned: member.monthlyFee,
        paid: 0,
        due: member.monthlyFee,
        date: null,
        status: 'due' as const,
        method: null
      };
    }
  });

  // Filter combined records
  const filteredRecords = combinedMonthRecords.filter(record => {
    const matchesSearch = 
      record.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.member.phone.includes(searchTerm);

    const matchesStatus = 
      statusFilter === 'all' ? true : record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Totals for this month
  const totalAssignedForMonth = combinedMonthRecords.reduce((a, b) => a + b.assigned, 0);
  const totalCollectedForMonth = combinedMonthRecords.reduce((a, b) => a + b.paid, 0);
  const totalDueForMonth = combinedMonthRecords.reduce((a, b) => a + b.due, 0);

  const pendingBankSlipsCount = bankReceipts.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.chanda} ({formatMonthYear(selectedMonth, lang)})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {lang === 'bn' 
              ? 'মাসিক চাঁদা আদায়, বকেয়া হিসাব এবং স্বয়ংক্রিয় রসিদ প্রস্তুতকরণ'
              : 'Monthly fee collections, dues tracker and receipt generator'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'admin' ? (
            <>
              <button
                id="view-pending-bank-slips-btn"
                onClick={onOpenReceiptsList}
                className="relative px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.bankReceipts}</span>
                {pendingBankSlipsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingBankSlipsCount}
                  </span>
                )}
              </button>

              <button
                id="record-payment-btn"
                onClick={() => openRecordModalWithMember()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.recordPayment}</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenUploadReceipt}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm shadow-emerald-600/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{t.uploadReceipt}</span>
            </button>
          )}
        </div>
      </div>

      {/* Monthly Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold block">{t.assignedAmount} ({formatMonthYear(selectedMonth, lang)}):</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalAssignedForMonth, lang)}
          </span>
        </div>
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-emerald-600 font-semibold block">{t.paidAmount} (আদায়কৃত):</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalCollectedForMonth, lang)}
          </span>
        </div>
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] text-rose-600 font-semibold block">{t.dueAmount} (বকেয়া):</span>
          <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(totalDueForMonth, lang)}
          </span>
        </div>
      </div>

      {/* Filter and Month Controls */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-xs hidden sm:inline">{lang === 'bn' ? 'মাস:' : 'Month:'}</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">{t.all} ({t.statusField})</option>
            <option value="paid">{t.paid}</option>
            <option value="partial">{t.partial}</option>
            <option value="due">{t.due}</option>
          </select>
        </div>
      </div>

      {/* Chanda List Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Mobile Cards (Visible on mobile screens) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              কোনো তথ্য পাওয়া যায়নি
            </div>
          ) : (
            filteredRecords.map(({ member, payment, assigned, paid, due, date, status, method }) => (
              <div 
                key={`mobile-chanda-${member.id}`}
                className={`p-3.5 transition-colors ${
                  status === 'due' ? 'bg-rose-50/20 dark:bg-rose-950/15' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">{member.memberId}</span>
                        <span>•</span>
                        <span>{formatMonthYear(selectedMonth, lang)}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
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
                      {formatCurrency(assigned, lang)}
                    </span>
                  </div>
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-1.5 rounded-lg">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">{t.paidAmount}</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(paid, lang)}
                    </span>
                  </div>
                  <div className="bg-rose-50/60 dark:bg-rose-950/30 p-1.5 rounded-lg">
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 block">{t.dueAmount}</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(due, lang)}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    {date ? <span>তারিখ: {formatDisplayDate(date, lang)}</span> : <span className="text-slate-400">অপরিশোধিত</span>}
                    {method && <span className="ml-1 uppercase text-[10px] font-semibold text-slate-400">({method})</span>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {payment ? (
                      <>
                        <button
                          onClick={() => onOpenReceipt(payment)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'রসিদ' : 'Receipt'}</span>
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => setDeletingPaymentId(payment.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                            title="পেমেন্ট মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      currentUser.role === 'admin' ? (
                        <button
                          onClick={() => openRecordModalWithMember(member.memberId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>{t.recordPayment}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-rose-500 font-semibold italic">
                          পরিশোধ বাকি
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table (hidden on mobile, visible on md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3 pl-4">{t.member}</th>
              <th className="p-3">{lang === 'bn' ? 'মাস' : 'Month'}</th>
              <th className="p-3 text-right">{t.assignedAmount}</th>
              <th className="p-3 text-right">{t.paidAmount}</th>
              <th className="p-3 text-right">{t.dueAmount}</th>
              <th className="p-3">{t.paymentDate}</th>
              <th className="p-3 text-center">{t.statusField}</th>
              <th className="p-3 pr-4 text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                  কোনো তথ্য পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filteredRecords.map(({ member, payment, assigned, paid, due, date, status, method }) => (
                <tr 
                  key={member.id} 
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                    status === 'due' ? 'bg-rose-50/15 dark:bg-rose-950/10' : ''
                  }`}
                >
                  {/* Member info */}
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{member.memberId}</span>
                          <span>•</span>
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Month */}
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                    {formatMonthYear(selectedMonth, lang)}
                  </td>

                  {/* Assigned Amount */}
                  <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(assigned, lang)}
                  </td>

                  {/* Paid Amount */}
                  <td className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(paid, lang)}
                    {method && (
                      <span className="block text-[10px] uppercase font-normal text-slate-400">
                        {method}
                      </span>
                    )}
                  </td>

                  {/* Due Amount */}
                  <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatCurrency(due, lang)}
                  </td>

                  {/* Payment Date */}
                  <td className="p-3 text-slate-500">
                    {date ? formatDisplayDate(date, lang) : '—'}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : status === 'partial'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {status === 'paid' ? t.paid : status === 'partial' ? t.partial : t.due}
                    </span>
                  </td>

                  {/* Actions & Receipt */}
                  <td className="p-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {payment ? (
                        <>
                          <button
                            onClick={() => onOpenReceipt(payment)}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                            title={t.printReceipt}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'রসিদ' : 'Receipt'}</span>
                          </button>
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => setDeletingPaymentId(payment.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="পেমেন্ট রেকর্ড মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        currentUser.role === 'admin' ? (
                          <button
                            onClick={() => openRecordModalWithMember(member.memberId)}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>{t.recordPayment}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            বকেয়া
                          </span>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  {t.recordPayment}
                </h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.member} নির্বাচন করুন *
                </label>
                <select
                  value={newPayMemberId}
                  onChange={(e) => {
                    setNewPayMemberId(e.target.value);
                    const target = members.find(m => m.memberId === e.target.value);
                    if (target) setNewPayAmount(target.monthlyFee);
                  }}
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.memberId}>
                      {m.name} ({m.memberId}) - চাঁদা: {m.monthlyFee}৳
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.selectMonth} *
                  </label>
                  <input
                    type="month"
                    value={newPayMonth}
                    onChange={(e) => setNewPayMonth(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.paidAmount} (৳) *
                  </label>
                  <input
                    type="number"
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(Number(e.target.value))}
                    required
                    min="1"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-emerald-700 dark:text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.paymentMethod} *
                  </label>
                  <select
                    value={newPayMethod}
                    onChange={(e) => setNewPayMethod(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="cash">{t.cash}</option>
                    <option value="bkash">{t.bkash}</option>
                    <option value="nagad">{t.nagad}</option>
                    <option value="bank">{t.bank}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.paymentDate} *
                  </label>
                  <input
                    type="date"
                    value={newPayDate}
                    onChange={(e) => setNewPayDate(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  নোট / ট্রানজেকশন রেফারেন্স
                </label>
                <input
                  type="text"
                  value={newPayNotes}
                  onChange={(e) => setNewPayNotes(e.target.value)}
                  placeholder="যেমন: নগদ গ্রহণ / বিকাশ TrxID"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Due Preview Badge */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">নির্ধারিত চাঁদা: {formatCurrency(assignedMonthlyFee, lang)}</span>
                <span className="font-bold text-rose-600">
                  বকেয়া থাকবে: {formatCurrency(Math.max(0, assignedMonthlyFee - newPayAmount), lang)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t.recordPayment} ও রসিদ তৈরি
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingPaymentId}
        title="পেমেন্ট রেকর্ড বাতিল"
        message="আপনি কি এই চাঁদা গ্রহণের রেকর্ডটি মুছে ফেলতে চান?"
        onConfirm={() => {
          if (deletingPaymentId) {
            deletePayment(deletingPaymentId);
            setDeletingPaymentId(null);
          }
        }}
        onCancel={() => setDeletingPaymentId(null)}
      />
    </div>
  );
};
