import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResourcePlanner } from './components/ResourcePlanner';
import { QuarterlyForecast } from './components/QuarterlyForecast';
import { ManageTeam } from './components/ManageTeam';
import { ManageProjects } from './components/ManageProjects';
import { CreateVersionDialog } from './components/CreateVersionDialog';
import { ViewMode, Assignment, PlanVersion, Project, Employee } from './types';
import { MOCK_EMPLOYEES, MOCK_VERSIONS, MOCK_PROJECTS } from './constants';
import { parseISO } from 'date-fns';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.PLANNER);
  
  // State for Global Data
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  
  // State for versions
  const [versions, setVersions] = useState<PlanVersion[]>(MOCK_VERSIONS);
  // Default active version to the LATEST version (last in array)
  const [activeVersionId, setActiveVersionId] = useState<string>(MOCK_VERSIONS[MOCK_VERSIONS.length - 1].id);

  // Version Dialog State
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);

  // The latest version is the "Working Copy" for the Planner
  const latestVersion = versions[versions.length - 1];
  // Determine if we are viewing the latest version (editable) or an older one (read-only)
  const isLatestVersion = activeVersionId === latestVersion.id;

  // The active version is for viewing historical forecasts
  const activeVersion = useMemo(() => {
    return versions.find(v => v.id === activeVersionId) || latestVersion;
  }, [versions, activeVersionId, latestVersion]);

  // Planner uses the Active Version assignments (editable if latest, read-only if older)
  const plannerAssignments = activeVersion.assignments;
  
  // Forecast uses the Selected Version's data
  const forecastData = activeVersion.forecastData;

  // Determine initialDate for planner
  const versionStartDate = useMemo(() => {
    const hasQ42025 = activeVersion.forecastData.some(q => q.name === 'Q4 2025');
    if (hasQ42025) return new Date(2025, 10, 1);
    if (latestVersion.name.includes('Q4 2025')) return new Date(2025, 10, 1);
    if (latestVersion.name.includes('Q1 2026')) return new Date(2026, 0, 1);
    return new Date();
  }, [latestVersion, activeVersion]);

  // Update assignments for the LATEST version only
  const handleAssignmentChange = (newAssignments: Assignment[]) => {
    setVersions(prev => {
        const newVersions = [...prev];
        const lastIdx = newVersions.length - 1;
        newVersions[lastIdx] = {
            ...newVersions[lastIdx],
            assignments: newAssignments
        };
        return newVersions;
    });
  };

  const handleCreateVersion = (name: string, description: string) => {
    const newVersion: PlanVersion = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        description: description,
        createdAt: new Date().toISOString(),
        assignments: [...plannerAssignments], // Clone current assignments
        forecastData: JSON.parse(JSON.stringify(forecastData)) // Deep clone forecast data
    };

    // Correcting clone to always clone latest state
    const currentLatest = versions[versions.length - 1];
    newVersion.forecastData = JSON.parse(JSON.stringify(currentLatest.forecastData));

    setVersions(prev => [...prev, newVersion]);
    setActiveVersionId(newVersion.id); // Switch viewing to new version
  };

  const handleForecastUpdate = (quarterId: string, type: 'mustWin' | 'alternative', updatedProjects: Project[]) => {
    setVersions(prev => {
        const newVersions = [...prev];
        const vIndex = newVersions.findIndex(v => v.id === activeVersionId);
        if (vIndex === -1) return prev;

        const version = { ...newVersions[vIndex] };
        const newForecastData = version.forecastData.map(q => {
            if (q.id === quarterId) {
                return {
                    ...q,
                    [type === 'mustWin' ? 'mustWinOpportunities' : 'alternativeOpportunities']: updatedProjects
                };
            }
            return q;
        });
        
        version.forecastData = newForecastData;
        newVersions[vIndex] = version;
        return newVersions;
    });
  };

  return (
    <div className="flex h-screen bg-white text-charcoal-800 font-sans selection:bg-pastel-blue selection:text-blue-900">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        versions={versions}
        activeVersionId={activeVersionId}
        onSelectVersion={setActiveVersionId}
        onCreateVersion={() => setIsVersionDialogOpen(true)}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top shadow gradient for depth */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-charcoal-200/20 to-transparent z-10 pointer-events-none" />
        
        {currentView === ViewMode.PLANNER && (
          <ResourcePlanner 
            key={activeVersion.id}
            employees={employees}
            assignments={plannerAssignments}
            projects={projects}
            onAssignmentChange={handleAssignmentChange}
            initialDate={versionStartDate}
            readOnly={!isLatestVersion}
          />
        )}

        {currentView === ViewMode.FORECAST && (
          <QuarterlyForecast 
            data={forecastData} 
            allProjects={projects}
            onUpdateForecast={handleForecastUpdate}
            readOnly={!isLatestVersion}
          />
        )}

        {currentView === ViewMode.TEAM && (
          <ManageTeam 
            employees={employees}
            onUpdateEmployees={setEmployees}
          />
        )}

        {currentView === ViewMode.PROJECTS && (
          <ManageProjects 
            projects={projects}
            onUpdateProjects={setProjects}
          />
        )}
      </main>

      <CreateVersionDialog 
        isOpen={isVersionDialogOpen}
        onClose={() => setIsVersionDialogOpen(false)}
        onCreate={handleCreateVersion}
      />
    </div>
  );
};

export default App;