import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// TypeScript interfaces for dashboard data
export interface DashboardStats {
  kpiCards: {
    totalSubApps: {
      value: string;
      thisMonth: number;
      percentageChange: string;
    };
    activeUsers: {
      value: string;
      percentageChange: number;
    };
    dailyLogins: {
      value: string;
      percentageChange: number;
    };
    issues: {
      value: string;
      percentageChange: number;
    };
  };
  charts: {
    dailyLoginTrends: Array<{
      name: string;
      value: number;
    }>;
    appUsageDistribution: {
      xAxisData: string[];
      seriesData: Array<{
        name: string;
        data: number[];
      }>;
    };
  };
  recentApps: Array<{
    appIcon: string;
    appName: string;
    appId: string;
    subdomain: string;
    health: string;
    status: string;
    created: string;
    updated: string;
    company: string;
    website: string;
    category: string;
    modules: Array<{
      name: string;
      icon: string;
    }>;
    connectedApis: Array<{
      name: string;
      status: string;
    }>;
    meters: {
      total: number;
      active: number;
      inactive: number;
    };
    tickets: {
      count: number;
      icon: string;
    };
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalApps: number;
    appsPerPage: number;
  };
}

// API function to fetch dashboard stats
export const getSuperAdminDashboardStats = async (page: number = 1, limit: number = 6): Promise<DashboardStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/apps/dashboard/stats`, {
      params: { page, limit }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 