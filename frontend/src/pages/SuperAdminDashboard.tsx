import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import PageC from "@/components/global/PageC";
import { getSuperAdminDashboardStats } from "@/api/dashboardApi";
import type { DashboardStats } from "@/api/dashboardApi";
// @ts-ignore
import { debounce } from "throttle-debounce";

// Dummy data for fallback
const dummyDashboardData: DashboardStats = {
  kpiCards: {
    totalSubApps: { value: "0", thisMonth: 0, percentageChange: "0" },
    activeUsers: { value: "0", percentageChange: 0 },
    dailyLogins: { value: "0", percentageChange: 0 },
    issues: { value: "0", percentageChange: 0 }
  },
  charts: {
    dailyLoginTrends: [
      { value: 0, name: "TGNPDCL" },
      { value: 0, name: "GMR" },
      { value: 0, name: "Railway" },
      { value: 0, name: "Lkea" },
      { value: 0, name: "NTPC" }
    ],
    appUsageDistribution: {
      xAxisData: ["TGNPDCL", "GMR", "Railway", "Lkea", "NTPC"],
      seriesData: [
        { name: "Active Users", data: [0, 0, 0, 0, 0, 0] },
        { name: "Sessions", data: [0, 0, 0, 0, 0, 0] }
      ]
    }
  },
  recentApps: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalApps: 0,
    appsPerPage: 6
  }
};

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State for API data
  const [dashboardData, setDashboardData] = useState<DashboardStats>(dummyDashboardData);
  
  // Loading states
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  
  // State for tracking failed APIs
  const [failedApis, setFailedApis] = useState<Array<{
    id: string;
    name: string;
    retryFunction: () => Promise<void>;
    errorMessage: string;
  }>>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [appsPerPage] = useState(6);
  const [searchValue, setSearchValue] = useState('');
  const [displaySearchValue, setDisplaySearchValue] = useState(''); // For immediate UI updates
  const [isSearching, setIsSearching] = useState(false);

  // Retry function for Dashboard API
  const retryDashboardAPI = async () => {
    setIsDashboardLoading(true);
    try {
      const data = await getSuperAdminDashboardStats(currentPage, appsPerPage);
      setDashboardData(data);
      // Remove from failed APIs on success
      setFailedApis(prev => prev.filter(api => api.id !== 'dashboard'));
    } catch (err: any) {
      console.error("Error in Dashboard API:", err);
      setDashboardData(dummyDashboardData);
    } finally {
      // Add a small delay to make loading state visible
      setTimeout(() => {
        setIsDashboardLoading(false);
      }, 1000);
    }
  };

  // Retry specific API
  const retrySpecificAPI = (apiId: string) => {
    const api = failedApis.find(a => a.id === apiId);
    if (api) {
      api.retryFunction();
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(300, (searchTerm: string) => {
      setIsSearching(true);
      setSearchValue(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
      // Reset searching state after a short delay
      setTimeout(() => setIsSearching(false), 100);
    }),
    []
  );

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsDashboardLoading(true);
      try {
        const data = await getSuperAdminDashboardStats(currentPage, appsPerPage);
        setDashboardData(data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setDashboardData(dummyDashboardData);
        
        // Add to failed APIs
        setFailedApis(prev => {
          if (!prev.find(api => api.id === 'dashboard')) {
            return [...prev, { 
              id: 'dashboard', 
              name: 'Dashboard Data', 
              retryFunction: retryDashboardAPI, 
              errorMessage: 'Failed to load Dashboard Data. Please try again.' 
            }];
          }
          return prev;
        });
      } finally {
        // Add a small delay to make loading state visible
        setTimeout(() => {
          setIsDashboardLoading(false);
        }, 1000);
      }
    };

    fetchDashboardData();
  }, [currentPage, appsPerPage]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // KPI Cards Data - Using real data from backend
  const kpiCards = [
    {
      title: "Total Sub-Apps",
      value: dashboardData?.kpiCards?.totalSubApps?.value || "0",
      icon: "/icons/apps-add.svg",
      showTrend: true,
      comparisonValue: parseFloat(dashboardData?.kpiCards?.totalSubApps?.percentageChange || "0"),
      subtitle1: `${dashboardData?.kpiCards?.totalSubApps?.thisMonth || 0} created this month`,
      subtitle2: `${dashboardData?.kpiCards?.totalSubApps?.percentageChange || 0}% from last month`,
      onValueClick: () => navigate("/sub-apps"),
      bg: "bg-stat-icon-gradient",
      loading: isDashboardLoading,
    },
    {
      title: "Active Users",
      value: dashboardData?.kpiCards?.activeUsers?.value || "0",
      icon: "/icons/active-users.svg",
      showTrend: true,
      comparisonValue: dashboardData?.kpiCards?.activeUsers?.percentageChange || 0,
      subtitle1: "Across all applications",
      subtitle2: `${dashboardData?.kpiCards?.activeUsers?.percentageChange || 0}% from last month`,
      onValueClick: () => navigate("/active-users"),
      bg: "bg-stat-icon-gradient",
      loading: isDashboardLoading,
    },
    {
      title: "Daily Logins",
      value: dashboardData?.kpiCards?.dailyLogins?.value || "0",
      icon: "/icons/daily-logins.svg",
      showTrend: true,
      comparisonValue: dashboardData?.kpiCards?.dailyLogins?.percentageChange || 0,
      subtitle1: "Last 24 hours",
      subtitle2: `${dashboardData?.kpiCards?.dailyLogins?.percentageChange || 0}% from last month`,
      onValueClick: () => navigate("/daily-logins"),
      bg: "bg-stat-icon-gradient",
      loading: isDashboardLoading,
    },
    {
      title: "Issues",
      value: dashboardData?.kpiCards?.issues?.value || "0",
      icon: "/icons/alert-triggered.svg",
      showTrend: true,
      comparisonValue: dashboardData?.kpiCards?.issues?.percentageChange || 0,
      subtitle1: "Needs attention",
      subtitle2: `${dashboardData?.kpiCards?.issues?.percentageChange || 0}% from last month`,
      onValueClick: () => navigate("/issues"),
      bg: "bg-stat-icon-gradient",
      loading: isDashboardLoading,
    },
  ];

  // Daily Login Trends Data for Pie Chart - Using real data from backend
  const dailyLoginTrendsData = dashboardData?.charts?.dailyLoginTrends || [
    { value: 0, name: "TGNPDCL" },
    { value: 0, name: "GMR" },
    { value: 0, name: "Railway" },
    { value: 0, name: "Lkea" },
    { value: 0, name: "NTPC" },
  ];

  // App Usage Distribution Data for Bar Chart - Using real data from backend
  const appUsageData = {
    xAxisData: dashboardData?.charts?.appUsageDistribution?.xAxisData || ["TGNPDCL", "GMR", "Railway", "Lkea", "NTPC"],
    seriesData: dashboardData?.charts?.appUsageDistribution?.seriesData || [
      {
        name: "Active Users",
        data: [0, 0, 0, 0, 0, 0],
      },
      {
        name: "Sessions",
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
    seriesColors: [
      "#3B82F6", // Blue for Active Users
      "#10B981", // Green for Sessions
    ],
  };

  // Recent Apps Data - Using real data from backend
  const recentApps = dashboardData?.recentApps || [];
  const pagination = dashboardData?.pagination;

  // Filter apps based on search term
  const filteredApps = recentApps.filter((app: any) => {
    if (!searchValue.trim()) return true;
    
    const searchTerms = searchValue.toLowerCase().trim().split(/\s+/);
    const appData = [
      app.appName || '',
      app.company || '',
      app.category || '',
      app.subdomain || '',
      app.status || ''
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => appData.includes(term));
  });

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Search handler with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplaySearchValue(newValue); // Update UI immediately
    debouncedSearch(newValue); // Debounce the actual search
  };

  return (
    <div className="">
      <PageC
        sections={[
          // Error Section - Above PageHeader
          ...(failedApis.length > 0 ? [{
            layout: {
              type: 'column' as const,
              gap: 'gap-4',
              rows: [
                {
                  layout: 'column' as const,
                  columns: [
                    {
                      name: 'Error',
                      props: {
                        visibleErrors: failedApis.map(api => api.errorMessage),
                        showRetry: true,
                        maxVisibleErrors: 3, // Show max 3 errors at once
                        failedApis: failedApis, // Pass all failed APIs for individual retry
                        onRetrySpecific: retrySpecificAPI, // Pass the retry function
                      },
                    },
                  ],
                },
              ],
            },
          }] : []),
          // Header section
          {
            layout: {
              type: "grid" as const,
              columns: 1,
              className: "",
            },
            components: [
              {
                name: "PageHeader",
                props: {
                  title: "Super Admin Dashboard",
                  buttonsLabel: "Create New App",
                  variant: "primary",
                  onClick: () => navigate("/apps"),
                  showMenu: true,
                  showDropdown: true,
                  menuItems: [
                    { id: "create-project", label: "Create Project" },
                    { id: "export", label: "Export Report" },
                  ],
                  onMenuItemClick: (itemId: string) => {
                    switch (itemId) {
                      case "create-project":
                        navigate("/apps");
                        break;
                      case "export":
                        // Export functionality
                        break;
                    }
                  },
                },
              },
            ],
          },
          // Main Statistics Cards
          {
            layout: {
              type: "grid",
              columns: 4,
              gap: "gap-4",
              className: "",
            },
            components: [
              ...kpiCards.map((card) => ({
                name: "Card",
                props: {
                  title: card.title,
                  value: card.value,
                  icon: card.icon,
                  subtitle1: card.subtitle1,
                  subtitle2: card.subtitle2,
                  showTrend: card.showTrend,
                  comparisonValue: card.comparisonValue,
                  onValueClick: card.onValueClick,
                  bg: card.bg,
                  loading: card.loading,
                },
              })),
            ],
          },
          // Charts Section - Daily Login Trends and App Usage Distribution
          {
            layout: {
              type: "grid",
              columns: 2,
              gap: "gap-6",
              className: "w-full",
              rows: [
                {
                  layout: "column",
                  gap: "gap-1",
                  className:
                    "bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1",
                  columns: [
                    {
                      name: "Holder",
                      props: {
                        title: "Daily Login Trends",
                        subtitle:
                          "User login activity across all sub-applications",
                        className: "border-none rounded-t-3xl",
                      },
                    },
                    {
                      name: "PieChart",
                      props: {
                        data: dailyLoginTrendsData,
                        height: 300,
                        showNoDataMessage: false,
                        showHeader: false,
                        className: "p-6",
                        title: "",
                        onClick: (segmentName?: string) => {
                          if (segmentName) {
                            navigate(`/sub-apps/${segmentName.toLowerCase().replace(/\s+/g, "-")}`);
                          }
                        },
                        isLoading: isDashboardLoading,
                      },
                    },
                  ],
                },
                {
                  layout: "column",
                  gap: "gap-1",
                  className:
                    "bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl col-span-1",
                  columns: [
                    {
                      name: "Holder",
                      props: {
                        title: "App Usage Distribution",
                        subtitle:
                          "Active users and sessions by sub-application",
                        className: "border-none rounded-t-3xl",
                      },
                    },
                    {
                      name: "BarChart",
                      props: {
                        xAxisData: appUsageData.xAxisData,
                        seriesData: appUsageData.seriesData,
                        seriesColors: appUsageData.seriesColors,
                        height: "350px",
                        showHeader: false,
                        showDownloadButton: true,
                        showViewToggle: true,
                        viewToggleOptions: ["Graph", "Table"],
                        showTableView: true,
                        ariaLabel: "App usage distribution chart",
                        yAxisMax: 500,
                        yAxisStep: 100,
                        onDownload: () => {
                          // Download functionality
                        },
                        isLoading: isDashboardLoading,
                      },
                    },
                  ],
                },
              ],
            },
          },
          // SubApp Panel Section
          {
            layout: {
              type: "grid",
              columns: 1,
              gap: "gap-3",
              className: "w-full border border-primary-border dark:border-dark-border rounded-3xl p-3",
              rows: [
                // Search Bar
                {
                  layout: "row",
                  gap: "gap-4",
                  className: "flex items-center justify-between mb-4",
                  columns: [
                    {
                      name: "Search",
                      props: {
                        value: displaySearchValue, // Use display value for immediate UI updates
                        onChange: handleSearchChange,
                        placeholder: "Search apps by name, company, category...",
                        className: "flex-1 w-full",
                        showShortcut: false,
                        results: [],
                        isLoading: isSearching,
                        disabled: false,
                        required: false,
                        error: null,
                        name: "search"
                      }
                    },
                  ]
                },
                // Apps Grid
                {
                  layout: "grid",
                  gap: "gap-6",
                  gridColumns: 2,
                  gridRows: 3,
                  className: "p-3",
                  span: { col: 1, row: 1 },
                  columns: filteredApps.length > 0 
                    ? filteredApps.map((app: any) => ({
                        name: "ApplicationCard",
                        props: app,
                      }))
                    : [{
                        name: "Holder",
                        props: {
                          title: "No matching apps found",
                          subtitle: searchValue ? `No apps match "${searchValue}"` : "No apps available",
                          className: "col-span-3 text-center py-8",
                        }
                      }]
                },
                // Pagination Controls - Only show when not searching and results exist
                ...(searchValue.trim() === '' && filteredApps.length > 0 ? [{
                  layout: "row" as const,
                  gap: "gap-4" as const,
                  className: "flex justify-center items-center mt-4",
                  columns: [
                    {
                      name: "Button",
                      props: {
                        variant: "primary",
                        onClick: handlePreviousPage,
                        disabled: currentPage <= 1,
                        children: "← Previous",
                        className: "px-4 py-2"
                      }
                    },
                    {
                      name: "Button",
                      props: {
                        variant: "primary",
                        onClick: handleNextPage,
                        disabled: !pagination || currentPage >= pagination.totalPages,
                        children: "Next →",
                        className: "px-4 py-2"
                      }
                    }
                  ]
                }] : [])
              ],
            },
          },
        ]}
      />
    </div>
  );
};

export default SuperAdminDashboard;
