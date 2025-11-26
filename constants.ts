import { Project, Employee, QuarterData, Assignment, PlanVersion } from './types';
import { eachDayOfInterval, format, getDay, isWeekend, getISOWeek } from 'date-fns';

export const PASTEL_VARIANTS = {
  blue: { bg: 'bg-pastel-blue', text: 'text-pastel-blueText', border: 'border-blue-200' },
  green: { bg: 'bg-pastel-green', text: 'text-pastel-greenText', border: 'border-green-200' },
  purple: { bg: 'bg-pastel-purple', text: 'text-pastel-purpleText', border: 'border-purple-200' },
  orange: { bg: 'bg-pastel-orange', text: 'text-pastel-orangeText', border: 'border-orange-200' },
  pink: { bg: 'bg-pastel-pink', text: 'text-pastel-pinkText', border: 'border-pink-200' },
  gray: { bg: 'bg-pastel-gray', text: 'text-pastel-grayText', border: 'border-gray-200' },
};

export const MOCK_PROJECTS: Project[] = [
  // Active Projects
  { id: 'p1', name: 'Energy Mgmt System', client: 'MAN', color: 'blue', status: 'active', budget: '50k', startDate: '2025-01-01', endDate: '2025-10-31', volume: 80, topic: 'Sustainability', notes: 'Core project for Q4' },
  { id: 'p2', name: 'Internal QFC App', client: 'IBs', color: 'purple', status: 'active', budget: '5k', startDate: '2025-06-01', endDate: '2025-12-31', volume: 20, topic: 'Internal Tooling', notes: 'MVP phase' },
  { id: 'p3', name: 'ÜBA 2.0', client: 'Soka Bau', color: 'green', status: 'active', budget: '100k', startDate: '2025-03-01', endDate: '2026-01-31', volume: 70, topic: 'Digitalization', notes: 'Long term contract' },
  { id: 'p4', name: 'Weiterbildung', client: 'Soka Bau', color: 'orange', status: 'active', budget: '80k', startDate: '2024-09-01', endDate: '2025-07-31', volume: 40, topic: 'Education', notes: 'Maintenance mode' },
  { id: 'p5', name: 'Intralogistic Shuttle', client: 'Storck', color: 'pink', status: 'active', budget: '100k', startDate: '2025-05-01', endDate: '2026-02-28', volume: 30, topic: 'Logistics', notes: 'Hardware integration required' },
  
  // Opportunities (Must Win & Alternatives)
  { id: 'p6', name: 'Rampe 160', client: 'Storck', color: 'gray', status: 'opportunity', budget: '150k', startDate: '2025-10-01', endDate: '2026-05-31', volume: 60, topic: 'Logistics', notes: 'Follow up to Shuttle' },
  { id: 'p7', name: 'Cloud Migration Ph2', client: 'Allianz', color: 'blue', status: 'opportunity', budget: '120k', startDate: '2025-04-15', endDate: '2025-09-30', volume: 50, topic: 'Cloud Infra', notes: 'AWS Migration' },
  { id: 'p8', name: 'GenAI POC', client: 'BMW', color: 'purple', status: 'opportunity', budget: '45k', startDate: '2025-05-15', endDate: '2025-08-15', volume: 25, topic: 'AI/ML', notes: 'Innovation lab' },
  { id: 'p9', name: 'Security Audit', client: 'Commerzbank', color: 'gray', status: 'opportunity', budget: '30k', startDate: '2025-03-01', endDate: '2025-03-31', volume: 15, topic: 'Security', notes: 'Regulatory requirement' },
  { id: 'p10', name: 'E-Shop Relaunch', client: 'DM Tech', color: 'pink', status: 'opportunity', budget: '90k', startDate: '2025-08-01', endDate: '2025-12-31', volume: 40, topic: 'E-Commerce', notes: 'High visibility' },
  { id: 'p11', name: 'HR Portal', client: 'Siemens', color: 'orange', status: 'opportunity', budget: '50k', startDate: '2025-06-01', endDate: '2025-09-30', volume: 30, topic: 'Internal', notes: '' },
  { id: 'p12', name: 'Data Lake Pilot', client: 'Lufthansa', color: 'green', status: 'opportunity', budget: '75k', startDate: '2025-04-01', endDate: '2025-07-31', volume: 35, topic: 'Data', notes: '' },
  // New Opportunities for Q1 2026
  { id: 'p13', name: 'Smart City Dashboard', client: 'Hamburg', color: 'blue', status: 'opportunity', budget: '200k', startDate: '2026-01-15', endDate: '2026-09-30', volume: 80, topic: 'Public Sector', notes: '' },
  { id: 'p14', name: 'FinTech App 2.0', client: 'N26', color: 'purple', status: 'opportunity', budget: '150k', startDate: '2026-02-01', endDate: '2026-08-31', volume: 70, topic: 'Finance', notes: '' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: 'e1', 
    name: 'Nazar Kulyk', 
    role: 'PM, Architect, Dev', 
    avatar: 'https://ui-avatars.com/api/?name=Nazar+Kulyk&background=0D8ABC&color=fff',
    skills: ['React', 'Node.js', 'Architecture', 'Leadership'],
    availability: 100,
    email: 'nazar@ibs.com',
    phone: '+49 123 456789',
    notes: 'Key resource for architecture decisions.'
  },
  { 
    id: 'e2', 
    name: 'Max Berreichsleiter', 
    role: 'Dev, DevOps, Backend', 
    avatar: 'https://ui-avatars.com/api/?name=Max+Berreichsleiter&background=E8F5E9&color=2E7D32',
    skills: ['Kubernetes', 'Go', 'Python', 'AWS'],
    availability: 100,
    email: 'max@ibs.com',
    notes: 'Prefer backend tasks.'
  },
  { 
    id: 'e3', 
    name: 'Dana Turocman', 
    role: 'Frontend, UX/UI, Design', 
    avatar: 'https://ui-avatars.com/api/?name=Dana+Turocman&background=F3E5F5&color=7B1FA2',
    skills: ['Figma', 'React', 'CSS', 'Accessibility'],
    availability: 80,
    email: 'dana@ibs.com',
    notes: 'Part-time on Fridays.'
  },
  { 
    id: 'e4', 
    name: 'Test Freund', 
    role: 'Requirements, QA', 
    avatar: 'https://ui-avatars.com/api/?name=Test+Freund&background=FFF3E0&color=EF6C00',
    skills: ['Jira', 'Selenium', 'User Stories'],
    availability: 100,
    email: 'test@ibs.com'
  },
];

