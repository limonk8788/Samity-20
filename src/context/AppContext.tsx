import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Role, Language, Theme, Member, Payment, Transaction, Notice, 
  BankReceipt, AppSettings, User, AppNotification, PaymentStatus,
  IncomeCategory, ExpenseCategory, SubscriptionStatus
} from '../types';
import { 
  initialMembers, initialPayments, initialTransactions, 
  initialNotices, initialBankReceipts, initialSettings, defaultUsers 
} from '../data/sampleData';

interface AppContextType {
  // Config & Preference
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (updated: Partial<User>) => void;
  setRole: (role: Role) => void;
  users: User[];
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  subscriptionStatus: SubscriptionStatus;
  
  // Members
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Payments (Chanda)
  payments: Payment[];
  recordPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => Payment;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  // Bank Receipts
  bankReceipts: BankReceipt[];
  submitBankReceipt: (receipt: Omit<BankReceipt, 'id' | 'status' | 'submittedAt'>) => void;
  updateBankReceiptStatus: (id: string, status: 'approved' | 'rejected', reviewNote?: string) => void;
  
  // Accounts (Income & Expense)
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  
  // Notices
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Helpers & Stats
  resetDemoData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonData: string) => boolean;
  
  // Active member profile helper
  currentMemberData: Member | undefined;
  
  // Active tab/navigation state
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'caretaker_assoc_lang',
  THEME: 'caretaker_assoc_theme',
  USER: 'caretaker_assoc_current_user',
  MEMBERS: 'caretaker_assoc_members',
  PAYMENTS: 'caretaker_assoc_payments',
  TRANSACTIONS: 'caretaker_assoc_transactions',
  NOTICES: 'caretaker_assoc_notices',
  RECEIPTS: 'caretaker_assoc_bank_receipts',
  SETTINGS: 'caretaker_assoc_settings',
  NOTIFICATIONS: 'caretaker_assoc_notifications',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'bn';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
  };

  // Theme
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Current User
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultUsers[0]; // Admin by default
  });

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  };

  const updateCurrentUser = (updatedData: Partial<User>) => {
    setCurrentUserState(prev => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });

    addAppNotification({
      title: lang === 'bn' ? 'প্রোফাইল আপডেট' : 'Profile Updated',
      message: lang === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে।' : 'Profile details updated successfully.',
      type: 'notice'
    });
  };

  const setRole = (role: Role) => {
    if (role === 'admin') {
      const adminUser = defaultUsers.find(u => u.role === 'admin') || defaultUsers[0];
      setCurrentUser(adminUser);
    } else {
      const existingMemberUser = defaultUsers.find(u => u.role === 'member');
      const firstMember = members[0];
      const memberUser: User = existingMemberUser || {
        id: 'user-mem-1',
        name: firstMember?.name || 'সদস্য ইউজার',
        email: firstMember?.email || 'member@example.com',
        role: 'member',
        memberId: firstMember?.memberId || 'CA-001',
        phone: firstMember?.phone || '01700000000',
        avatar: firstMember?.avatar
      };
      setCurrentUser(memberUser);
    }
  };

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        let changed = false;
        if (parsed.associationNameBn === 'কেয়ারটেকার ওয়েলফেয়ার অ্যাসোসিয়েশন' || !parsed.associationNameBn) {
          parsed.associationNameBn = 'সমিতি';
          parsed.associationNameEn = 'Samity';
          changed = true;
        }
        if (!parsed.taglineBn || parsed.taglineBn.includes('পেশাগত')) {
          parsed.taglineBn = 'পারস্পরিক ঐক্য, কল্যাণ ও সার্বিক সহযোগিতায় নিবেদিত';
          parsed.taglineEn = 'Dedicated to unity, welfare and mutual cooperation';
          changed = true;
        }
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return initialSettings;
  });

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  };

  // Members
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialMembers;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: `mem-${Date.now()}`
    };
    setMembers(prev => [newMember, ...prev]);
    
    // Add notification
    addAppNotification({
      title: lang === 'bn' ? 'নতুন সদস্য যোগ হয়েছে' : 'New Member Added',
      message: `${newMember.name} (${newMember.memberId})`,
      type: 'notice'
    });
  };

  const updateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Payments
  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialPayments;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  const recordPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber'>): Payment => {
    const receiptYearMonth = (paymentData.month || '').replace('-', '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const receiptNumber = `RCP-${receiptYearMonth}-${randomSuffix}`;
    
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber
    };

    setPayments(prev => [newPayment, ...prev]);

    // Also automatically register an income transaction in accounts
    const newTx: Transaction = {
      id: `trx-chanda-${Date.now()}`,
      type: 'income',
      category: 'chanda',
      description: `${newPayment.memberName} - ${newPayment.month} চাঁদা জমা (${newPayment.receiptNumber})`,
      amount: newPayment.paidAmount,
      date: newPayment.paymentDate,
      addedBy: newPayment.receivedBy || currentUser.name,
      voucherNo: newPayment.receiptNumber,
      referenceId: newPayment.id
    };
    setTransactions(prev => [newTx, ...prev]);

    // Add Notification
    addAppNotification({
      title: lang === 'bn' ? 'চাঁদা গ্রহণ করা হয়েছে' : 'Chanda Payment Received',
      message: `${newPayment.memberName} - ৳${newPayment.paidAmount} (${newPayment.month})`,
      type: 'payment'
    });

    return newPayment;
  };

  const updatePayment = (id: string, updatedFields: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // Bank Receipts
  const [bankReceipts, setBankReceipts] = useState<BankReceipt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialBankReceipts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(bankReceipts));
  }, [bankReceipts]);

  const submitBankReceipt = (receiptData: Omit<BankReceipt, 'id' | 'status' | 'submittedAt'>) => {
    const now = new Date();
    const newReceipt: BankReceipt = {
      ...receiptData,
      id: `br-${Date.now()}`,
      status: 'pending',
      submittedAt: now.toLocaleString()
    };
    setBankReceipts(prev => [newReceipt, ...prev]);

    addAppNotification({
      title: lang === 'bn' ? 'নতুন ব্যাংক রসিদ আপলোড' : 'New Bank Slip Uploaded',
      message: `${newReceipt.memberName} - ৳${newReceipt.amount} (${newReceipt.transactionIdOrSlipNo})`,
      type: 'receipt'
    });
  };

  const updateBankReceiptStatus = (id: string, status: 'approved' | 'rejected', reviewNote?: string) => {
    const target = bankReceipts.find(b => b.id === id);
    if (!target) return;

    setBankReceipts(prev => prev.map(b => b.id === id ? {
      ...b,
      status,
      reviewedBy: currentUser.name,
      reviewNote: reviewNote || (status === 'approved' ? 'অনুমোদিত' : 'তথ্য গরমিল')
    } : b));

    // If approved, automatically record the payment!
    if (status === 'approved') {
      const existingPay = payments.find(p => p.memberId === target.memberId && p.month === target.month);
      const member = members.find(m => m.memberId === target.memberId);
      const assigned = member ? member.monthlyFee : target.amount;

      if (!existingPay) {
        recordPayment({
          memberId: target.memberId,
          memberName: target.memberName,
          month: target.month,
          assignedAmount: assigned,
          paidAmount: target.amount,
          dueAmount: Math.max(0, assigned - target.amount),
          paymentDate: target.depositDate,
          paymentMethod: target.paymentMethod === 'bank_deposit' ? 'bank' : target.paymentMethod === 'bkash' ? 'bkash' : 'nagad',
          status: target.amount >= assigned ? 'paid' : 'partial',
          receivedBy: currentUser.name,
          notes: `অনুমোদিত ভাউচার: ${target.transactionIdOrSlipNo} (${target.bankName || ''})`,
          bankReceiptId: target.id
        });
      }
    }

    addAppNotification({
      title: status === 'approved' ? (lang === 'bn' ? 'রসিদ অনুমোদিত হয়েছে' : 'Receipt Approved') : (lang === 'bn' ? 'রসিদ বাতিল হয়েছে' : 'Receipt Rejected'),
      message: `${target.memberName} (${target.month}) - ৳${target.amount}`,
      type: 'receipt'
    });
  };

  // Transactions (Income & Expense)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialTransactions;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `trx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Notices
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialNotices;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);

    addAppNotification({
      title: lang === 'bn' ? 'নতুন নোটিশ প্রকাশিত' : 'New Notice Published',
      message: newNotice.title,
      type: 'notice'
    });
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'notif-1',
        title: 'স্বাগতম',
        message: 'সমিতি ম্যানেজমেন্ট সিস্টেমে আপনাকে স্বাগতম।',
        date: '2026-09-02',
        isRead: false,
        type: 'notice'
      },
      {
        id: 'notif-2',
        title: 'ব্যাংক রসিদ পর্যালোচনা',
        message: '১টি নতুন ব্যাংক জমার রসিদ অনুমোদনের অপেক্ষায় আছে।',
        date: '2026-09-02',
        isRead: false,
        type: 'receipt'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const addAppNotification = (item: Omit<AppNotification, 'id' | 'date' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...item,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Active Tab navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Find member profile if user is a member
  const currentMemberData = members.find(m => 
    (currentUser.memberId && m.memberId === currentUser.memberId) ||
    (currentUser.email && m.email === currentUser.email)
  );

  // Database Backup / Reset
  const resetDemoData = () => {
    setMembers(initialMembers);
    setPayments(initialPayments);
    setTransactions(initialTransactions);
    setNotices(initialNotices);
    setBankReceipts(initialBankReceipts);
    setSettings(initialSettings);
    localStorage.clear();
    setLang('bn');
  };

  const exportDatabaseJson = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      members,
      payments,
      transactions,
      notices,
      bankReceipts
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `samity_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDatabaseJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.members) setMembers(parsed.members);
      if (parsed.payments) setPayments(parsed.payments);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.notices) setNotices(parsed.notices);
      if (parsed.bankReceipts) setBankReceipts(parsed.bankReceipts);
      if (parsed.settings) setSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  // Current Month Subscription Status (Paid vs Due)
  const currentMonth = new Date().toISOString().slice(0, 7);

  const subscriptionStatus: SubscriptionStatus = useMemo(() => {
    const activeMembers = members.filter(m => m.status === 'active');
    const paidMembers: Array<Member & { payment?: Payment }> = [];
    const dueMembers: Array<Member & { payment?: Payment }> = [];
    const partialMembers: Array<Member & { payment?: Payment }> = [];

    let totalCollected = 0;
    let totalAssigned = 0;

    activeMembers.forEach(member => {
      const fee = member.monthlyFee || settings.defaultMonthlyFee || 500;
      totalAssigned += fee;

      const memberPayments = payments.filter(
        p => (p.memberId === member.memberId || p.memberName === member.name) && p.month === currentMonth
      );
      const totalPaid = memberPayments.reduce((sum, p) => sum + p.paidAmount, 0);
      const lastPayment = memberPayments[0];

      if (totalPaid >= fee) {
        totalCollected += totalPaid;
        paidMembers.push({ ...member, payment: lastPayment });
      } else if (totalPaid > 0) {
        totalCollected += totalPaid;
        partialMembers.push({ ...member, payment: lastPayment });
        dueMembers.push({ ...member, payment: lastPayment });
      } else {
        dueMembers.push({ ...member, payment: undefined });
      }
    });

    return {
      currentMonth,
      paidMembers,
      dueMembers,
      partialMembers,
      paidCount: paidMembers.length,
      dueCount: dueMembers.length,
      totalAssigned,
      totalCollected
    };
  }, [members, payments, settings.defaultMonthlyFee, currentMonth]);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        setRole,
        users: defaultUsers,
        settings,
        updateSettings,
        subscriptionStatus,
        members,
        addMember,
        updateMember,
        deleteMember,
        payments,
        recordPayment,
        updatePayment,
        deletePayment,
        bankReceipts,
        submitBankReceipt,
        updateBankReceiptStatus,
        transactions,
        addTransaction,
        deleteTransaction,
        notices,
        addNotice,
        deleteNotice,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        resetDemoData,
        exportDatabaseJson,
        importDatabaseJson,
        currentMemberData,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
