import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { X, Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface BankReceiptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankReceiptUploadModal: React.FC<BankReceiptUploadModalProps> = ({ isOpen, onClose }) => {
  const { lang, currentUser, currentMemberData, settings, submitBankReceipt } = useApp();
  const t = translations[lang];

  const currentYearMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-09"

  const [month, setMonth] = useState(currentYearMonth);
  const [amount, setAmount] = useState<number>(currentMemberData?.monthlyFee || settings.defaultMonthlyFee || 500);
  const [paymentMethod, setPaymentMethod] = useState<'bank_deposit' | 'bkash' | 'nagad'>('bank_deposit');
  const [bankName, setBankName] = useState(settings.bankName);
  const [transactionIdOrSlipNo, setTransactionIdOrSlipNo] = useState('');
  const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setReceiptImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionIdOrSlipNo.trim()) {
      return;
    }

    setIsSubmitting(true);

    submitBankReceipt({
      memberId: currentMemberData?.memberId || currentUser.memberId || 'CA-001',
      memberName: currentMemberData?.name || currentUser.name,
      memberPhone: currentMemberData?.phone || currentUser.phone || '',
      amount: Number(amount),
      month,
      paymentMethod,
      bankName: paymentMethod === 'bank_deposit' ? bankName : paymentMethod === 'bkash' ? 'bKash' : 'Nagad',
      transactionIdOrSlipNo,
      depositDate,
      receiptImageUrl: imagePreview || receiptImageUrl,
    });

    setIsSubmitting(false);
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {t.uploadReceipt}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.uploadSlipNotice}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">
              {lang === 'bn' ? 'রসিদ সফলভাবে আপলোড হয়েছে!' : 'Receipt Uploaded Successfully!'}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {lang === 'bn' ? 'এডমিন যাচাই করে অনুমোদন করলে আপনার চাঁদা পরিশোধিত তালিকায় যুক্ত হবে।' : 'Admin will review and approve your deposit.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Association Bank Reference Box */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">
                {t.associationAccountDetails}:
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <span className="font-medium">ব্যাংক:</span> {settings.bankName} | হিসাব: {settings.bankAccountNumber}
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <span className="font-medium">বিকাশ/নগদ:</span> {settings.bkashNumber}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.selectMonth} *
                </label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.paidAmount} (৳) *
                </label>
                <input
                  type="number"
                  min="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.paymentMethod} *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="bank_deposit">{t.bank}</option>
                  <option value="bkash">{t.bkash}</option>
                  <option value="nagad">{t.nagad}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.depositDate} *
                </label>
                <input
                  type="date"
                  value={depositDate}
                  onChange={(e) => setDepositDate(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {paymentMethod === 'bank_deposit' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bankNameField}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="যেমন: ডাচ-বাংলা ব্যাংক লিমিটেড"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.slipNo} *
              </label>
              <input
                type="text"
                value={transactionIdOrSlipNo}
                onChange={(e) => setTransactionIdOrSlipNo(e.target.value)}
                placeholder={paymentMethod === 'bank_deposit' ? 'ব্যাংক জমার স্লিপ নম্বর' : 'বিকাশ / নগদ TrxID (যেমন: 9JH7261A9)'}
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Voucher Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.uploadVoucherImage}
              </label>
              <div className="mt-1 flex justify-center px-4 pt-3 pb-4 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:border-emerald-500 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview || receiptImageUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || receiptImageUrl}
                        alt="Receipt preview"
                        className="h-28 w-auto object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        প্রিভিউ
                      </span>
                    </div>
                  ) : (
                    <ImageIcon className="mx-auto h-8 w-8 text-slate-400" />
                  )}
                  <div className="flex text-xs text-slate-600 dark:text-slate-400 justify-center">
                    <label className="relative cursor-pointer rounded-md font-semibold text-emerald-600 hover:text-emerald-500">
                      <span>ছবি নির্বাচন করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400">PNG, JPG, JPEG সর্বোচ্চ 5MB</p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
              >
                {t.save}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
