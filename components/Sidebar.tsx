import React, { useState } from 'react';
import { CalendarDays, BarChart3, Settings, Users, Layers, History, Plus, Globe, Clock } from 'lucide-react';
import { ViewMode, PlanVersion } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  versions: PlanVersion[];
  activeVersionId: string;
  onSelectVersion: (id: string) => void;
  onCreateVersion: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView,
  versions,
  activeVersionId,
  onSelectVersion,
  onCreateVersion
}) => {
  const { t, language, setLanguage, formatDate } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuItems = [
    { id: ViewMode.PLANNER, label: t('sidebar.resourcePlan'), icon: CalendarDays },
    { id: ViewMode.FORECAST, label: t('sidebar.quarterlyForecast'), icon: BarChart3 },
  ];

  const manageItems = [
    { id: ViewMode.TEAM, label: t('sidebar.team'), icon: Users },
    { id: ViewMode.PROJECTS, label: t('sidebar.projects'), icon: Layers },
  ];

  return (
    <>
    <div className="w-64 bg-charcoal-50 border-r border-charcoal-200 flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-8 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-charcoal-700 to-charcoal-900 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                I
            </div>
            <span className="font-semibold text-charcoal-900 tracking-tight text-lg">IBs QFC</span>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1 flex-shrink-0">
          <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3 px-3">{t('sidebar.planning')}</div>
          {menuItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-white text-charcoal-900 shadow-sm ring-1 ring-charcoal-200' 
                    : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100'
                  }
                `}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-charcoal-800' : 'text-charcoal-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <nav className="space-y-1 mt-8 flex-shrink-0">
            <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-3 px-3">{t('sidebar.manage')}</div>
            {manageItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-charcoal-900 shadow-sm ring-1 ring-charcoal-200' 
                      : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100'
                    }
                  `}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-charcoal-800' : 'text-charcoal-400'}`} />
                  {item.label}
                </button>
              );
            })}
        </nav>

        {/* Version History / Timeline */}
        <div className="mt-8 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-3 mb-4 flex-shrink-0">
             <div className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider flex items-center gap-2">
                <History className="w-3 h-3" /> {t('sidebar.versions')}
             </div>
             <button 
                onClick={onCreateVersion}
                className="text-charcoal-400 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors"
                title="Save new version"
              >
                <Plus className="w-3.5 h-3.5" />
             </button>
          </div>
          
          <div className="relative flex-1 overflow-y-auto custom-scrollbar px-2 pb-4"> 
             {/* Timeline Container */}
             <div className="relative pl-4 pt-1">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-charcoal-200" />

                <div className="space-y-6 relative">
                  {versions.slice().reverse().map((version) => {
                      const isActive = activeVersionId === version.id;
                      return (
                          <div key={version.id} className="relative pl-6 group">
                              {/* Timeline Node/Dot */}
                              <button
                                  onClick={() => onSelectVersion(version.id)}
                                  className={`absolute left-[15px] top-2.5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 z-10 box-content
                                      ${isActive 
                                      ? 'bg-blue-600 border-white ring-2 ring-blue-200 shadow-md scale-110' 
                                      : 'bg-white border-charcoal-300 group-hover:border-charcoal-400 group-hover:scale-110'}
                                  `}
                              />
                              
                              {/* Content Card */}
                              <button 
                                  onClick={() => onSelectVersion(version.id)}
                                  className={`text-left w-full transition-all duration-200 rounded-lg p-2.5 border
                                      ${isActive 
                                          ? 'bg-white border-charcoal-200 shadow-sm translate-x-1' 
                                          : 'bg-transparent border-transparent hover:bg-charcoal-100/50 hover:translate-x-1'}
                                  `}
                              >
                                  <div className={`text-sm font-medium leading-snug mb-0.5 ${isActive ? 'text-charcoal-900' : 'text-charcoal-600'}`}>
                                      {version.name}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-charcoal-400">
                                      <Clock className="w-3 h-3 opacity-60" />
                                      <span className="font-mono">{formatDate(new Date(version.createdAt), 'MMM d, HH:mm')}</span>
                                  </div>
                              </button>
                          </div>
                      );
                  })}
                </div>
             </div>
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-charcoal-200 bg-charcoal-50 flex-shrink-0">
        <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
          {t('sidebar.settings')}
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
            <img src="https://ui-avatars.com/api/?name=Nazar+Kulyk&background=0D8ABC&color=fff" alt="User" className="w-8 h-8 rounded-full border border-charcoal-200" />
            <div className="text-xs">
                <div className="font-medium text-charcoal-900">Nazar Kulyk</div>
                <div className="text-charcoal-500">PM, Architect, Dev</div>
            </div>
        </div>
      </div>
    </div>

    {/* Settings Modal */}
    <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t('sidebar.settings')} size="sm">
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-medium text-charcoal-900 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {t('sidebar.language')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                            language === 'en' 
                            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500/20' 
                            : 'bg-white border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
                        }`}
                    >
                        <span>🇺🇸</span> English
                    </button>
                    <button 
                         onClick={() => setLanguage('de')}
                        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                            language === 'de' 
                            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500/20' 
                            : 'bg-white border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50'
                        }`}
                    >
                        <span>🇩🇪</span> Deutsch
                    </button>
                </div>
            </div>
            
            <div className="pt-4 border-t border-charcoal-100 flex justify-end">
                <Button onClick={() => setIsSettingsOpen(false)}>{t('sidebar.close')}</Button>
            </div>
        </div>
    </Modal>
    </>
  );
};