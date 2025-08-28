export interface BusinessEntry {
  date: string;
  revenue: number;
  salaries: number;
  expenses: number;
  netProfit: number;
  clients?: number;
  hours?: number;
  investor?: number;
  items?: string;
  video?: number;
  promotion?: number;
  transactions?: number;
  notes: string;
}

export interface BusinessData {
  id: string;
  name: string;
  color: string;
  entries: BusinessEntry[];
  totalRevenue: number;
  totalSalaries: number;
  totalExpenses: number;
  totalNetProfit: number;
}

export interface OverallHealth {
  totalRevenue: number;
  totalNetProfit: number;
  totalExpenses: number;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
  profitMargin: number;
  historicalData: Array<{
    date: string;
    totalNetProfit: number;
    totalRevenue: number;
  }>;
}

export interface BusinessMetrics {
  currentWeek: number;
  previousWeek: number;
  monthToDate: number;
  weeklyGrowth: number;
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
}

export const BUSINESSES = [
  { id: 'iclean', name: 'iClean', color: 'iclean' },
  { id: 'icandy', name: 'iCandy Factory', color: 'icandy' },
  { id: 'apl', name: 'Angry Panda Logistics', color: 'apl' },
  { id: 'apmg', name: 'Angry Panda Music Group', color: 'apmg' },
  { id: 'instafund', name: 'Insta Fund', color: 'instafund' }
] as const;