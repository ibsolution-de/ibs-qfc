import React, { useState } from 'react';
import { Project } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { PASTEL_VARIANTS } from '../constants';
import { Plus, Trash2, Edit2, Calendar, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ManageProjectsProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export const ManageProjects: React.FC<ManageProjectsProps> = ({ projects, onUpdateProjects }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    client: '',
    topic: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: 'active',
    color: 'blue',
    notes: '',
    volume: 0
  });

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setFormData({ ...proj });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      client: '',
      topic: '',
      budget: '',
      startDate: '',
      endDate: '',
      status: 'active',
      color: 'blue',
      notes: '',
      volume: 40
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('projects.confirmDelete'))) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.client) return;

    if (editingId) {
      const updated = projects.map(p => p.id === editingId ? { ...p, ...formData } as Project : p);
      onUpdateProjects(updated);
    } else {
      const newProj: Project = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData as Project
      };
      onUpdateProjects([...projects, newProj]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="h-full overflow-auto bg-gray-50/50 p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight">{t('projects.title')}</h1>
            <p className="text-charcoal-500 mt-1">{t('projects.subtitle')}</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> {t('projects.addProject')}
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-charcoal-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-charcoal-50 border-b border-charcoal-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{t('projects.project')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{t('projects.clientTopic')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{t('projects.dates')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{t('projects.status')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-charcoal-500 uppercase tracking-wider text-right">{t('projects.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-charcoal-50/50 group transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${PASTEL_VARIANTS[p.color].bg} border ${PASTEL_VARIANTS[p.color].border}`} />
                      <div>
                        <div className="text-sm font-semibold text-charcoal-900">{p.name}</div>
                        {p.budget && <div className="text-xs text-charcoal-500 flex items-center gap-1 mt-0.5"><DollarSign className="w-3 h-3" />{p.budget}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-charcoal-800 font-medium">{p.client}</div>
                    <div className="text-xs text-charcoal-500">{p.topic || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-charcoal-600 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {p.startDate || 'TBD'}</span>
                      <span className="pl-4.5 text-charcoal-400">to {p.endDate || 'TBD'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize
                      ${p.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                      ${p.status === 'opportunity' ? 'bg-orange-50 text-orange-700 border border-orange-200' : ''}
                      ${p.status === 'completed' ? 'bg-charcoal-100 text-charcoal-600 border border-charcoal-200' : ''}
                      ${p.status === 'on_hold' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : ''}
                    `}>
                      {t(`status.${p.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="p-1.5 text-charcoal-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? t('projects.editProject') : t('projects.newProject')} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.projectName')}</label>
                   <input required className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                     value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.client')}</label>
                   <input required className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                     value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.topic')}</label>
                   <input className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                     value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} placeholder={t('projects.placeholderTopic')} />
                </div>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.status')}</label>
                   <select className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                     value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                     <option value="active">{t('status.active')}</option>
                     <option value="opportunity">{t('status.opportunity')}</option>
                     <option value="completed">{t('status.completed')}</option>
                     <option value="on_hold">{t('status.on_hold')}</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.budget')}</label>
                   <input className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                     value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder={t('projects.placeholderBudget')} />
                </div>
                 <div>
                   <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.dates')}</label>
                   <div className="grid grid-cols-2 gap-2">
                     <input type="date" className="w-full px-2 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                       value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                     <input type="date" className="w-full px-2 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                       value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                   </div>
                </div>
             </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-2">{t('projects.colorTag')}</label>
            <div className="flex gap-3">
              {(Object.keys(PASTEL_VARIANTS) as Array<keyof typeof PASTEL_VARIANTS>).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${PASTEL_VARIANTS[color].bg} ${PASTEL_VARIANTS[color].border} ${formData.color === color ? 'ring-2 ring-offset-2 ring-charcoal-400 scale-110' : 'hover:scale-105'}`}
                >
                  {formData.color === color && <div className="w-2 h-2 bg-charcoal-800 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">{t('projects.notes')}</label>
             <textarea rows={3} className="w-full px-3 py-2 border border-charcoal-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" 
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-charcoal-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>{t('projects.cancel')}</Button>
            <Button type="submit">{t('projects.saveProject')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};