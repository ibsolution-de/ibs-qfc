import React, { useState } from 'react';
import { Employee } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Plus, Trash2, Edit2, Mail, Phone, Upload, User, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ManageTeamProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

export const ManageTeam: React.FC<ManageTeamProps> = ({ employees, onUpdateEmployees }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    avatar: '',
    skills: [],
    availability: 100,
    email: '',
    phone: '',
    notes: ''
  });
  const [skillInput, setSkillInput] = useState('');

  const handleEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setFormData({ ...emp });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      avatar: `https://ui-avatars.com/api/?name=New+User&background=random`,
      skills: [],
      availability: 100,
      email: '',
      phone: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('team.confirmDelete'))) {
      onUpdateEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    if (editingId) {
      // Update
      const updated = employees.map(e => e.id === editingId ? { ...e, ...formData } as Employee : e);
      onUpdateEmployees(updated);
    } else {
      // Create
      const newEmp: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData as Employee
      };
      onUpdateEmployees([...employees, newEmp]);
    }
    setIsModalOpen(false);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50/50 p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight">{t('team.title')}</h1>
            <p className="text-charcoal-500 mt-1">{t('team.subtitle')}</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> {t('team.addEmployee')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-xl border border-charcoal-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-full border border-charcoal-100 object-cover" />
                    <div>
                      <h3 className="font-semibold text-lg text-charcoal-900 leading-tight">{emp.name}</h3>
                      <p className="text-sm text-charcoal-500">{emp.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(emp)} className="p-1.5 text-charcoal-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {emp.skills?.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-charcoal-50 border border-charcoal-100 text-charcoal-600 text-xs rounded-md font-medium">
                        {skill}
                      </span>
                    ))}
                    {(!emp.skills || emp.skills.length === 0) && <span className="text-xs text-charcoal-400 italic">{t('team.noSkills')}</span>}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-charcoal-50">
                     <div className="flex items-center gap-2 text-sm text-charcoal-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{emp.email || '-'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-charcoal-600">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{emp.phone || '-'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-charcoal-600">
                        <Star className="w-3.5 h-3.5" />
                        <span>{emp.availability}% {t('team.availability')}</span>
                     </div>
                  </div>
                  
                  {emp.notes && (
                    <div className="text-xs text-charcoal-500 bg-yellow-50/50 p-2 rounded border border-yellow-100 mt-2">
                      {emp.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? t('team.editEmployee') : t('team.addEmployee')} size="lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Col - Avatar */}
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <div className="relative group w-32 h-32">
               <img src={formData.avatar} alt="Preview" className="w-32 h-32 rounded-full border-4 border-charcoal-50 object-cover shadow-sm" />
               <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
            </div>
            <p className="text-xs text-charcoal-400 text-center">{t('team.uploadPhoto')}</p>
          </div>

          {/* Right Col - Fields */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('team.name')}</label>
                <input required className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={t('team.placeholderName')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('team.role')}</label>
                <input required className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder={t('team.placeholderRole')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('team.email')}</label>
                  <input type="email" className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder={t('team.placeholderEmail')} />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('team.phone')}</label>
                  <input type="tel" className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder={t('team.placeholderPhone')} />
               </div>
            </div>

            <div>
               <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
                  {t('team.availability')} ({formData.availability}%)
               </label>
               <input type="range" min="0" max="100" step="10" className="w-full h-2 bg-charcoal-100 rounded-lg appearance-none cursor-pointer accent-charcoal-800" 
                  value={formData.availability} onChange={e => setFormData({...formData, availability: Number(e.target.value)})} />
               <div className="flex justify-between text-xs text-charcoal-400 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
               </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('team.skills')}</label>
              <div className="border border-charcoal-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 bg-white">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills?.map(skill => (
                    <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900"><XIcon className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <input 
                  className="w-full text-sm outline-none" 
                  placeholder={t('team.typeSkill')} 
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
              </div>
            </div>

            <div>
               <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('team.notes')}</label>
               <textarea rows={3} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" 
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder={t('team.placeholderNotes')} />
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>{t('team.cancel')}</Button>
              <Button type="submit">{t('team.saveEmployee')}</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Helper icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);