import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate } from '../utils/translations';
import { 
  Receipt, TrendingUp, TrendingDown, Wallet, PlusCircle, 
  Search, Filter, Trash2, Calendar, User, FileSpreadsheet, X 
} from 'lucide-react';
import { Transaction, IncomeCategory, ExpenseCategory } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

interface AccountsViewProps {
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ 
  isAddModalOpen = false, 
  onCloseAddModal 
}) => {
  const { lang, transactions, addTransaction, deleteTransaction, currentUser } = useApp();
  const t = translations[lang];

  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Internal modal control
  const [modalOpen, setModalOpen] = useState(isAddModalOpen);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  // Form
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: 'chanda' as IncomeCategory | ExpenseCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    voucherNo: '',
    addedBy: currentUser.name
  });

  const openAddIncome = () => {
    setModalType('income');
    setFormData({
      type: 'income',
      category: 'donation',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      voucherNo: `INC-${Date.now().toString().slice(-4)}`,
      addedBy: currentUser.name
    });
    setModalOpen(true);
  };

  const openAddExpense = () => {
    setModalType('expense');
    setFormData({
      type: 'expense',
      category: 'office',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      voucherNo: `EXP-${Date.now().toString().slice(-4)}`,
      addedBy: currentUser.name
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    addTransaction({
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      addedBy: formData.addedBy || currentUser.name,
      voucherNo: formData.voucherNo
    });

    setModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Calculation: মোট আয় - মোট ব্যয় = বর্তমান ব্যালেন্স
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesType = typeFilter === 'all' ? true : tx.type === typeFilter;
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.voucherNo && tx.voucherNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.addedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth ? tx.date.startsWith(selectedMonth) : true;

    return matchesType && matchesSearch && matchesMonth;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'chanda': return t.chandaIncome;
      case 'donation': return t.donationIncome;
      case 'other_income': return t.otherIncome;
      case 'office': return t.officeExpense;
      case 'salary': return t.salaryExpense;
      case 'electricity': return t.electricityExpense;
      case 'repair': return t.repairExpense;
      case 'other_expense': return t.otherExpense;
      default: return category;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Title & Add Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.accounts}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {lang === 'bn' 
              ? 'সমিতির সকল আয়, ব্যয় ও সার্বিক তহবিলের স্বচ্ছ হিসাব'
              : 'Samity Income & Expense book and real-time ledger'}
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={openAddIncome}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addIncome}</span>
            </button>
            <button
              onClick={openAddExpense}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addExpense}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Overview Formula Cards: মোট আয় - মোট ব্যয় = বর্তমান ব্যালেন্স */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t.totalIncome} (+)
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome, lang)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              চাঁদা ও অনুদান তহবিল
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expense */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-950/60 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t.totalExpense} (-)
            </span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(totalExpense, lang)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              অফিস, বেতন ও মেরামত
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Current Total Balance */}
        <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider block mb-1">
              {t.currentBalance} (=)
            </span>
            <span className="text-2xl font-black text-white">
              {formatCurrency(netBalance, lang)}
            </span>
            <span className="text-[11px] text-emerald-100 block mt-0.5">
              মোট আয় - মোট ব্যয়
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-xs">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="বিবরণ, ভাউচার নং বা নাম দিয়ে খুঁজুন..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Type Filter */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${typeFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1 rounded-md transition-colors ${typeFilter === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              {t.income}
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1 rounded-md transition-colors ${typeFilter === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500'}`}
            >
              {t.expense}
            </button>
          </div>

          {/* Month filter */}
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Transaction List Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Mobile View (Touch friendly cards) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              কোনো লেনদেন পাওয়া যায়নি
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={`mobile-tx-${tx.id}`} className="p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {getCategoryLabel(tx.category)}
                      </span>
                      {tx.voucherNo && (
                        <span className="font-mono text-[10px] text-slate-400">
                          #{tx.voucherNo}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mt-1">
                      {tx.description}
                    </div>
                  </div>

                  <div className={`text-right font-black text-sm shrink-0 ${
                    tx.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, lang)}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>{formatDisplayDate(tx.date, lang)}</span>
                    <span>•</span>
                    <span className="text-slate-400 truncate max-w-[120px]">{tx.addedBy}</span>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setDeletingTxId(tx.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
              <th className="p-3 pl-4">{t.date}</th>
              <th className="p-3">{t.category}</th>
              <th className="p-3">{t.description}</th>
              <th className="p-3">{t.voucherNo}</th>
              <th className="p-3">{t.addedBy}</th>
              <th className="p-3 text-right">{t.amount}</th>
              {currentUser.role === 'admin' && <th className="p-3 pr-4 text-right">{t.actions}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                  কোনো লেনদেন পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 pl-4 text-slate-700 dark:text-slate-300 font-medium">
                    {formatDisplayDate(tx.date, lang)}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {getCategoryLabel(tx.category)}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-900 dark:text-white max-w-xs">
                    {tx.description}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">
                    {tx.voucherNo || '—'}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {tx.addedBy}
                  </td>
                  <td className={`p-3 text-right font-black text-sm ${
                    tx.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, lang)}
                  </td>
                  {currentUser.role === 'admin' && (
                    <td className="p-3 pr-4 text-right">
                      <button
                        onClick={() => setDeletingTxId(tx.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Add Income / Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {modalType === 'income' ? t.addIncome : t.addExpense}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.category} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {modalType === 'income' ? (
                    <>
                      <option value="chanda">{t.chandaIncome}</option>
                      <option value="donation">{t.donationIncome}</option>
                      <option value="other_income">{t.otherIncome}</option>
                    </>
                  ) : (
                    <>
                      <option value="office">{t.officeExpense}</option>
                      <option value="salary">{t.salaryExpense}</option>
                      <option value="electricity">{t.electricityExpense}</option>
                      <option value="repair">{t.repairExpense}</option>
                      <option value="other_expense">{t.otherExpense}</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.description} *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="যেমন: অফিস খাতা ও প্রিন্টিং খরচ"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.amount} (৳) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.date} *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.voucherNo}
                  </label>
                  <input
                    type="text"
                    value={formData.voucherNo}
                    onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                    placeholder="মেমো বা ভাউচার নম্বর"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.addedBy}
                  </label>
                  <input
                    type="text"
                    value={formData.addedBy}
                    onChange={(e) => setFormData({ ...formData, addedBy: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm ${
                    modalType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingTxId}
        title="লেনদেন বাতিল"
        message="আপনি কি এই আয়/ব্যয় হিসাবটি মুছে ফেলতে চান?"
        onConfirm={() => {
          if (deletingTxId) {
            deleteTransaction(deletingTxId);
            setDeletingTxId(null);
          }
        }}
        onCancel={() => setDeletingTxId(null)}
      />
    </div>
  );
};
