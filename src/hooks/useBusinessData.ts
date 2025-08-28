import { useState, useEffect, useCallback } from 'react';
import { BusinessData, BusinessEntry, OverallHealth, BusinessMetrics, BUSINESSES } from '@/types/business';

const STORAGE_KEY = 'polymath-dashboard-data';
const HISTORY_KEY = 'polymath-dashboard-history';

export function useBusinessData() {
  const [businesses, setBusinesses] = useState<BusinessData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Migrate old data structure if needed
        return parsedData.map((business: any) => {
          if (business.entries) {
            return business; // Already new format
          } else {
            // Convert old format to new format
            return {
              id: business.id,
              name: business.name,
              color: business.color,
              entries: business.date ? [{
                date: business.date,
                revenue: business.revenue || 0,
                salaries: business.salaries || 0,
                expenses: business.expenses || 0,
                netProfit: business.netProfit || 0,
                clients: business.clients,
                hours: business.hours,
                investor: business.investor,
                items: business.items,
                video: business.video,
                promotion: business.promotion,
                transactions: business.transactions,
                notes: business.notes || ''
              }] : [],
              totalRevenue: business.revenue || 0,
              totalSalaries: business.salaries || 0,
              totalExpenses: business.expenses || 0,
              totalNetProfit: business.netProfit || 0
            };
          }
        });
      } catch {
        // If parsing fails, initialize fresh
      }
    }
    
    // Initialize with empty data for each business
    return BUSINESSES.map(business => ({
      id: business.id,
      name: business.name,
      color: business.color,
      entries: [],
      totalRevenue: 0,
      totalSalaries: 0,
      totalExpenses: 0,
      totalNetProfit: 0
    }));
  });

  const [history, setHistory] = useState<BusinessData[][]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const addBusinessEntry = useCallback((businessId: string, entry: Omit<BusinessEntry, 'netProfit'>) => {
    const netProfit = entry.revenue - entry.salaries - entry.expenses;
    const fullEntry = { ...entry, netProfit };

    setBusinesses(prev => {
      const newBusinesses = prev.map(business => 
        business.id === businessId 
          ? {
              ...business,
              entries: [...business.entries, fullEntry],
              totalRevenue: business.totalRevenue + entry.revenue,
              totalSalaries: business.totalSalaries + entry.salaries,
              totalExpenses: business.totalExpenses + entry.expenses,
              totalNetProfit: business.totalNetProfit + netProfit
            }
          : business
      );
      
      // Auto-save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBusinesses));
      
      return newBusinesses;
    });
  }, []);

  const saveData = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
    
    // Add current state to history
    const newHistory = [...history, [...businesses]];
    const limitedHistory = newHistory.slice(-52); // Keep last 52 weeks
    setHistory(limitedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  }, [businesses, history]);

  const getCurrentEntry = useCallback((businessId: string): BusinessEntry => {
    const business = businesses.find(b => b.id === businessId);
    const latestEntry = business?.entries[business.entries.length - 1];
    
    return latestEntry || {
      date: new Date().toISOString().split('T')[0],
      revenue: 0,
      salaries: 0,
      expenses: 0,
      netProfit: 0,
      notes: ''
    };
  }, [businesses]);

  const updateCurrentEntry = useCallback((businessId: string, updates: Partial<BusinessEntry>) => {
    setBusinesses(prev => {
      const newBusinesses = prev.map(business => {
        if (business.id !== businessId) return business;
        
        const entries = [...business.entries];
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry && lastEntry.date === new Date().toISOString().split('T')[0]) {
          // Update today's entry
          const updatedEntry = { ...lastEntry, ...updates };
          updatedEntry.netProfit = updatedEntry.revenue - updatedEntry.salaries - updatedEntry.expenses;
          entries[entries.length - 1] = updatedEntry;
          
          // Recalculate totals
          const totalRevenue = entries.reduce((sum, entry) => sum + entry.revenue, 0);
          const totalSalaries = entries.reduce((sum, entry) => sum + entry.salaries, 0);
          const totalExpenses = entries.reduce((sum, entry) => sum + entry.expenses, 0);
          const totalNetProfit = entries.reduce((sum, entry) => sum + entry.netProfit, 0);
          
          return {
            ...business,
            entries,
            totalRevenue,
            totalSalaries,
            totalExpenses,
            totalNetProfit
          };
        } else {
          // Create new entry for today
          const newEntry: BusinessEntry = {
            date: new Date().toISOString().split('T')[0],
            revenue: 0,
            salaries: 0,
            expenses: 0,
            netProfit: 0,
            notes: '',
            ...updates
          };
          newEntry.netProfit = newEntry.revenue - newEntry.salaries - newEntry.expenses;
          
          return {
            ...business,
            entries: [...entries, newEntry],
            totalRevenue: business.totalRevenue + newEntry.revenue,
            totalSalaries: business.totalSalaries + newEntry.salaries,
            totalExpenses: business.totalExpenses + newEntry.expenses,
            totalNetProfit: business.totalNetProfit + newEntry.netProfit
          };
        }
      });
      
      // Auto-save to localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBusinesses));
      
      return newBusinesses;
    });
  }, []);

  const getOverallHealth = useCallback((): OverallHealth => {
    const totalRevenue = businesses.reduce((sum, b) => sum + b.totalRevenue, 0);
    const totalNetProfit = businesses.reduce((sum, b) => sum + b.totalNetProfit, 0);
    const totalExpenses = businesses.reduce((sum, b) => sum + b.totalSalaries + b.totalExpenses, 0);
    
    const profitMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;
    
    // Calculate health score (0-100)
    let healthScore = 50; // Base score
    if (totalNetProfit > 0) healthScore += 30;
    if (profitMargin > 20) healthScore += 20;
    if (profitMargin > 10) healthScore += 10;
    if (totalRevenue > totalExpenses) healthScore += 10;
    
    // Create historical data from all business entries
    const historicalData: Array<{ date: string; totalNetProfit: number; totalRevenue: number }> = [];
    const dateMap = new Map<string, { totalNetProfit: number; totalRevenue: number }>();
    
    businesses.forEach(business => {
      business.entries.forEach(entry => {
        const existing = dateMap.get(entry.date) || { totalNetProfit: 0, totalRevenue: 0 };
        dateMap.set(entry.date, {
          totalNetProfit: existing.totalNetProfit + entry.netProfit,
          totalRevenue: existing.totalRevenue + entry.revenue
        });
      });
    });
    
    // Convert map to array and sort by date
    Array.from(dateMap.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .forEach(([date, data]) => {
        historicalData.push({ date, ...data });
      });
    
    // Determine trend from historical data
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (historicalData.length >= 2) {
      const recent = historicalData[historicalData.length - 1].totalNetProfit;
      const previous = historicalData[historicalData.length - 2].totalNetProfit;
      
      if (recent > previous * 1.05) trend = 'up';
      else if (recent < previous * 0.95) trend = 'down';
    }

    return {
      totalRevenue,
      totalNetProfit,
      totalExpenses,
      healthScore: Math.min(100, Math.max(0, healthScore)),
      trend,
      profitMargin,
      historicalData
    };
  }, [businesses]);

  const getBusinessMetrics = useCallback((businessId: string): BusinessMetrics => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) {
      return {
        currentWeek: 0,
        previousWeek: 0,
        monthToDate: 0,
        weeklyGrowth: 0,
        healthStatus: 'critical'
      };
    }

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const currentWeek = business.entries
      .filter(entry => new Date(entry.date) >= lastWeek)
      .reduce((sum, entry) => sum + entry.netProfit, 0);

    const previousWeek = business.entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        return entryDate >= twoWeeksAgo && entryDate < lastWeek;
      })
      .reduce((sum, entry) => sum + entry.netProfit, 0);

    const monthToDate = business.entries
      .filter(entry => new Date(entry.date) >= lastMonth)
      .reduce((sum, entry) => sum + entry.netProfit, 0);

    const weeklyGrowth = previousWeek > 0 
      ? ((currentWeek - previousWeek) / previousWeek) * 100 
      : 0;

    let healthStatus: BusinessMetrics['healthStatus'] = 'critical';
    if (business.totalNetProfit > 5000) healthStatus = 'excellent';
    else if (business.totalNetProfit > 2500) healthStatus = 'good';
    else if (business.totalNetProfit > 0) healthStatus = 'warning';

    return {
      currentWeek,
      previousWeek,
      monthToDate,
      weeklyGrowth,
      healthStatus
    };
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
  }, [businesses]);

  return {
    businesses,
    addBusinessEntry,
    getCurrentEntry,
    updateCurrentEntry,
    saveData,
    getOverallHealth,
    getBusinessMetrics,
    history
  };
}