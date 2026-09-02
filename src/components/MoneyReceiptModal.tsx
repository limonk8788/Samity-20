import React, { useRef } from 'react';
import { Payment } from '../types';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate, formatMonthYear } from '../utils/translations';
import { Printer, Download, X, Building2, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface MoneyReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const MoneyReceiptModal: React.FC<MoneyReceiptModalProps> = ({ payment, onClose }) => {
  const { lang, settings } = useApp();
  const t = translations[lang];
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Receipt_${payment.receiptNumber}_${payment.memberId}.png`;
      a.click();
    } catch (err) {
      console.error('Error generating image', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Actions Bar (No Print) */}
        <div className="no-print p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
              {payment.receiptNumber}
            </span>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              {t.moneyReceipt}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printReceipt}</span>
            </button>
            <button
              onClick={handleDownloadPng}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadPng}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="overflow-y-auto p-2 sm:p-8 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div 
            ref={receiptRef}
            id="printable-receipt-card"
            className="w-full max-w-xl bg-white text-slate-900 p-4 sm:p-8 rounded-xl shadow-lg border border-emerald-800/20 relative"
            style={{ minHeight: '500px' }}
          >
            {/* Watermark Background Stamp */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <Building2 className="w-72 h-72 text-emerald-900" />
            </div>

            {/* Receipt Header */}
            <div className="border-b-2 border-emerald-700 pb-4 text-center relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-900 tracking-tight">
                  {lang === 'bn' ? settings.associationNameBn : settings.associationNameEn}
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                {settings.address} • ফোন: {settings.phone}
              </p>
              <div className="mt-3 inline-block bg-emerald-700 text-white font-bold text-xs uppercase px-4 py-1 rounded-full tracking-wider shadow-xs">
                {lang === 'bn' ? 'চাঁদা জমার মানি রসিদ (Money Receipt)' : 'Official Money Receipt'}
              </div>
            </div>

            {/* Receipt Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 my-4 text-xs">
              <div className="space-y-1">
                <p>
                  <span className="text-slate-500">{t.receiptNumber}:</span>{' '}
                  <span className="font-bold text-emerald-800">{payment.receiptNumber}</span>
                </p>
                <p>
                  <span className="text-slate-500">{t.memberId}:</span>{' '}
                  <span className="font-bold">{payment.memberId}</span>
                </p>
                <p>
                  <span className="text-slate-500">{t.name}:</span>{' '}
                  <span className="font-bold text-sm text-slate-900">{payment.memberName}</span>
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p>
                  <span className="text-slate-500">{t.paymentDate}:</span>{' '}
                  <span className="font-bold">{formatDisplayDate(payment.paymentDate, lang)}</span>
                </p>
                <p>
                  <span className="text-slate-500">{t.chanda} ({lang === 'bn' ? 'মাস' : 'Month'}):</span>{' '}
                  <span className="font-bold text-emerald-700">{formatMonthYear(payment.month, lang)}</span>
                </p>
                <p>
                  <span className="text-slate-500">{t.paymentMethod}:</span>{' '}
                  <span className="font-semibold uppercase text-slate-700">{payment.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Payment Details Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden my-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">{lang === 'bn' ? 'বিবরণ' : 'Description'}</th>
                    <th className="p-2.5 text-right">{t.assignedAmount}</th>
                    <th className="p-2.5 text-right">{t.paidAmount}</th>
                    <th className="p-2.5 text-right">{t.dueAmount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-800">
                      {lang === 'bn' ? 'মাসিক সাধারণ চাঁদা' : 'Monthly Member Chanda'} - {formatMonthYear(payment.month, lang)}
                      {payment.notes && <div className="text-[11px] text-slate-500">{payment.notes}</div>}
                    </td>
                    <td className="p-2.5 text-right font-medium">{formatCurrency(payment.assignedAmount, lang)}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{formatCurrency(payment.paidAmount, lang)}</td>
                    <td className="p-2.5 text-right font-medium text-rose-600">{formatCurrency(payment.dueAmount, lang)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-emerald-50/70 border-t border-slate-200 font-bold">
                  <tr>
                    <td colSpan={2} className="p-2.5 text-emerald-950 font-bold">
                      {lang === 'bn' ? 'মোট প্রাপ্ত অর্থ:' : 'Total Received:'}
                    </td>
                    <td className="p-2.5 text-right text-base text-emerald-700 font-black">
                      {formatCurrency(payment.paidAmount, lang)}
                    </td>
                    <td className="p-2.5 text-right text-rose-700">
                      {formatCurrency(payment.dueAmount, lang)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Status & Verification Seal */}
            <div className="flex items-center justify-between my-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800">
                    {payment.status === 'paid' ? t.paid : payment.status === 'partial' ? t.partial : t.due}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {lang === 'bn' ? 'সিস্টেমে সংরক্ষিত ও যাচাইকৃত' : 'Digitally recorded & verified'}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-[10px] text-slate-500">{t.receivedBy}:</div>
                <div className="font-bold text-slate-800 underline decoration-dotted">
                  {payment.receivedBy || 'কোষাধ্যক্ষ / এডমিন'}
                </div>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="mt-12 pt-4 border-t border-dashed border-slate-300 grid grid-cols-2 text-center text-xs text-slate-600">
              <div>
                <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                <span>{lang === 'bn' ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}</span>
              </div>
              <div>
                <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                <span className="font-semibold text-emerald-800">{lang === 'bn' ? 'কোষাধ্যক্ষ / এডমিন স্বাক্ষর' : 'Authorized Signature'}</span>
              </div>
            </div>

            <div className="mt-6 text-center text-[10px] text-slate-400">
              {lang === 'bn' ? `${settings.associationNameBn} অটোমেটেড কম্পিউটার জেনারেটেড রসিদ।` : `Automated system receipt generated by ${settings.associationNameEn}.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