// Helper to find projects
const getP = (id: string) => MOCK_PROJECTS.find(p => p.id === id)!;

// Helper function to generate mock assignments for Soka Bau request
const generateSokaBauAssignments = (): Assignment[] => {
  const assignments: Assignment[] = [];
  const start = new Date(2025, 10, 1); // Nov 1, 2025
  const end = new Date(2025, 11, 31); // Dec 31, 2025
  const days = eachDayOfInterval({ start, end });

  days.forEach(d => {
    if (isWeekend(d)) return;
    const day = getDay(d); // 0=Sun, 1=Mon...
    const weekNum = getISOWeek(d);
    const dateStr = format(d, 'yyyy-MM-dd');

    // Max (e2) & Dana (e3): Full (Mon-Fri) on ÜBA 2.0 (p3)
    assignments.push({ id: `auto-e2-${dateStr}`, employeeId: 'e2', projectId: 'p3', date: dateStr });
    assignments.push({ id: `auto-e3-${dateStr}`, employeeId: 'e3', projectId: 'p3', date: dateStr });

    // Nazar (e1): 75% Target Capacity
    // Logic: 4 days (Mon-Thu) is 80%. To average 75%, we work 3 days (Mon-Wed) every 4th week.
    // (4+4+4+3)/20 days = 15/20 = 75%.
    const isShortWeek = weekNum % 4 === 0;
    const workDays = isShortWeek ? 3 : 4; // Mon-Wed (3) or Mon-Thu (4)
    
    if (day >= 1 && day <= workDays) {
      assignments.push({ id: `auto-e1-${dateStr}`, employeeId: 'e1', projectId: 'p3', date: dateStr });
    }
  });
  return assignments;
}

