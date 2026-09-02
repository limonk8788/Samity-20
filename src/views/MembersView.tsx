import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, formatCurrency, formatDisplayDate } from '../utils/translations';
import { 
  Users, UserPlus, Search, Filter, Edit, Trash2, Phone, 
  Mail, MapPin, Briefcase, Calendar, CheckCircle, XCircle, 
  LayoutGrid, List, X, ShieldAlert 
} from 'lucide-react';
import { Member } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

export const MembersView: React.FC = () => {
  const { lang, members, addMember, updateMember, deleteMember, currentUser, settings } = useApp();
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    memberId: `CA-${String(members.length + 1).padStart(3, '0')}`,
    name: '',
    phone: '',
    email: '',
    address: '',
    profession: '',
    designation: 'সদস্য',
    joiningDate: new Date().toISOString().split('T')[0],
    monthlyFee: settings.defaultMonthlyFee || 500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bloodGroup: 'B+'
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      memberId: `CA-${String(members.length + 1).padStart(3, '0')}`,
      name: '',
      phone: '',
      email: '',
      address: '',
      profession: '',
      designation: lang === 'bn' ? 'সদস্য' : 'General Member',
      joiningDate: new Date().toISOString().split('T')[0],
      monthlyFee: settings.defaultMonthlyFee || 500,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bloodGroup: 'O+'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({
      memberId: member.memberId,
      name: member.name,
      phone: member.phone,
      email: member.email,
      address: member.address,
      profession: member.profession,
      designation: member.designation || '',
      joiningDate: member.joiningDate,
      monthlyFee: member.monthlyFee,
      status: member.status,
      avatar: member.avatar,
      bloodGroup: member.bloodGroup
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMember(editingMember.id, formData);
    } else {
      addMember(formData);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMember(deletingId);
      setDeletingId(null);
    }
  };

  // Filtering
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      member.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ? true : member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.members} ({members.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {lang === 'bn' 
              ? 'সমিতির সকল সদস্যের তালিকা ও তথ্য'
              : 'Directory of all Samity registered members'}
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            id="add-new-member-btn"
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addMember}</span>
          </button>
        )}
      </div>

      {/* Search & Filters Bar (Requirement #11: সদস্য Search, Member ID Search, মোবাইল নম্বর Search) */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="member-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-xs hidden sm:inline">{t.statusField}:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">{t.all}</option>
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Avatar & ID */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className="w-13 h-13 rounded-full object-cover border-2 border-emerald-500/20 shadow-xs shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                          {member.memberId}
                        </span>
                        {member.designation && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            • {member.designation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    member.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {member.status === 'active' ? t.active : t.inactive}
                  </span>
                </div>

                {/* Member Details */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-900 dark:text-white">{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{member.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{member.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.joiningDate}: {formatDisplayDate(member.joiningDate, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Monthly Fee & Admin Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.monthlyFee}:</span>
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(member.monthlyFee, lang)}
                  </span>
                </div>

                {currentUser.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title={t.editMember}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(member.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title={t.deleteMember}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3 pl-4">{t.member}</th>
                <th className="p-3">{t.phone}</th>
                <th className="p-3">{t.address}</th>
                <th className="p-3">{t.profession}</th>
                <th className="p-3">{t.joiningDate}</th>
                <th className="p-3 text-right">{t.monthlyFee}</th>
                <th className="p-3 text-center">{t.statusField}</th>
                {currentUser.role === 'admin' && <th className="p-3 pr-4 text-right">{t.actions}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          {member.memberId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{member.phone}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 max-w-[160px] truncate">{member.address}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{member.profession}</td>
                  <td className="p-3 text-slate-500">{formatDisplayDate(member.joiningDate, lang)}</td>
                  <td className="p-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(member.monthlyFee, lang)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      member.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {member.status === 'active' ? t.active : t.inactive}
                    </span>
                  </td>
                  {currentUser.role === 'admin' && (
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1 text-slate-500 hover:text-emerald-600 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(member.id)}
                          className="p-1 text-slate-500 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {editingMember ? t.editMember : t.addMember}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.memberId} *
                  </label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.statusField} *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="active">{t.active}</option>
                    <option value="inactive">{t.inactive}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.name} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.phone} *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="017xxxxxxxx"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.address} *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="যেমন: বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.profession} *
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    required
                    placeholder="যেমন: সিনিয়র কেয়ারটেকার"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.designation}
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="যেমন: সাধারণ সম্পাদক / সদস্য"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.joiningDate}
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.monthlyFee} (৳) *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  প্রোফাইল ছবি URL (বা ডিফল্ট রাখুন)
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        title={t.deleteMember}
        message="আপনি কি এই সদস্যকে তালিকা থেকে মুছে ফেলতে চান? এতে সকল সংক্রান্ত চাঁদার রেকর্ড অপরিবর্তিত থাকতে পারে।"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
