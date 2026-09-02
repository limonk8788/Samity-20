export type Role = 'admin' | 'member';

export type Language = 'bn' | 'en';

export type Theme = 'light' | 'dark';

export type PaymentStatus = 'paid' | 'partial' | 'due';

export type IncomeCategory = 'chanda' | 'donation' | 'other_income';

export type ExpenseCategory = 'office' | 'salary' | 'electricity' | 'repair' | 'other_expense';

export type ReceiptStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  memberId?: string;
  phone?: string;
  avatar?: string;
}

export interface Member {
  id: string; // internal UUID or string
  memberId: string; // e.g. "CA-001"
  name: string;
  phone: string;
  email: string;
  address: string; // Building / Flat / Area
  profession: string;
  designation?: string; // Association role e.g. General Member, President, Cashier
  joiningDate: string; // YYYY-MM-DD
  monthlyFee: number; // Monthly Chanda amount (e.g. 500)
  status: 'active' | 'inactive';
  avatar?: string;
  nationalId?: string;
  bloodGroup?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string; // e.g. "RCP-2026-001"
  memberId: string;
  memberName: string;
  month: string; // e.g. "2026-09"
  assignedAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMethod: 'cash' | 'bank' | 'bkash' | 'nagad' | 'other';
  status: PaymentStatus;
  receivedBy: string; // Admin name
  notes?: string;
  bankReceiptId?: string;
}

export interface BankReceipt {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  amount: number;
  month: string; // e.g. "2026-09"
  paymentMethod: 'bank_deposit' | 'bkash' | 'nagad';
  transactionIdOrSlipNo: string;
  bankName?: string;
  depositDate: string;
  receiptImageUrl?: string;
  status: ReceiptStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: IncomeCategory | ExpenseCategory;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  addedBy: string; // Name of admin
  voucherNo?: string;
  referenceId?: string; // if linked to a payment
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  publishedBy: string;
  isImportant: boolean;
  targetAudience: 'all' | 'members' | 'caretakers';
}

export interface AppSettings {
  associationNameBn: string;
  associationNameEn: string;
  taglineBn: string;
  taglineEn: string;
  address: string;
  phone: string;
  email: string;
  defaultMonthlyFee: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  bkashNumber: string;
  nagadNumber: string;
  currencySymbol: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'notice' | 'payment' | 'due' | 'receipt';
}
