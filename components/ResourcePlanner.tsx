import React, { useState, useMemo, useEffect } from 'react';
import { 
  format, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  addMonths, 
  isWeekend, 
  isSameDay, 
  isToday,
  getISOWeek,
  startOfQuarter,
  addQuarters,
  getDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Info, Calendar, FileSpreadsheet, Share2, Check, GripVertical, Repeat, ArrowRight, Lock } from 'lucide-react';
import { Employee, Project, Assignment, TimeScale } from '../types';
import { PASTEL_VARIANTS } from '../constants';
import { Button } from './ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { Modal } from './ui/Modal';

interface ResourcePlannerProps {
  employees: Employee[];
  assignments: Assignment[];
  projects: Project[];
  onAssignmentChange: (assignments: Assignment[]) => void;
  initialDate?: Date;
  readOnly?: boolean;
}

export const ResourcePlanner: React.FC<ResourcePlannerProps> = ({ 
  employees, 
  assignments, 
  projects,
  onAssignmentChange,
  initialDate,
  readOnly = false
}) => {
  const { t, formatDate } = useLanguage();
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [timeScale, setTimeScale] = useState<TimeScale>(TimeScale.MONTH);
  const [selectedCell, setSelectedCell] = useState<{empId: string, date: Date} | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Multi-select state for the modal
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  
  // Bulk Assign / Repeat Mode state
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [repeatDays, setRepeatDays] = useState<number[]>([]); // 0=Sun, 1=Mon...

  // Drag and Drop state
  const [draggingEmpId, setDraggingEmpId] = useState<string | null>(null);
  const [draggingAssignmentId, setDraggingAssignmentId] = useState<string | null>(null);

  // Initialize date if initialDate prop changes
  useEffect(() => {
    if (initialDate) {
        setCurrentDate(initialDate);
    }
  }, [initialDate]);

  // When selected cell changes, initialize the buffer
  useEffect(() => {
    if (selectedCell) {
        const dateStr = format(selectedCell.date, 'yyyy-MM-dd');
        const existingIds = assignments
            .filter(a => a.employeeId === selectedCell.empId && a.date === dateStr)
            .map(a => a.projectId);
        setSelectedProjectIds(existingIds);
        
        setIsRepeatMode(false);
        setRepeatDays([getDay(selectedCell.date)]);
    }
  }, [selectedCell, assignments]);

  // Calculate months to render based on timeScale
  const monthsToRender = useMemo(() => {
    if (timeScale === TimeScale.MONTH) {
        return [startOfMonth(currentDate)];
    } else {
        const start = startOfQuarter(currentDate);
        return [0, 1, 2].map(i => addMonths(start, i));
    }
  }, [currentDate, timeScale]);

  const headerTitle = useMemo(() => {
    if (timeScale === TimeScale.MONTH) {
      return formatDate(currentDate, 'MMMM yyyy');
    }
    const quarter = Math.floor(startOfQuarter(currentDate).getMonth() / 3) + 1;
    return `Q${quarter} ${formatDate(currentDate, 'yyyy')}`;
  }, [currentDate, timeScale, formatDate]);

  const handlePrev = () => {
    if (timeScale === TimeScale.QUARTER) {
      setCurrentDate(prev => addQuarters(prev, -1));
    } else {
      setCurrentDate(prev => addMonths(prev, -1));
    }
  };

  const handleNext = () => {
    if (timeScale === TimeScale.QUARTER) {
      setCurrentDate(prev => addQuarters(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e: React.DragEvent, assignment: Assignment) => {
    if (readOnly) return;
    e.dataTransfer.setData('assignmentId', assignment.id);
    e.dataTransfer.setData('empId', assignment.employeeId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingEmpId(assignment.employeeId);
    setDraggingAssignmentId(assignment.id);
  };

  const handleDragEnd = () => {
    setDraggingEmpId(null);
    setDraggingAssignmentId(null);
  };

  const handleDragOver = (e: React.DragEvent, targetEmpId: string) => {
    if (readOnly) return;
    e.preventDefault();
    if (draggingEmpId === targetEmpId) {
        e.dataTransfer.dropEffect = "move";
    } else {
        e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDrop = (e: React.DragEvent, targetEmpId: string, targetDate: Date) => {
    if (readOnly) return;
    e.preventDefault();
    setDraggingEmpId(null);
    setDraggingAssignmentId(null);
    
    const assignmentId = e.dataTransfer.getData('assignmentId');
    const empId = e.dataTransfer.getData('empId');
    
    if (empId !== targetEmpId) return;

    const targetDateStr = format(targetDate, 'yyyy-MM-dd');

    const updatedAssignments = assignments.map(a => {
        if (a.id === assignmentId) {
            return { ...a, date: targetDateStr };
        }
        return a;
    });
    
    onAssignmentChange(updatedAssignments);
  };

  // --- Assignment Management ---
  const handleRemoveAssignment = (assignmentId: string) => {
    if (readOnly) return;
    const newAssignments = assignments.filter(a => a.id !== assignmentId);
    onAssignmentChange(newAssignments);
  };

  const handleSaveAssignments = () => {
      if (readOnly || !selectedCell) return;
      
      const targetDateStr = format(selectedCell.date, 'yyyy-MM-dd');
      let newAssignments = [...assignments];

      if (isRepeatMode) {
          const monthStart = startOfMonth(selectedCell.date);
          const monthEnd = endOfMonth(selectedCell.date);
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

          daysInMonth.forEach(d => {
              if (repeatDays.includes(getDay(d))) {
                  const dStr = format(d, 'yyyy-MM-dd');
                  newAssignments = newAssignments.filter(a => !(a.employeeId === selectedCell.empId && a.date === dStr));
                  
                  selectedProjectIds.forEach(pId => {
                      newAssignments.push({
                          id: Math.random().toString(36).substr(2, 9),
                          employeeId: selectedCell.empId,
                          projectId: pId,
                          date: dStr
                      });
                  });
              }
          });
      } else {
          newAssignments = newAssignments.filter(a => !(a.employeeId === selectedCell.empId && a.date === targetDateStr));
          
          selectedProjectIds.forEach(pId => {
              newAssignments.push({
                  id: Math.random().toString(36).substr(2, 9),
                  employeeId: selectedCell.empId,
                  projectId: pId,
                  date: targetDateStr
              });
          });
      }

      onAssignmentChange(newAssignments);
      setSelectedCell(null);
  };

  const toggleRepeatDay = (dayIndex: number) => {
      setRepeatDays(prev => {
          if (prev.includes(dayIndex)) return prev.filter(d => d !== dayIndex);
          return [...prev, dayIndex].sort();
      });
  };

  const getDayLabel = (idx: number) => {
      const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return labels[idx];
  };

  const getCellAssignments = (empId: string, date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return assignments.filter(a => a.employeeId === empId && a.date === dateStr);
  };

  const getProject = (id: string) => projects.find(p => p.id === id);

  // Stats Calculator
  const getEmployeeStats = (emp: Employee, monthDays: Date[]) => {
      const workingDays = monthDays.filter(d => !isWeekend(d)).length;
      const capacity = Math.round(workingDays * (emp.availability / 100) * 10) / 10;

      // Filter assignments for this employee in this month
      const monthStartStr = format(monthDays[0], 'yyyy-MM-dd');
      const monthEndStr = format(monthDays[monthDays.length - 1], 'yyyy-MM-dd');

      const empAssignments = assignments.filter(a => 
          a.employeeId === emp.id && 
          a.date >= monthStartStr && 
          a.date <= monthEndStr
      );

      // Count unique days that have at least one assignment
      const plannedDays = new Set(empAssignments.map(a => a.date)).size;
      const freeDays = Math.round((capacity - plannedDays) * 10) / 10;
      const utilization = capacity > 0 ? Math.round((plannedDays / capacity) * 100) : 0;

      return { capacity, plannedDays, freeDays, utilization };
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Toolbar */}
      <div className="flex-none bg-white border-b border-charcoal-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-md shadow-sm border border-charcoal-200 p-0.5">
            <button onClick={handlePrev} className="p-1.5 hover:bg-charcoal-100 rounded-md text-charcoal-500"><ChevronLeft className="w-5 h-5" /></button>
            <div className="px-4 font-semibold text-charcoal-800 min-w-[160px] text-center">{headerTitle}</div>
            <button onClick={handleNext} className="p-1.5 hover:bg-charcoal-100 rounded-md text-charcoal-500"><ChevronRight className="w-5 h-5" /></button>
          </div>
          
          {readOnly && (
            <div className="px-2 py-0.5 rounded text-xs font-bold bg-charcoal-100 text-charcoal-500 flex items-center gap-1 border border-charcoal-200">
                <Lock className="w-3 h-3" /> Read Only
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
                variant={timeScale === TimeScale.MONTH ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setTimeScale(TimeScale.MONTH)}
            >
                {t('planner.month')}
            </Button>
            <Button 
                variant={timeScale === TimeScale.QUARTER ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setTimeScale(TimeScale.QUARTER)}
            >
                {t('planner.quarter')}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowLegend(true)} className={`p-2 rounded-md transition-colors ${showLegend ? 'bg-blue-100 text-blue-700' : 'hover:bg-charcoal-100 text-charcoal-500'}`}>
            <Info className="w-5 h-5" />
          </button>
          <Button variant="outline" className="gap-2" size="sm">
            <Share2 className="w-4 h-4" />
            {t('planner.exportState')}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col gap-8 max-w-[100vw]">
          {monthsToRender.map(monthStart => {
             const daysInMonth = eachDayOfInterval({ start: startOfMonth(monthStart), end: endOfMonth(monthStart) });
             
             // Calculate Weeks
             const weeks: { week: number, count: number }[] = [];
             daysInMonth.forEach(day => {
                const w = getISOWeek(day);
                if (weeks.length > 0 && weeks[weeks.length - 1].week === w) {
                    weeks[weeks.length - 1].count++;
                } else {
                    weeks.push({ week: w, count: 1 });
                }
             });

             return (
               <div key={monthStart.toISOString()} className="bg-white rounded-xl shadow-sm border border-charcoal-200 flex flex-col">
                  {/* Month Header */}
                  <div className="px-6 py-4 border-b border-charcoal-200 bg-charcoal-50 flex items-center gap-4 rounded-t-xl">
                     <h3 className="text-lg font-bold text-charcoal-900">{formatDate(monthStart, 'MMMM yyyy')}</h3>
                     <span className="text-sm text-charcoal-500 font-medium px-2 py-0.5 bg-white border border-charcoal-200 rounded-md shadow-sm">
                        {daysInMonth.length} Days
                     </span>
                  </div>

                  {/* Grid */}
                  <div className="overflow-x-auto custom-scrollbar rounded-b-xl">
                     <table className="w-full border-collapse">
                        <thead className="bg-white">
                           {/* Week Header Row */}
                           <tr className="h-6 border-b border-charcoal-200">
                                <th className="sticky left-0 top-0 z-30 bg-charcoal-50 border-r border-charcoal-200 w-64 min-w-[280px] text-left px-4 shadow-[2px_0_5px_rgba(0,0,0,0.05)]" rowSpan={2}>
                                    <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{t('planner.employee')}</span>
                                </th>
                                {weeks.map((week, idx) => (
                                    <th 
                                        key={`week-${week.week}-${idx}`} 
                                        colSpan={week.count} 
                                        className="sticky top-0 z-20 bg-charcoal-50/50 border-r border-charcoal-200 text-[10px] text-charcoal-500 font-medium text-center uppercase tracking-wider"
                                    >
                                        KW {week.week}
                                    </th>
                                ))}
                           </tr>
                           {/* Day Header Row */}
                           <tr className="h-10 border-b border-charcoal-200">
                              {daysInMonth.map(day => {
                                 const isWknd = isWeekend(day);
                                 const isMonday = getDay(day) === 1;
                                 const isTodayCell = isToday(day);
                                 return (
                                    <th 
                                      key={day.toISOString()}
                                      className={`
                                        sticky top-6 z-20
                                        min-w-[40px] w-10 text-center border-r border-charcoal-100 p-1
                                        ${isWknd ? 'bg-charcoal-50/50' : 'bg-white'}
                                        ${isMonday ? 'border-l border-l-charcoal-300' : ''}
                                      `}
                                    >
                                       <div className="flex flex-col items-center justify-center">
                                          <span className={`text-[9px] font-bold uppercase ${isMonday ? 'text-blue-600' : 'text-charcoal-400'}`}>
                                            {formatDate(day, 'EEE')}
                                          </span>
                                          <span className={`text-sm font-semibold leading-none ${isTodayCell ? 'text-blue-600' : 'text-charcoal-700'}`}>
                                            {formatDate(day, 'd')}
                                          </span>
                                       </div>
                                    </th>
                                 );
                              })}
                           </tr>
                        </thead>
                        <tbody>
                           {employees.map(emp => {
                              const stats = getEmployeeStats(emp, daysInMonth);

                              return (
                              <tr key={emp.id} className="group hover:bg-charcoal-50/30 transition-colors border-b border-charcoal-100 last:border-0">
                                 <td className="sticky left-0 z-10 bg-white group-hover:bg-charcoal-50/30 border-r border-charcoal-200 p-3 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full border border-charcoal-100" />
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-charcoal-900 truncate">{emp.name}</div>
                                                <div className="text-xs text-charcoal-500 truncate">{emp.role}</div>
                                            </div>
                                        </div>
                                        
                                        {/* Capacity Stats */}
                                        <div className="flex items-center justify-between pt-2 px-0.5">
                                            <div className="flex items-baseline gap-2 text-xs">
                                                <span className="text-charcoal-600" title={t('planner.plannedCapacity')}>
                                                    <span className="font-semibold text-charcoal-900">{stats.plannedDays}</span> / {stats.capacity}d
                                                </span>
                                                <span className={`text-[10px] ${stats.freeDays < 0 ? 'text-red-500 font-medium' : 'text-charcoal-400'}`} title={t('planner.freeDays')}>
                                                    {stats.freeDays > 0 ? `+${stats.freeDays}` : stats.freeDays}
                                                </span>
                                            </div>
                                            
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                stats.utilization > 100 ? 'bg-red-50 text-red-700 border-red-100' : 
                                                stats.utilization >= 80 ? 'bg-green-50 text-green-700 border-green-100' : 
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                {stats.utilization}%
                                            </div>
                                        </div>
                                    </div>
                                 </td>
                                 {daysInMonth.map(day => {
                                    const dayAssignments = getCellAssignments(emp.id, day);
                                    const isWknd = isWeekend(day);
                                    const isMonday = getDay(day) === 1;
                                    const isInteractive = !readOnly && !isWknd;
                                    const isDragTarget = draggingEmpId === emp.id && isInteractive;

                                    return (
                                       <td 
                                          key={day.toISOString()}
                                          onDragOver={(e) => isInteractive && handleDragOver(e, emp.id)}
                                          onDrop={(e) => isInteractive && handleDrop(e, emp.id, day)}
                                          onClick={() => isInteractive && setSelectedCell({ empId: emp.id, date: day })}
                                          className={`
                                             border-r border-charcoal-100 p-1 relative h-28 vertical-top transition-all group/cell
                                             ${isInteractive ? 'cursor-pointer hover:bg-blue-50/30' : (isWknd ? 'bg-charcoal-50/50 cursor-not-allowed' : 'bg-white cursor-default')}
                                             ${isDragTarget ? 'bg-blue-100 ring-2 ring-inset ring-blue-300' : ''}
                                             ${isMonday ? 'border-l border-l-charcoal-200' : ''}
                                          `}
                                       >
                                          <div className="flex flex-col gap-1 h-full overflow-hidden pb-6">
                                             {dayAssignments.map(a => {
                                                const proj = getProject(a.projectId);
                                                if (!proj) return null;
                                                return (
                                                   <div 
                                                      key={a.id}
                                                      draggable={!readOnly}
                                                      onDragStart={(e) => !readOnly && handleDragStart(e, a)}
                                                      onDragEnd={handleDragEnd}
                                                      className={`
                                                         text-[9px] pl-1 pr-0.5 py-0.5 rounded border shadow-sm select-none
                                                         ${PASTEL_VARIANTS[proj.color].bg} ${PASTEL_VARIANTS[proj.color].text} ${PASTEL_VARIANTS[proj.color].border}
                                                         ${!readOnly ? 'cursor-move hover:opacity-90 active:scale-95' : 'cursor-default'}
                                                         transition-transform flex items-center justify-between gap-1
                                                      `}
                                                      title={proj.name}
                                                   >
                                                      <span className="truncate">{proj.name}</span>
                                                      {isInteractive && (
                                                          <button
                                                              onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  e.preventDefault();
                                                                  handleRemoveAssignment(a.id);
                                                              }}
                                                              className="opacity-0 group-hover/cell:opacity-100 hover:bg-black/10 p-0.5 rounded transition-opacity flex-shrink-0"
                                                              title="Remove"
                                                          >
                                                              <X className="w-2.5 h-2.5" />
                                                          </button>
                                                      )}
                                                   </div>
                                                );
                                             })}
                                          </div>
                                          
                                          {isInteractive && (
                                              <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover/cell:opacity-100 transition-all duration-200 z-10 translate-y-2 group-hover/cell:translate-y-0">
                                                  <button 
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setSelectedCell({ empId: emp.id, date: day });
                                                      }}
                                                      className="w-full h-5 bg-white/90 hover:bg-blue-50 border border-charcoal-200 hover:border-blue-200 text-charcoal-400 hover:text-blue-600 rounded flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors"
                                                      title={t('planner.oneClickAssign')}
                                                  >
                                                      <Plus className="w-3.5 h-3.5" />
                                                  </button>
                                              </div>
                                          )}
                                       </td>
                                    );
                                 })}
                              </tr>
                           )})}
                        </tbody>
                     </table>
                  </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal 
        isOpen={!!selectedCell} 
        onClose={() => setSelectedCell(null)} 
        title={selectedCell ? `${t('planner.oneClickAssign')} - ${formatDate(selectedCell.date, 'dd. MMMM')}` : ''}
      >
        <div className="space-y-6">
            <div className="bg-charcoal-50 p-4 rounded-lg border border-charcoal-100">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-charcoal-700">{t('planner.employee')}</span>
                    {selectedCell && (
                        <div className="flex items-center gap-2">
                             <img src={employees.find(e => e.id === selectedCell.empId)?.avatar} className="w-6 h-6 rounded-full" />
                             <span className="text-sm text-charcoal-900">{employees.find(e => e.id === selectedCell.empId)?.name}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-charcoal-200">
                    <input 
                        type="checkbox" 
                        id="repeatMode" 
                        checked={isRepeatMode} 
                        onChange={(e) => setIsRepeatMode(e.target.checked)} 
                        className="rounded border-charcoal-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="repeatMode" className="text-sm text-charcoal-700 select-none flex items-center gap-2 cursor-pointer">
                        <Repeat className="w-4 h-4 text-charcoal-500" />
                        {t('planner.repeatMode')}
                    </label>
                </div>

                {isRepeatMode && (
                    <div className="mt-3 pl-6">
                        <div className="text-xs text-charcoal-500 mb-2 uppercase tracking-wide">{t('planner.applyOnDays')}:</div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(dayIdx => (
                                <button
                                    key={dayIdx}
                                    onClick={() => toggleRepeatDay(dayIdx)}
                                    className={`w-8 h-8 rounded text-xs font-bold transition-colors ${
                                        repeatDays.includes(dayIdx) 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'bg-white border border-charcoal-200 text-charcoal-500 hover:bg-charcoal-100'
                                    }`}
                                >
                                    {getDayLabel(dayIdx)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h4 className="text-sm font-medium text-charcoal-900 mb-3">{t('planner.selectProjects')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {projects.filter(p => p.status === 'active' || p.status === 'opportunity').map(project => {
                        const isSelected = selectedProjectIds.includes(project.id);
                        return (
                            <div 
                                key={project.id}
                                onClick={() => {
                                    if (isSelected) setSelectedProjectIds(prev => prev.filter(id => id !== project.id));
                                    else setSelectedProjectIds(prev => [...prev, project.id]);
                                }}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                    ${isSelected 
                                        ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20' 
                                        : 'bg-white border-charcoal-200 hover:border-charcoal-300 hover:bg-charcoal-50'}
                                `}
                            >
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${PASTEL_VARIANTS[project.color].bg} border ${PASTEL_VARIANTS[project.color].border}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-charcoal-900 truncate">{project.name}</div>
                                    <div className="text-xs text-charcoal-500 truncate">{project.client}</div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-charcoal-400 mt-2">
                    {t('planner.clickToAssign')}
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
                <Button variant="ghost" onClick={() => setSelectedCell(null)}>{t('planner.cancel')}</Button>
                <Button onClick={handleSaveAssignments}>{t('planner.save')}</Button>
            </div>
        </div>
      </Modal>

      {/* Legend Modal */}
      <Modal 
        isOpen={showLegend} 
        onClose={() => setShowLegend(false)} 
        title={t('planner.legend')}
        size="sm"
      >
        <div className="space-y-1">
            {projects.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-charcoal-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${PASTEL_VARIANTS[p.color].bg} border ${PASTEL_VARIANTS[p.color].border}`}></div>
                    <div>
                        <div className="text-sm font-medium text-charcoal-900">{p.name}</div>
                        <div className="text-xs text-charcoal-500">{p.client}</div>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowLegend(false)}>{t('sidebar.close')}</Button>
        </div>
      </Modal>
    </div>
  );
};