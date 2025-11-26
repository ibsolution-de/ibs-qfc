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
}

export interface Assignment {
  id: string;
  employeeId: string;
  projectId: string;
  date: string; // ISO YYYY-MM-DD
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
  forecastData: QuarterData[];
}

export enum ViewMode {
  PLANNER = 'PLANNER',
  FORECAST = 'FORECAST',
  TEAM = 'TEAM',
  PROJECTS = 'PROJECTS'
}

export enum TimeScale {
  MONTH = 'MONTH',
  QUARTER = 'QUARTER'
}
