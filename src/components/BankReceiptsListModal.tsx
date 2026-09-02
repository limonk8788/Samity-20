import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatMonthYear } from '../utils/translations';
import { X, Check, XCircle, Image as ImageIcon, ExternalLink, Clock } from 'lucide-react';
import { BankReceipt } from '../types';

interface BankReceiptsListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankReceiptsListModal: React.FC<BankReceiptsListModalProps> = ({ isOpen, onClose }) => {
  const { lang, bankReceipts, updateBankReceiptStatus } = useApp();
  const t = translations[lang];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  if (!isOpen) return null;

  const filteredReceipts = bankReceipts.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
              {t.bankReceipts} ({bankReceipts.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              সদস্যদের জমা দেওয়া ব্যাংক ডিপোজিট ও বিকাশ স্লিপ যাচাই এবং অনুমোদন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.all} ({bankReceipts.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.pending} ({bankReceipts.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.approved} ({bankReceipts.filter(r => r.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t.rejected} ({bankReceipts.filter(r => r.status === 'rejected').length})
          </button>
        </div>

        {/* List Table / Cards */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredReceipts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              কোনো রসিদ পাওয়া যায়নি
            </div>
          ) : (
            filteredReceipts.map((receipt) => (
              <div key={receipt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Receipt Image Thumbnail */}
                  {receipt.receiptImageUrl ? (
                    <div 
                      onClick={() => setSelectedImage(receipt.receiptImageUrl || null)}
                      className="cursor-pointer group relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                    >
                      <img
                        src={receipt.receiptImageUrl}
                        alt="Receipt"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {receipt.memberName}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {receipt.memberId}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        receipt.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : receipt.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {receipt.status === 'approved' ? t.approved : receipt.status === 'rejected' ? t.rejected : t.pending}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-0.5">
                      <p>
                        <span className="font-medium text-slate-700 dark:text-slate-300">চাঁদার মাস:</span> {formatMonthYear(receipt.month, lang)} • <span className="font-medium text-slate-700 dark:text-slate-300">জমার তারিখ:</span> {receipt.depositDate}
                      </p>
                      <p>
                        <span className="font-medium text-slate-700 dark:text-slate-300">মাধ্যম:</span> {receipt.paymentMethod === 'bank_deposit' ? `ব্যাংক (${receipt.bankName})` : receipt.paymentMethod.toUpperCase()} • <span className="font-medium text-slate-700 dark:text-slate-300">স্লিপ/TrxID:</span> <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{receipt.transactionIdOrSlipNo}</span>
                      </p>
                      {receipt.reviewNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          নোট: {receipt.reviewNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Admin Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(receipt.amount, lang)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      আপলোড: {receipt.submittedAt}
                    </div>
                  </div>

                  {receipt.status === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateBankReceiptStatus(receipt.id, 'approved', 'অনুমোদিত')}
                        className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                        title="অনুমোদন করুন"
                      >
                        <Check className="w-4 h-4" />
                        <span>অনুমোদন</span>
                      </button>
                      <button
                        onClick={() => updateBankReceiptStatus(receipt.id, 'rejected', 'তথ্য মেলেনি')}
                        className="p-1.5 px-2.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="বাতিল করুন"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>বাতিল</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Large Image Preview Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl overflow-hidden p-2">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged Slip"
                className="max-h-[80vh] w-auto object-contain mx-auto rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
