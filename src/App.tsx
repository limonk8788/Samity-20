import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MoneyReceiptModal } from './components/MoneyReceiptModal';
import { BankReceiptUploadModal } from './components/BankReceiptUploadModal';
import { BankReceiptsListModal } from './components/BankReceiptsListModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationDrawer } from './components/NotificationDrawer';

import { DashboardView } from './views/DashboardView';
import { MembersView } from './views/MembersView';
import { ChandaView } from './views/ChandaView';
import { AccountsView } from './views/AccountsView';
import { NoticesView } from './views/NoticesView';
import { ReportsView } from './views/ReportsView';
import { ProfileView } from './views/ProfileView';

import { Payment } from './types';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // Global Modals State
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(null);
  const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false);
  const [isReceiptsListOpen, setIsReceiptsListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Specific action triggers
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState<string | undefined>(undefined);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const handleOpenReceipt = (payment: Payment) => {
    setActiveReceiptPayment(payment);
  };

  const handleOpenRecordPayment = (memberId?: string) => {
    setSelectedMemberForPayment(memberId);
    setActiveTab('chanda');
  };

  const handleOpenAddTransaction = () => {
    setIsAddTransactionOpen(true);
    setActiveTab('accounts');
  };

  const handleOpenAddMember = () => {
    setActiveTab('members');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenReceiptsList={() => setIsReceiptsListOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-28 lg:pb-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenReceipt={handleOpenReceipt}
            onOpenRecordPayment={handleOpenRecordPayment}
            onOpenAddMember={handleOpenAddMember}
            onOpenAddTransaction={handleOpenAddTransaction}
            onOpenUploadReceipt={() => setIsUploadReceiptOpen(true)}
          />
        )}

        {activeTab === 'members' && <MembersView />}

        {activeTab === 'chanda' && (
          <ChandaView
            onOpenReceipt={handleOpenReceipt}
            onOpenUploadReceipt={() => setIsUploadReceiptOpen(true)}
            onOpenReceiptsList={() => setIsReceiptsListOpen(true)}
            initialMemberId={selectedMemberForPayment}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsView
            isAddModalOpen={isAddTransactionOpen}
            onCloseAddModal={() => setIsAddTransactionOpen(false)}
          />
        )}

        {activeTab === 'notices' && <NoticesView />}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'profile' && (
          <ProfileView
            onOpenReceipt={handleOpenReceipt}
            onOpenUploadReceipt={() => setIsUploadReceiptOpen(true)}
            onOpenReceiptsList={() => setIsReceiptsListOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Global Modals & Drawers */}
      <MoneyReceiptModal 
        payment={activeReceiptPayment}
        onClose={() => setActiveReceiptPayment(null)}
      />

      <BankReceiptUploadModal
        isOpen={isUploadReceiptOpen}
        onClose={() => setIsUploadReceiptOpen(false)}
      />

      <BankReceiptsListModal
        isOpen={isReceiptsListOpen}
        onClose={() => setIsReceiptsListOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenReceipts={() => setIsReceiptsListOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
