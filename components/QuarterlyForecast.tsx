import React, { useState } from 'react';
import { QuarterData, Project } from '../types';
import { PASTEL_VARIANTS } from '../constants';
import { Badge } from './ui/Badge';
import { ArrowRight, TrendingUp, AlertCircle, Calculator, Briefcase, Target, GitBranch, Presentation, FilePlus, Trash2, Plus, X, Check, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';

interface QuarterlyForecastProps {
  data: QuarterData[];
  allProjects: Project[]; // To select from
  onUpdateForecast?: (quarterId: string, type: 'mustWin' | 'alternative', projects: Project[]) => void;
  readOnly?: boolean;
}

export const QuarterlyForecast: React.FC<QuarterlyForecastProps> = ({ data, allProjects, onUpdateForecast, readOnly = false }) => {
  const { t, formatDate } = useLanguage();
  const [addingTo, setAddingTo] = useState<{ qId: string, type: 'mustWin' | 'alternative' } | null>(null);

  const calculateCapacity = (q: QuarterData) => {
    const totalCap = q.totalCapacity.reduce((a, b) => a + b, 0);
    const assignedDays = q.runningProjects.reduce((acc, p) => acc + (p.volume || 60), 0);
    const availableAfterRunning = totalCap - assignedDays;
    
    const opportunityDays = q.mustWinOpportunities.reduce((acc, p) => acc + (p.volume || 0), 0);
    const finalAvailable = availableAfterRunning - opportunityDays;

    return { totalCap, assignedDays, availableAfterRunning, opportunityDays, finalAvailable };
  };

  const getMonthlyBreakdown = (q: QuarterData, metrics: any) => {
      if (metrics.totalCap === 0) return q.months.map((m, i) => ({ month: m, total: q.totalCapacity[i], available: 0, optimistic: 0 }));

      return q.months.map((month, index) => {
          const total = q.totalCapacity[index];
          const ratio = total / metrics.totalCap;
          const assigned = Math.round(metrics.assignedDays * ratio);
          const opportunities = Math.round(metrics.opportunityDays * ratio);
          
          const available = total - assigned;
          const optimistic = available - opportunities;
          
          return { month, total, available, optimistic };
      });
  };

  const handleExportPPT = () => {
    alert(t('forecast.generatingPPT'));
  };

  const handleRequestSAP = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`${t('forecast.requestingSAP')} "${project.name}"`);
  };

  const handleUpdateProject = (
    quarterId: string,
    type: 'mustWin' | 'alternative',
    projects: Project[],
    updatedProject: Project,
    field: 'volume' | 'budget',
    value: string | number
  ) => {
    if (readOnly || !onUpdateForecast) return;
    
    const updatedList = projects.map(p => {
        if (p.id === updatedProject.id) {
            return { ...p, [field]: value };
        }
        return p;
    });
    onUpdateForecast(quarterId, type, updatedList);
  };

  const handleRemoveProject = (
    quarterId: string,
    type: 'mustWin' | 'alternative',
    projects: Project[],
    projectId: string
  ) => {
    if (readOnly || !onUpdateForecast) return;
    const updatedList = projects.filter(p => p.id !== projectId);
    onUpdateForecast(quarterId, type, updatedList);
  };

  const handleAddProject = (
    quarterId: string,
    type: 'mustWin' | 'alternative',
    currentProjects: Project[],
    newProject: Project
  ) => {
      if (readOnly || !onUpdateForecast) return;
      const projectToAdd = { ...newProject, volume: newProject.volume || 30 };
      onUpdateForecast(quarterId, type, [...currentProjects, projectToAdd]);
      setAddingTo(null);
  };

  return (
    <div className="h-full overflow-auto bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight">{t('forecast.title')}</h1>
                    {readOnly && (
                        <div className="px-2 py-0.5 rounded text-xs font-bold bg-charcoal-100 text-charcoal-500 flex items-center gap-1 border border-charcoal-200">
                            <Lock className="w-3 h-3" /> Read Only
                        </div>
                    )}
                </div>
                <p className="text-charcoal-500 mt-1">{t('forecast.subtitle')}</p>
            </div>
            <Button onClick={handleExportPPT} className="gap-2 shadow-sm">
                <Presentation className="w-4 h-4" />
                {t('forecast.exportPPT')}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.map((quarter, index) => {
            const metrics = calculateCapacity(quarter);
            const isCurrent = index === 0;
            const monthlyData = getMonthlyBreakdown(quarter, metrics);
            const isAddingMustWin = addingTo?.qId === quarter.id && addingTo?.type === 'mustWin';
            const isAddingAlt = addingTo?.qId === quarter.id && addingTo?.type === 'alternative';

            const currentIds = [
                ...quarter.runningProjects, 
                ...quarter.mustWinOpportunities, 
                ...quarter.alternativeOpportunities
            ].map(p => p.id);
            
            const availableProjects = allProjects.filter(p => p.status === 'opportunity' && !currentIds.includes(p.id));

            return (
              <div 
                key={quarter.id} 
                className={`flex flex-col bg-white rounded-xl border ${isCurrent ? 'border-charcoal-300 shadow-lg ring-1 ring-charcoal-200' : 'border-charcoal-200 shadow-sm'}`}
              >
                {/* Header */}
                <div className="p-5 border-b border-charcoal-100 bg-charcoal-50/30 rounded-t-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-charcoal-800">{quarter.name}</h2>
                    {isCurrent && <Badge color="green">{t('forecast.current')}</Badge>}
                  </div>
                  <div className="flex gap-2 text-xs text-charcoal-500 font-mono">
                    {quarter.months.join(' · ')}
                  </div>
                </div>

                <div className="p-5 space-y-6 flex-1">
                  
                  {/* Capacity Summary */}
                  <div className="bg-charcoal-50 rounded-lg p-4 border border-charcoal-100">
                     <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-charcoal-600 flex items-center gap-2">
                            <Calculator className="w-4 h-4" /> {t('forecast.teamCapacity')}
                        </span>
                        <span className="text-lg font-bold text-charcoal-900">{metrics.totalCap}d</span>
                     </div>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-charcoal-500">
                            <span>{t('forecast.runningProjects')}</span>
                            <span className="text-charcoal-700 font-medium">-{metrics.assignedDays}d</span>
                        </div>
                        <div className="border-t border-charcoal-200 pt-2 flex justify-between font-medium">
                            <span className="text-blue-700">{t('forecast.available')}</span>
                            <span className="text-blue-700">{metrics.availableAfterRunning}d</span>
                        </div>
                     </div>
                  </div>

                  {/* Monthly Breakdown Table */}
                  <div>
                        <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">{t('forecast.monthlySplit')}</h3>
                        <div className="overflow-hidden rounded-lg border border-charcoal-200 shadow-sm">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-charcoal-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-charcoal-500">{t('forecast.metric')}</th>
                                        {monthlyData.map(d => (
                                            <th key={d.month} className="px-3 py-2 text-right font-semibold text-charcoal-500">{d.month}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-charcoal-100 bg-white">
                                    <tr>
                                        <td className="px-3 py-2 font-medium text-charcoal-600">{t('forecast.totalCapacity')}</td>
                                        {monthlyData.map(d => (
                                            <td key={d.month} className="px-3 py-2 text-right font-mono text-charcoal-900">{d.total}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 font-medium text-blue-600">{t('forecast.available')}</td>
                                        {monthlyData.map(d => (
                                            <td key={d.month} className={`px-3 py-2 text-right font-mono font-bold ${d.available < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                                {d.available}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="bg-purple-50/30">
                                        <td className="px-3 py-2 font-medium text-purple-600">{t('forecast.optimistic')}</td>
                                        {monthlyData.map(d => (
                                            <td key={d.month} className={`px-3 py-2 text-right font-mono font-bold ${d.optimistic < 0 ? 'text-red-500' : 'text-purple-600'}`}>
                                                {d.optimistic}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                  </div>

                  {/* Running Projects */}
                  <div>
                    <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3">{t('forecast.runningProjects')}</h3>
                    <div className="space-y-2">
                        {quarter.runningProjects.length > 0 ? quarter.runningProjects.map(p => (
                            <div key={p.id} className="group flex items-center justify-between p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Briefcase className={`w-4 h-4 flex-shrink-0 ${PASTEL_VARIANTS[p.color].text}`} />
                                    <div className="truncate">
                                        <div className="text-sm font-medium text-charcoal-800 truncate">{p.name}</div>
                                        <div className="text-xs text-charcoal-500 truncate">{p.client}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] text-charcoal-500 font-medium">
                                            {p.startDate ? formatDate(new Date(p.startDate), 'MMM d, yyyy') : ''}
                                        </div>
                                        <div className="text-xs font-mono text-charcoal-400 whitespace-nowrap">
                                            {p.budget && p.budget !== '0' ? p.budget : 'T&M'}
                                        </div>
                                    </div>
                                    {!readOnly && (
                                    <button 
                                        onClick={(e) => handleRequestSAP(p, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-charcoal-200 rounded-md text-charcoal-500 transition-all"
                                        title={t('forecast.requestSAP')}
                                    >
                                        <FilePlus className="w-3.5 h-3.5" />
                                    </button>
                                    )}
                                </div>
                            </div>
                        )) : <div className="text-xs text-charcoal-400 italic pl-2">{t('forecast.noActive')}</div>}
                    </div>
                  </div>

                  {/* Must Win Opportunities */}
                  <div>
                     <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" /> {t('forecast.mustWin')}
                     </h3>
                     <div className="space-y-2">
                        {quarter.mustWinOpportunities.length > 0 ? quarter.mustWinOpportunities.map(p => (
                            <div key={p.id} className="group p-3 rounded-lg border border-orange-100 bg-orange-50/30 hover:border-orange-200 transition-colors relative">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                                        <Target className={`w-4 h-4 mt-0.5 flex-shrink-0 ${PASTEL_VARIANTS[p.color].text}`} />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-charcoal-800 truncate">{p.name}</div>
                                            <div className="text-xs text-charcoal-500">{p.client}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="number" 
                                                disabled={readOnly}
                                                className={`w-12 h-6 text-right text-xs font-bold text-orange-600 rounded border border-orange-200 focus:border-orange-400 focus:outline-none px-1 ${readOnly ? 'bg-transparent border-transparent' : 'bg-orange-100'}`}
                                                value={p.volume || 0}
                                                onChange={(e) => handleUpdateProject(quarter.id, 'mustWin', quarter.mustWinOpportunities, p, 'volume', Number(e.target.value))}
                                                title={t('forecast.volumeDays')}
                                            />
                                            <span className="text-[10px] text-orange-500 font-medium">d</span>
                                        </div>
                                        
                                        {/* Actions */}
                                        {!readOnly && (
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleRemoveProject(quarter.id, 'mustWin', quarter.mustWinOpportunities, p.id)}
                                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded ml-1 transition-colors"
                                                title={t('forecast.remove')}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 text-[10px] text-charcoal-500 pl-6.5 flex justify-between items-center">
                                    <span>{t('forecast.start')}: {p.startDate ? formatDate(new Date(p.startDate), 'MMM d, yyyy') : 'TBD'}</span>
                                    <input 
                                        type="text"
                                        disabled={readOnly}
                                        className={`w-16 h-5 text-right font-mono text-charcoal-500 bg-transparent border-b hover:border-orange-200 focus:border-orange-400 focus:outline-none ${readOnly ? 'border-transparent' : 'border-transparent'}`}
                                        value={p.budget || ''}
                                        onChange={(e) => handleUpdateProject(quarter.id, 'mustWin', quarter.mustWinOpportunities, p, 'budget', e.target.value)}
                                        placeholder={readOnly ? '' : t('forecast.budgetPlaceholder')}
                                    />
                                </div>
                            </div>
                        )) : <div className="text-xs text-charcoal-400 italic pl-2">{t('forecast.noneIdentified')}</div>}
                        
                        {/* Add Button */}
                        {!readOnly && (
                        <div className="relative pt-1">
                            {!isAddingMustWin ? (
                                <button 
                                    onClick={() => setAddingTo({ qId: quarter.id, type: 'mustWin' })}
                                    className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2 py-1 rounded transition-colors w-full justify-center border border-dashed border-orange-200"
                                >
                                    <Plus className="w-3.5 h-3.5" /> {t('forecast.addOpp')}
                                </button>
                            ) : (
                                <div className="absolute left-0 right-0 top-0 z-10 bg-white border border-orange-200 shadow-lg rounded-lg p-2 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-orange-100">
                                        <span className="text-xs font-semibold text-orange-700">{t('forecast.selectProject')}</span>
                                        <button onClick={() => setAddingTo(null)} className="text-charcoal-400 hover:text-charcoal-600"><X className="w-3 h-3" /></button>
                                    </div>
                                    <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                        {availableProjects.length > 0 ? availableProjects.map(p => (
                                            <button 
                                                key={p.id}
                                                onClick={() => handleAddProject(quarter.id, 'mustWin', quarter.mustWinOpportunities, p)}
                                                className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded hover:bg-orange-50 group"
                                            >
                                                <span className="text-xs text-charcoal-700 font-medium group-hover:text-orange-700">{p.name}</span>
                                                <span className="text-[10px] text-charcoal-400">{p.client}</span>
                                            </button>
                                        )) : (
                                            <div className="text-xs text-charcoal-400 py-2 text-center">{t('forecast.noMoreOpp')}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
                     </div>
                  </div>

                  {/* Alternative Opportunities */}
                  <div>
                     <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <GitBranch className="w-3 h-3" /> {t('forecast.alternatives')}
                     </h3>
                     <div className="space-y-2">
                        {quarter.alternativeOpportunities.length > 0 ? quarter.alternativeOpportunities.map(p => (
                            <div key={p.id} className="group p-3 rounded-lg border border-blue-100 bg-blue-50/30 hover:border-blue-200 transition-colors relative">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PASTEL_VARIANTS[p.color].bg} border ${PASTEL_VARIANTS[p.color].border}`} />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-charcoal-800 truncate">{p.name}</div>
                                            <div className="text-xs text-charcoal-500">{p.client}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="number" 
                                                disabled={readOnly}
                                                className={`w-12 h-6 text-right text-xs font-bold text-blue-600 rounded border border-blue-200 focus:border-blue-400 focus:outline-none px-1 ${readOnly ? 'bg-transparent border-transparent' : 'bg-blue-100'}`}
                                                value={p.volume || 0}
                                                onChange={(e) => handleUpdateProject(quarter.id, 'alternative', quarter.alternativeOpportunities, p, 'volume', Number(e.target.value))}
                                                title={t('forecast.volumeDays')}
                                            />
                                            <span className="text-[10px] text-blue-500 font-medium">d</span>
                                        </div>

                                        {!readOnly && (
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleRemoveProject(quarter.id, 'alternative', quarter.alternativeOpportunities, p.id)}
                                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded ml-1 transition-colors"
                                                title={t('forecast.remove')}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 text-[10px] text-charcoal-500 pl-5 flex justify-between items-center">
                                     <span>{t('forecast.start')}: {p.startDate ? formatDate(new Date(p.startDate), 'MMM d, yyyy') : 'TBD'}</span>
                                     <input 
                                        type="text"
                                        disabled={readOnly}
                                        className={`w-16 h-5 text-right font-mono text-charcoal-500 bg-transparent border-b hover:border-blue-200 focus:border-blue-400 focus:outline-none ${readOnly ? 'border-transparent' : 'border-transparent'}`}
                                        value={p.budget || ''}
                                        onChange={(e) => handleUpdateProject(quarter.id, 'alternative', quarter.alternativeOpportunities, p, 'budget', e.target.value)}
                                        placeholder={readOnly ? '' : t('forecast.budgetPlaceholder')}
                                    />
                                </div>
                            </div>
                        )) : <div className="text-xs text-charcoal-400 italic pl-2">{t('forecast.noneIdentified')}</div>}

                         {/* Add Button */}
                        {!readOnly && (
                        <div className="relative pt-1">
                            {!isAddingAlt ? (
                                <button 
                                    onClick={() => setAddingTo({ qId: quarter.id, type: 'alternative' })}
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors w-full justify-center border border-dashed border-blue-200"
                                >
                                    <Plus className="w-3.5 h-3.5" /> {t('forecast.addAlt')}
                                </button>
                            ) : (
                                <div className="absolute left-0 right-0 top-0 z-10 bg-white border border-blue-200 shadow-lg rounded-lg p-2 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-blue-100">
                                        <span className="text-xs font-semibold text-blue-700">{t('forecast.selectProject')}</span>
                                        <button onClick={() => setAddingTo(null)} className="text-charcoal-400 hover:text-charcoal-600"><X className="w-3 h-3" /></button>
                                    </div>
                                    <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                                        {availableProjects.length > 0 ? availableProjects.map(p => (
                                            <button 
                                                key={p.id}
                                                onClick={() => handleAddProject(quarter.id, 'alternative', quarter.alternativeOpportunities, p)}
                                                className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded hover:bg-blue-50 group"
                                            >
                                                <span className="text-xs text-charcoal-700 font-medium group-hover:text-blue-700">{p.name}</span>
                                                <span className="text-[10px] text-charcoal-400">{p.client}</span>
                                            </button>
                                        )) : (
                                            <div className="text-xs text-charcoal-400 py-2 text-center">{t('forecast.noMoreOpp')}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
                     </div>
                  </div>

                  {/* Final Calculation */}
                  <div className="pt-4 border-t border-charcoal-100">
                    <div className="flex justify-between items-center">
                         <span className="text-sm font-medium text-charcoal-600">{t('forecast.netCapacity')}</span>
                         <div className={`text-xl font-bold ${metrics.finalAvailable < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {metrics.finalAvailable > 0 ? '+' : ''}{metrics.finalAvailable}d
                         </div>
                    </div>
                    {metrics.finalAvailable < 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded">
                            <AlertCircle className="w-3 h-3" /> {t('forecast.overcapacity')}
                        </div>
                    )}
                  </div>

                   {/* Notes */}
                   <div className="bg-yellow-50/50 p-3 rounded text-xs text-charcoal-600 border border-yellow-100">
                      <span className="font-semibold block mb-1">{t('forecast.notes')}</span>
                      {quarter.notes}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};