// --- FUTURE QUARTER MOCKS ---

// Outlook for V1 (Initial Plan): Rampe 160 is still an Opportunity
const Q1_2026_OUTLOOK_V1: QuarterData = {
    id: 'q1-2026-outlook-v1',
    name: 'Q1 2026',
    months: ['Jan', 'Feb', 'Mar'],
    totalCapacity: [80, 80, 80],
    runningProjects: [getP('p3'), getP('p5')], // UBA, Shuttle
    mustWinOpportunities: [getP('p6'), getP('p13')], // Rampe(Opp), Smart City
    alternativeOpportunities: [],
    notes: 'Outlook: Need to close Rampe 160 to fill capacity in Q1.'
};

const Q2_2026_OUTLOOK_V1: QuarterData = {
    id: 'q2-2026-outlook-v1',
    name: 'Q2 2026',
    months: ['Apr', 'May', 'Jun'],
    totalCapacity: [80, 80, 80],
    runningProjects: [getP('p5')], // Shuttle
    mustWinOpportunities: [getP('p6'), getP('p13')],
    alternativeOpportunities: [],
    notes: 'Long term outlook: Pipeline building needed.'
};

// Outlook for V2 (Adjusted Plan): Rampe 160 is Won (Active)
const Q1_2026_OUTLOOK_V2: QuarterData = {
    id: 'q1-2026-outlook-v2',
    name: 'Q1 2026',
    months: ['Jan', 'Feb', 'Mar'],
    totalCapacity: [80, 80, 80],
    runningProjects: [getP('p3'), getP('p5'), getP('p6')], // UBA, Shuttle, Rampe(Won)
    mustWinOpportunities: [getP('p13')], // Smart City
    alternativeOpportunities: [],
    notes: 'Outlook: Strong start with Rampe secured. Focus on Smart City.'
};

const Q2_2026_OUTLOOK_V2: QuarterData = {
    id: 'q2-2026-outlook-v2',
    name: 'Q2 2026',
    months: ['Apr', 'May', 'Jun'],
    totalCapacity: [80, 80, 80],
    runningProjects: [getP('p5'), getP('p6')], // Shuttle, Rampe
    mustWinOpportunities: [getP('p13')],
    alternativeOpportunities: [],
    notes: 'Stable utilization expected mid-year.'
};

// Outlook for V3 (Q1 Plan): Look ahead to Q2 & Q3
const Q2_2026_FUTURE: QuarterData = {
    id: 'q2-2026-future',
    name: 'Q2 2026',
    months: ['Apr', 'May', 'Jun'],
    totalCapacity: [80, 80, 80],
    runningProjects: [], // Cleared to show severe under-planning
    mustWinOpportunities: [getP('p13')], // Only Smart City Dashboard
    alternativeOpportunities: [],
    notes: 'CRITICAL: Severe capacity under-utilization projected. Sales pipeline dry after Smart City.'
};

const Q3_2026_FUTURE: QuarterData = {
    id: 'q3-2026-future',
    name: 'Q3 2026',
    months: ['Jul', 'Aug', 'Sep'],
    totalCapacity: [80, 80, 80],
    runningProjects: [getP('p6'), getP('p13')], // Rampe, Smart City (assumed won)
    mustWinOpportunities: [],
    alternativeOpportunities: [],
    notes: 'Summer period planning.'
};


// --- Version 1: Initial Q4 2025 Plan ---
const FORECAST_Q4_2025_INITIAL: QuarterData[] = [
  {
    id: 'q4-2025-init',
    name: 'Q4 2025',
    months: ['Oct', 'Nov', 'Dec'],
    totalCapacity: [80, 80, 60], // Dec lower due to holidays
    runningProjects: [getP('p2'), getP('p5'), getP('p3')], // Internal App, Shuttle, UBA
    mustWinOpportunities: [getP('p6')], // Rampe 160
    alternativeOpportunities: [getP('p10')], // E-Shop
    notes: 'Initial plan. Rampe 160 is critical for utilization.'
  },
  Q1_2026_OUTLOOK_V1,
  Q2_2026_OUTLOOK_V1
];
const ASSIGNMENTS_Q4_2025_INITIAL: Assignment[] = [
    { id: 'a1', employeeId: 'e1', projectId: 'p5', date: '2025-10-06' },
    { id: 'a2', employeeId: 'e1', projectId: 'p5', date: '2025-10-07' },
    { id: 'a3', employeeId: 'e2', projectId: 'p3', date: '2025-10-06' },
    { id: 'a4', employeeId: 'e3', projectId: 'p2', date: '2025-10-08' },
    ...generateSokaBauAssignments() // Inject generated Soka Bau assignments for Nov/Dec
];

