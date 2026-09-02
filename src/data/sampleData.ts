import { Member, Payment, Transaction, Notice, BankReceipt, AppSettings, User } from '../types';

export const initialSettings: AppSettings = {
  associationNameBn: 'সমিতি',
  associationNameEn: 'Samity',
  taglineBn: 'পারস্পরিক ঐক্য, কল্যাণ ও সার্বিক সহযোগিতায় নিবেদিত',
  taglineEn: 'Dedicated to unity, welfare and mutual cooperation',
  address: 'বাড়ি #২৮, রোড #৭/এ, ধানমন্ডি আ/এ, ঢাকা-১২০৯',
  phone: '+৮৮০ ১৭ ১২৩৪ ৫৬৭৮',
  email: 'info@samity.org',
  defaultMonthlyFee: 500,
  bankName: 'ডাচ-বাংলা ব্যাংক লিমিটেড (DBBL)',
  bankAccountName: 'সমিতি সাধারণ তহবিল',
  bankAccountNumber: '115.120.0049281',
  bankBranch: 'ধানমন্ডি শাখা, ঢাকা',
  bkashNumber: '01712-345678 (মার্চেন্ট)',
  nagadNumber: '01812-345678 (মার্চেন্ট)',
  currencySymbol: '৳'
};

export const defaultUsers: User[] = [
  {
    id: 'user-admin',
    name: 'মোঃ রেজাউল করিম (এডমিন)',
    email: 'admin@samity.org',
    role: 'admin',
    phone: '01711223344',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-mem-1',
    name: 'মোঃ রফিকুল ইসলাম',
    email: 'rafiqul@gmail.com',
    role: 'member',
    memberId: 'CA-001',
    phone: '01711998877',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialMembers: Member[] = [
  {
    id: 'mem-1',
    memberId: 'CA-001',
    name: 'মোঃ রফিকুল ইসলাম',
    phone: '01711-998877',
    email: 'rafiqul@gmail.com',
    address: 'বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা',
    profession: 'সিনিয়র কেয়ারটেকার (গ্রিন ভিউ অ্যাপার্ট.)',
    designation: 'সাধারণ সম্পাদক',
    joiningDate: '2023-01-15',
    monthlyFee: 500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B+'
  },
  {
    id: 'mem-2',
    memberId: 'CA-002',
    name: 'আব্দুল মান্নান শিকদার',
    phone: '01819-223344',
    email: 'mannan.sikder@gmail.com',
    address: 'প্লট #৪৫, ব্লক #সি, লালমাটিয়া, ঢাকা',
    profession: 'কেয়ারটেকার ও সুপারভাইজার',
    designation: 'সহ-সভাপতি',
    joiningDate: '2023-02-10',
    monthlyFee: 500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+'
  },
  {
    id: 'mem-3',
    memberId: 'CA-003',
    name: 'মোসাঃ ফাতেমা বেগম',
    phone: '01912-334455',
    email: 'fatema.begum@yahoo.com',
    address: 'বাড়ি #৮/বি, লেক সার্কাস, কলাবাগান, ঢাকা',
    profession: 'মহিলা কেয়ারটেকার ও হোস্টেল ইনচার্জ',
    designation: 'সদস্য',
    joiningDate: '2023-05-20',
    monthlyFee: 500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'A+'
  },
  {
    id: 'mem-4',
    memberId: 'CA-004',
    name: 'মোঃ আবুল হোসেন',
    phone: '01678-445566',
    email: 'abul.hossain@gmail.com',
    address: 'বাড়ি #৩, রোড #১১, সোবহানবাগ, ঢাকা',
    profession: 'কেয়ারটেকার (সানরাইজ টাওয়ার)',
    designation: 'কোষাধ্যক্ষ',
    joiningDate: '2023-03-01',
    monthlyFee: 500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'AB+'
  },
  {
    id: 'mem-5',
    memberId: 'CA-005',
    name: 'সেলিম শিকদার',
    phone: '01720-556677',
    email: 'selim.care@gmail.com',
    address: 'বাড়ি #৯১, শুক্রাবাদ, ধানমন্ডি, ঢাকা',
    profession: 'কেয়ারটেকার ও ইলেকট্রিশিয়ান',
    designation: 'সাংগঠনিক সম্পাদক',
    joiningDate: '2023-06-18',
    monthlyFee: 500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'O+'
  },
  {
    id: 'mem-6',
    memberId: 'CA-006',
    name: 'মোস্তফা কামাল',
    phone: '01988-112233',
    email: 'mostafa.kamal@gmail.com',
    address: 'বাড়ি #১৪, রোড #২, জিগাতলা, ঢাকা',
    profession: 'কেয়ারটেকার',
    designation: 'সদস্য',
    joiningDate: '2023-09-01',
    monthlyFee: 500,
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B-'
  }
];

export const initialPayments: Payment[] = [
  // Current Month: September 2026
  {
    id: 'pay-001',
    receiptNumber: 'RCP-202609-001',
    memberId: 'CA-001',
    memberName: 'মোঃ রফিকুল ইসলাম',
    month: '2026-09',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-09-01',
    paymentMethod: 'cash',
    status: 'paid',
    receivedBy: 'মোঃ রেজাউল করিম (এডমিন)',
    notes: 'সময়মতো পরিশোধিত'
  },
  {
    id: 'pay-002',
    receiptNumber: 'RCP-202609-002',
    memberId: 'CA-002',
    memberName: 'আব্দুল মান্নান শিকদার',
    month: '2026-09',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-09-02',
    paymentMethod: 'bkash',
    status: 'paid',
    receivedBy: 'মোঃ আবুল হোসেন (কোষাধ্যক্ষ)',
    notes: 'বিকাশ TrxID: 9JH7261A9'
  },
  {
    id: 'pay-003',
    receiptNumber: 'RCP-202609-003',
    memberId: 'CA-003',
    memberName: 'মোসাঃ ফাতেমা বেগম',
    month: '2026-09',
    assignedAmount: 500,
    paidAmount: 300,
    dueAmount: 200,
    paymentDate: '2026-09-02',
    paymentMethod: 'cash',
    status: 'partial',
    receivedBy: 'মোঃ রেজাউল করিম (এডমিন)',
    notes: 'বাকি ২০০ টাকা আগামী সপ্তাহে দিবেন'
  },
  {
    id: 'pay-004',
    receiptNumber: 'RCP-202609-004',
    memberId: 'CA-004',
    memberName: 'মোঃ আবুল হোসেন',
    month: '2026-09',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-09-01',
    paymentMethod: 'bank',
    status: 'paid',
    receivedBy: 'ডাচ-বাংলা ব্যাংক জমা',
    notes: 'ব্যাংক ডিপোজিট স্লিপ #DBBL-8812'
  },
  // Previous Month: August 2026
  {
    id: 'pay-005',
    receiptNumber: 'RCP-202608-001',
    memberId: 'CA-001',
    memberName: 'মোঃ রফিকুল ইসলাম',
    month: '2026-08',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-08-05',
    paymentMethod: 'cash',
    status: 'paid',
    receivedBy: 'মোঃ রেজাউল করিম'
  },
  {
    id: 'pay-006',
    receiptNumber: 'RCP-202608-002',
    memberId: 'CA-002',
    memberName: 'আব্দুল মান্নান শিকদার',
    month: '2026-08',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-08-04',
    paymentMethod: 'bkash',
    status: 'paid',
    receivedBy: 'মোঃ আবুল হোসেন'
  },
  {
    id: 'pay-007',
    receiptNumber: 'RCP-202608-003',
    memberId: 'CA-003',
    memberName: 'মোসাঃ ফাতেমা বেগম',
    month: '2026-08',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-08-10',
    paymentMethod: 'cash',
    status: 'paid',
    receivedBy: 'মোঃ রেজাউল করিম'
  },
  {
    id: 'pay-008',
    receiptNumber: 'RCP-202608-004',
    memberId: 'CA-005',
    memberName: 'সেলিম শিকদার',
    month: '2026-08',
    assignedAmount: 500,
    paidAmount: 500,
    dueAmount: 0,
    paymentDate: '2026-08-02',
    paymentMethod: 'cash',
    status: 'paid',
    receivedBy: 'মোঃ আবুল হোসেন'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'trx-001',
    type: 'income',
    category: 'chanda',
    description: 'সেপ্টেম্বর ২০২৬ মাসিক চাঁদা আদায় (৪ সদস্য)',
    amount: 1800,
    date: '2026-09-02',
    addedBy: 'কোষাধ্যক্ষ',
    voucherNo: 'INC-202609-01'
  },
  {
    id: 'trx-002',
    type: 'income',
    category: 'donation',
    description: 'বাড়ি মালিক সমিতির পক্ষ থেকে কল্যাণ অনুদান',
    amount: 10000,
    date: '2026-08-25',
    addedBy: 'সভাপতি',
    voucherNo: 'DON-2026-04'
  },
  {
    id: 'trx-003',
    type: 'income',
    category: 'chanda',
    description: 'আগস্ট ২০২৬ চাঁদা সংগ্রহ',
    amount: 2500,
    date: '2026-08-15',
    addedBy: 'কোষাধ্যক্ষ',
    voucherNo: 'INC-202608-01'
  },
  {
    id: 'trx-004',
    type: 'income',
    category: 'other_income',
    description: 'নতুন সদস্য ফরম ও কল্যাণ তহবিল ফি',
    amount: 1500,
    date: '2026-08-05',
    addedBy: 'সাধারণ সম্পাদক',
    voucherNo: 'INC-202608-02'
  },
  // Expenses
  {
    id: 'trx-101',
    type: 'expense',
    category: 'office',
    description: 'অফিস খাতা, রেজিস্টার ও প্রিন্টিং রসিদ বই ক্রয়',
    amount: 1200,
    date: '2026-09-01',
    addedBy: 'কোষাধ্যক্ষ',
    voucherNo: 'EXP-202609-01'
  },
  {
    id: 'trx-102',
    type: 'expense',
    category: 'electricity',
    description: 'সমিতি কার্যালয় বিদ্যুৎ বিল (আগস্ট)',
    amount: 850,
    date: '2026-08-28',
    addedBy: 'কোষাধ্যক্ষ',
    voucherNo: 'EXP-202608-02'
  },
  {
    id: 'trx-103',
    type: 'expense',
    category: 'repair',
    description: 'সমিতি রুমের ফ্যান ও লাইট মেরামত',
    amount: 650,
    date: '2026-08-20',
    addedBy: 'সাংগঠনিক সম্পাদক',
    voucherNo: 'EXP-202608-01'
  },
  {
    id: 'trx-104',
    type: 'expense',
    category: 'other_expense',
    description: 'মাসিক সাধারণ সভার চা ও নাস্তা খরচ',
    amount: 900,
    date: '2026-08-15',
    addedBy: 'সাধারণ সম্পাদক',
    voucherNo: 'EXP-202608-03'
  }
];

export const initialNotices: Notice[] = [
  {
    id: 'not-001',
    title: 'সেপ্টেম্বর মাসের সাধারণ সভা ও চাঁদা জমাদানের আহ্বান',
    description: 'আগামী ১০ সেপ্টেম্বর ২০২৬, রোজ বৃহস্পতিবার বাদ মাগরিব সমিতি কার্যালয়ে আমাদের মাসিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যকে বকেয়া চাঁদা পরিশোধপূর্বক সভায় যথাসময়ে উপস্থিত থাকার অনুরোধ করা যাচ্ছে।',
    date: '2026-09-01',
    publishedBy: 'মোঃ রেজাউল করিম (এডমিন)',
    isImportant: true,
    targetAudience: 'all'
  },
  {
    id: 'not-002',
    title: 'ব্যাংক একাউন্ট অথবা বিকাশে চাঁদা পরিশোধের নিয়মাবলী',
    description: 'সদস্যবৃন্দ সমিতির ডাচ-বাংলা ব্যাংক একাউন্টে অথবা মার্চেন্ট বিকাশ নম্বরে সরাসরি চাঁদা জমা দিয়ে অ্যাপের মাধ্যমে ডিপোজিট স্লিপ আপলোড করতে পারবেন। কোষাধ্যক্ষ রসিদ যাচাই করে অনুমোদন করবেন।',
    date: '2026-08-28',
    publishedBy: 'মোঃ আবুল হোসেন (কোষাধ্যক্ষ)',
    isImportant: false,
    targetAudience: 'all'
  },
  {
    id: 'not-003',
    title: 'সমিতির রাত্রিকালীন নিরাপত্তা ও দায়িত্ব বণ্টন',
    description: 'এলাকার নিরাপত্তা নিশ্চিতকরণে গভীর রাতে পাহারা এবং সিসিটিভি ক্যামেরা সচল রাখার নির্দেশ দেওয়া হয়েছে। কারো কোনো প্রযুক্তিগত সহায়তা লাগলে সমিতি অফিসে অবহিত করুন।',
    date: '2026-08-18',
    publishedBy: 'মোঃ রফিকুল ইসলাম (সাধারণ সম্পাদক)',
    isImportant: true,
    targetAudience: 'all'
  }
];

export const initialBankReceipts: BankReceipt[] = [
  {
    id: 'br-001',
    memberId: 'CA-004',
    memberName: 'মোঃ আবুল হোসেন',
    memberPhone: '01678-445566',
    amount: 500,
    month: '2026-09',
    paymentMethod: 'bank_deposit',
    transactionIdOrSlipNo: 'DBBL-DEP-8812',
    bankName: 'ডাচ-বাংলা ব্যাংক, ধানমন্ডি শাখা',
    depositDate: '2026-09-01',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    submittedAt: '2026-09-01 11:30 AM',
    reviewedBy: 'এডমিন',
    reviewNote: 'ব্যাংক হিসাব যাচাই করে গ্রহণ করা হলো।'
  },
  {
    id: 'br-002',
    memberId: 'CA-005',
    memberName: 'সেলিম শিকদার',
    memberPhone: '01720-556677',
    amount: 500,
    month: '2026-09',
    paymentMethod: 'bkash',
    transactionIdOrSlipNo: 'BK-99881122AA',
    bankName: 'bKash Merchant',
    depositDate: '2026-09-02',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    submittedAt: '2026-09-02 02:15 PM'
  }
];
