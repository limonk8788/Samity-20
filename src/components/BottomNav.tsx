import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { 
  LayoutDashboard, Users, CreditCard, Receipt, 
  Bell, FileText, UserCircle 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, lang, currentUser } = useApp();
  const t = translations[lang];

  const items = [
    { id: 'dashboard', label: lang === 'bn' ? 'হোম' : 'Home', icon: LayoutDashboard },
    { id: 'members', label: lang === 'bn' ? 'সদস্য' : 'Members', icon: Users },
    { id: 'chanda', label: lang === 'bn' ? 'চাঁদা' : 'Chanda', icon: CreditCard },
    { id: 'accounts', label: lang === 'bn' ? 'হিসাব' : 'Accounts', icon: Receipt },
    { id: 'notices', label: lang === 'bn' ? 'নোটিশ' : 'Notice', icon: Bell },
    ...(currentUser.role === 'member'
      ? [{ id: 'profile', label: lang === 'bn' ? 'প্রোফাইল' : 'Profile', icon: UserCircle }]
      : [{ id: 'reports', label: lang === 'bn' ? 'রিপোর্ট' : 'Reports', icon: FileText }])
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/60' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5 truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