// --- Version 2: Adjusted Q4 2025 Plan (After Call) ---
const FORECAST_Q4_2025_ADJUSTED: QuarterData[] = [
  {
    id: 'q4-2025-adj',
    name: 'Q4 2025',
    months: ['Oct', 'Nov', 'Dec'],
    totalCapacity: [80, 80, 60],
    runningProjects: [getP('p2'), getP('p5'), getP('p3'), getP('p6')], // Rampe 160 moved to Running!
    mustWinOpportunities: [], // Cleared
    alternativeOpportunities: [getP('p10'), getP('p9')], // Added Security Audit as backup
    notes: 'ADJUSTED: Rampe 160 won! Moved to active. Capacity is healthy (+20d reserve).'
  },
  Q1_2026_OUTLOOK_V2,
  Q2_2026_OUTLOOK_V2
];
const ASSIGNMENTS_Q4_2025_ADJUSTED: Assignment[] = [
    ...ASSIGNMENTS_Q4_2025_INITIAL,
    { id: 'a5', employeeId: 'e1', projectId: 'p6', date: '2025-10-15' }, // Working on Rampe
    { id: 'a6', employeeId: 'e2', projectId: 'p6', date: '2025-10-15' },
    { id: 'a7', employeeId: 'e4', projectId: 'p6', date: '2025-10-16' },
];

// --- Version 3: Preparing Q1 2026 Plan (Updated to include Q4 2025 as current) ---
const FORECAST_Q1_2026: QuarterData[] = [
  FORECAST_Q4_2025_ADJUSTED[0], // Include Q4 2025 (Adjusted) as the current quarter
  {
    id: 'q1-2026',
    name: 'Q1 2026',
    months: ['Jan', 'Feb', 'Mar'],
    totalCapacity: [80, 80, 80],
    runningProjects: [getP('p3'), getP('p5'), getP('p6')], // UBA, Shuttle, Rampe continue
    mustWinOpportunities: [getP('p13')], // Smart City
    alternativeOpportunities: [getP('p14')], // FinTech
    notes: 'Planning for Q1. Focus on Smart City Dashboard acquisition.'
  },
  Q2_2026_FUTURE,
];
const ASSIGNMENTS_Q1_2026: Assignment[] = [
    ...ASSIGNMENTS_Q4_2025_ADJUSTED, // Include previous assignments for continuity
    { id: 'b1', employeeId: 'e1', projectId: 'p6', date: '2026-01-12' },
    { id: 'b2', employeeId: 'e2', projectId: 'p3', date: '2026-01-13' },
    { id: 'b3', employeeId: 'e3', projectId: 'p5', date: '2026-01-14' },
];

// Define the 3 requested versions
export const MOCK_VERSIONS: PlanVersion[] = [
  {
    id: 'v1',
    name: 'Initial Q4 2025 Plan',
    createdAt: '2025-09-15T10:00:00Z',
    assignments: ASSIGNMENTS_Q4_2025_INITIAL,
    forecastData: FORECAST_Q4_2025_INITIAL
  },
  {
    id: 'v2',
    name: 'Adjusted Q4 2025 Plan after QFC Call',
    createdAt: '2025-09-20T14:30:00Z',
    assignments: ASSIGNMENTS_Q4_2025_ADJUSTED,
    forecastData: FORECAST_Q4_2025_ADJUSTED
  },
  {
    id: 'v3',
    name: 'Preparing Q1 2026 Plan',
    createdAt: '2025-11-05T09:15:00Z',
    assignments: ASSIGNMENTS_Q1_2026,
    forecastData: FORECAST_Q1_2026
  }
];