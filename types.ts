
export interface Milestone {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  phase: 'planning' | 'development' | 'testing' | 'deployment';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';
  status: 'active' | 'opportunity' | 'completed' | 'on_hold';
  volume?: number; // Days
  startDate?: string;
  endDate?: string;
  budget?: string;
  // New fields
  topic?: string;
  notes?: string;
  isCritical?: boolean; // Critical for conflict detection
  hourlyRate?: number; // EUR per hour (default ~100)
  milestones?: Milestone[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  // New fields
  skills: string[];
  availability: number; // 0-100%
  email?: string;
  phone?: string;
  notes?: string;
  location: string; // e.g. 'DE', 'US', 'UK'
  teamId?: string; // For grouping
}

export interface Customer {
  id: string;
  name: string;
  logo: string;
  industry: string;
  contactName: string;
  email: string;
  notes?: string;
}

export interface Assignment {
  id: string;
  employeeId: string;
  projectId: string;
  date: string; // ISO YYYY-MM-DD
  allocation: number; // 0.1 to 1.0 (10% to 100%)
}

export interface Absence {
  id: string;
  employeeId: string;
  date: string; // ISO YYYY-MM-DD
  type: 'vacation' | 'sick' | 'training';
  approved: boolean;
}

export interface PublicHoliday {
  date: string; // ISO YYYY-MM-DD
  name: string;
  location: string; // 'ALL' or specific country code
}

export interface QuarterData {
  id: string;
  name: string; // e.g., "Q1 2024"
  months: string[]; // e.g., ["January", "February", "March"]
  totalCapacity: number[]; // Capacity for each month in days
  runningProjects: Project[];
  mustWinOpportunities: Project[];
  alternativeOpportunities: Project[];
  notes: string;
}

export interface PlanVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO String
  assignments: Assignment[];
  absences: Absence[]; // Versioned absences
  forecastData: QuarterData[];
}

export type UserRole = 'employee' | 'pm' | 'bl';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  employeeId?: string; // Links to an employee record if applicable
}

export enum ViewMode {
  MY_OVERVIEW = 'MY_OVERVIEW',
  PLANNER = 'PLANNER',
  FORECAST = 'FORECAST',
  TEAM = 'TEAM',
  PROJECTS = 'PROJECTS',
  CUSTOMERS = 'CUSTOMERS',
  FINANCIALS = 'FINANCIALS'
}

export enum TimeScale {
  MONTH = 'MONTH',
  QUARTER = 'QUARTER'
}
