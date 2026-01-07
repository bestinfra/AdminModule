import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageC from "@components/global/PageC";
import { exportChartData } from "@/utils/excelExport";

// Brand green icon style
const ICON_FILTER_STYLE = {
  filter:
    "brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)",
};

interface TicketData {
  id: number;
  ticketNumber: string;
  subject: string;
  category: string;
  application: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdAt: string;
  [key: string]: string | number | boolean | null | undefined;
}

type FilterType =
  | "all"
  | "high-priority"
  | "in-progress"
  | "resolved"
  | "closed";

// Dummy data for fallback
const dummyCardStats = [
  {
    title: "Total Tickets",
    value: "N/A",
    icon: "icons/support-tickets.svg",
    subtitle1: "N/A",
    subtitle2: "N/A",
    showTrend: false,
    comparisonValue: 0,
    filterType: "all" as FilterType,
  },
  {
    title: "No of Clients",
    value: "N/A",
    icon: "icons/warning-icon.svg",
    subtitle1: "N/A",
    subtitle2: "N/A",
    showTrend: false,
    comparisonValue: 0,
    filterType: "high-priority" as FilterType,
  },
  {
    title: "In Progress",
    value: "N/A",
    icon: "icons/pending-payments.svg",
    subtitle1: "N/A",
    subtitle2: "N/A",
    showTrend: false,
    comparisonValue: 0,
    filterType: "in-progress" as FilterType,
  },
  {
    title: "Resolved",
    value: "N/A",
    icon: "icons/resolved.svg",
    subtitle1: "N/A",
    subtitle2: "N/A",
    showTrend: false,
    comparisonValue: 0,
    filterType: "resolved" as FilterType,
  },
  {
    title: "Closed",
    value: "N/A",
    icon: "icons/closed.svg",
    subtitle1: "N/A",
    subtitle2: "N/A",
    showTrend: false,
    comparisonValue: 0,
    filterType: "closed" as FilterType,
  },
];

const dummyTicketData: TicketData[] = [
  {
    id: 1,
    ticketNumber: "N/A",
    subject: "N/A",
    category: "N/A",
    application: "N/A",
    status: "N/A",
    priority: "N/A",
    assignedTo: "N/A",
    createdAt: "N/A",
  },
];




// Dummy chart data for fallback
const dummyChartData = {
  xAxisData: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  seriesData: [
    {
      name: "Open Tickets",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // All zeros for "N/A" effect
    },
    {
      name: "No Of Clients Tickets",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Resolved Tickets",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Closed Tickets",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
  seriesColors: ["#163b7c", "#55b56c", "#dc272c", "#ed8c22"],
};



// Table columns configuration
const tableColumns = [
  { key: "ticketNumber", label: "Ticket ID" },
  { key: "subject", label: "Subject & Category" },
  { key: "application", label: "Application" },
  { key: "status", label: "Status" },
  {
    key: "priority",
    label: "Priority",
    priorityBadge: true,
  },
  { key: "assignedTo", label: "Assigned To" },
  { key: "createdAt", label: "Created At" },
];

// Recent activities data in JSON format
const recentActivitiesData = [
  {
    id: "1",
    type: "ticket_created",
    title: "Ticket TICK-001 Created",
    description: "System Access Issue - High Priority",
    timestamp: "2 minutes ago",
    icon: "icons/tickets.svg",
    bgColor: "bg-accent-light",
    iconBgColor: "bg-accent",
  },
  {
    id: "2",
    type: "ticket_updated",
    title: "Ticket TICK-002 Updated",
    description: "Status changed to In Progress",
    timestamp: "15 minutes ago",
    icon: "icons/clock.svg",
    bgColor: "bg-warning-alt",
    iconBgColor: "bg-warning",
  },
  {
    id: "3",
    type: "ticket_resolved",
    title: "Ticket TICK-003 Resolved",
    description: "Software Update completed successfully",
    timestamp: "1 hour ago",
    icon: "icons/check-circle.svg",
    bgColor: "bg-secondary-light",
    iconBgColor: "bg-secondary",
  },
];

const AllTickets: React.FC = () => {
  const navigate = useNavigate();
  const { filter } = useParams<{ filter?: string }>();

  const [selectedTimeRange, setSelectedTimeRange] = useState("Daily");
  
  // State for API data
  const [cardStatsData, setCardStatsData] = useState(dummyCardStats);
  const [ticketTableData, setTicketTableData] = useState(dummyTicketData);
  const [_filteredTickets, setFilteredTickets] = useState(dummyTicketData);
  const [chartData, setChartData] = useState(dummyChartData);
  
  // Loading states
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  
  // State for tracking failed APIs
  const [failedApis, setFailedApis] = useState<Array<{
    id: string;
    name: string;
    retryFunction: () => Promise<void>;
    errorMessage: string;
  }>>([]);

  // Get filter from URL params, default to 'all'
  const activeFilter = (filter as FilterType) || "all";

  // Simple retry function for Cards API
  const retryCardsAPI = async () => {
    setIsCardsLoading(true);
    try {
      const res = await fetch("/api/tickets/cards");
      
      if (!res.ok) {
        throw new Error(`Cards API failed with status ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Cards API returned non-JSON response");
      }
      
      const data = await res.json();
      setCardStatsData(data?.data || dummyCardStats);
      
      // Remove from failed APIs on success
      setFailedApis(prev => prev.filter(api => api.id !== 'cards'));
    } catch (err: any) {
      console.error("Error in Tickets Cards:", err);
      // Set dummy data on retry failure
      setCardStatsData(dummyCardStats);
      // Keep the error in failedApis for retry
    } finally {
      // Add a small delay to make loading state visible
      setTimeout(() => {
        setIsCardsLoading(false);
      }, 1000);
    }
  };

  // Simple retry function for Table API
  const retryTableAPI = async () => {
    setIsTableLoading(true);
    try {
      const res = await fetch("/api/tickets/table");
      
      if (!res.ok) {
        throw new Error(`Table API failed with status ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Table API returned non-JSON response");
      }
      
      const data = await res.json();
      const tableData = data?.data || dummyTicketData;
      setTicketTableData(tableData);
      setFilteredTickets(tableData);
      
      // Remove from failed APIs on success
      setFailedApis(prev => prev.filter(api => api.id !== 'table'));
    } catch (err: any) {
      console.error("Error in Tickets Table:", err);
      // Set dummy data on retry failure
      setTicketTableData(dummyTicketData);
      setFilteredTickets(dummyTicketData);
      // Keep the error in failedApis for retry
    } finally {
      // Add a small delay to make loading state visible
      setTimeout(() => {
        setIsTableLoading(false);
      }, 1000);
    }
  };

  // Simple retry function for Chart API
  const retryChartAPI = async () => {
    setIsChartLoading(true);
    try {
      const res = await fetch("/api/tickets/chart");
      
      if (!res.ok) {
        throw new Error(`Chart API failed with status ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Chart API returned non-JSON response");
      }
      
      const data = await res.json();
      setChartData(data?.data || dummyChartData);
      
      // Remove from failed APIs on success
      setFailedApis(prev => prev.filter(api => api.id !== 'chart'));
    } catch (err: any) {
      console.error("Error in Tickets Chart:", err);
      // Set dummy data on retry failure
      setChartData(dummyChartData);
      // Keep the error in failedApis for retry
    } finally {
      // Add a small delay to make loading state visible
      setTimeout(() => {
        setIsChartLoading(false);
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

  // Fetch Cards Data
  useEffect(() => {
    const fetchCards = async () => {
      setIsCardsLoading(true);
      try {
        const res = await fetch("/api/tickets/cards");
        
        if (!res.ok) {
          throw new Error(`Cards API failed with status ${res.status}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Cards API returned non-JSON response");
        }
        
        const data = await res.json();
        setCardStatsData(data?.data || dummyCardStats);
      } catch (err: any) {
        console.error("Error in Tickets Cards:", err);
        
        // Set N/A data from dummy data
        setCardStatsData(dummyCardStats);
        
        // Add to failed APIs
        setFailedApis(prev => {
          if (!prev.find(api => api.id === 'cards')) {
            return [...prev, { 
              id: 'cards', 
              name: 'Ticket Data', 
              retryFunction: retryCardsAPI, 
              errorMessage: 'Failed to load Tickets Cards. Please try again.' 
            }];
          }
          return prev;
        });
      } finally {
        // Add a small delay to make loading state visible
        setTimeout(() => {
          setIsCardsLoading(false);
        }, 1000);
      }
    };
    
    fetchCards();
  }, []);

  // Fetch Table Data
  useEffect(() => {
    const fetchTable = async () => {
      setIsTableLoading(true);
      try {
        const res = await fetch("/api/tickets/table");
        
        if (!res.ok) {
          throw new Error(`Table API failed with status ${res.status}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Table API returned non-JSON response");
        }
        
        const data = await res.json();
        const tableData = data?.data || dummyTicketData;
        setTicketTableData(tableData);
        setFilteredTickets(tableData);
      } catch (err: any) {
        console.error("Error in Tickets Table:", err);
        
        // Set N/A data from dummy data
        setTicketTableData(dummyTicketData);
        setFilteredTickets(dummyTicketData);
        
        // Add to failed APIs
        setFailedApis(prev => {
          if (!prev.find(api => api.id === 'table')) {
            return [...prev, { 
              id: 'table', 
              name: 'Ticket Data', 
              retryFunction: retryTableAPI, 
              errorMessage: 'Failed to load Tickets Table. Please try again.' 
            }];
          }
          return prev;
        });
      } finally {
        // Add a small delay to make loading state visible
        setTimeout(() => {
          setIsTableLoading(false);
        }, 1000);
      }
    };
    
    fetchTable();
  }, []);

  // Fetch Chart Data
  useEffect(() => {
    const fetchChart = async () => {
      setIsChartLoading(true);
      try {
        const res = await fetch("/api/tickets/chart");
        
        if (!res.ok) {
          throw new Error(`Chart API failed with status ${res.status}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Chart API returned non-JSON response");
        }
        
        const data = await res.json();
        setChartData(data?.data || dummyChartData);
      } catch (err: any) {
        console.error("Error in Tickets Chart:", err);
        
        // Set N/A data from dummy data
        setChartData(dummyChartData);
        
        // Add to failed APIs
        setFailedApis(prev => {
          if (!prev.find(api => api.id === 'chart')) {
            return [...prev, { 
              id: 'chart', 
              name: 'Ticket Data', 
              retryFunction: retryChartAPI, 
              errorMessage: 'Failed to load Tickets Chart. Please try again.' 
            }];
          }
          return prev;
        });
      } finally {
        // Add a small delay to make loading state visible
        setTimeout(() => {
          setIsChartLoading(false);
        }, 1000);
      }
    };
    
    fetchChart();
  }, []);

  // Filter tickets based on active filter
  const filteredTicketsData = useMemo(() => {
    switch (activeFilter) {
      case "high-priority":
        return ticketTableData.filter((ticket) => ticket.priority === "High");
      case "in-progress":
        return ticketTableData.filter((ticket) => ticket.status === "In Progress");
      case "resolved":
        return ticketTableData.filter((ticket) => ticket.status === "Resolved");
      case "closed":
        return ticketTableData.filter((ticket) => ticket.status === "Closed");
      default:
        return ticketTableData;
    }
  }, [activeFilter, ticketTableData]);

  const handleCardClick = useCallback(
    (filter: FilterType) => {
      navigate(`/tickets/${filter}`);
    },
    [navigate]
  );

  const handleFilterChange = useCallback(
    (filter: FilterType) => {
      navigate(`/tickets/${filter}`);
    },
    [navigate]
  );

  const handleBackToCards = useCallback(() => {
    navigate("/tickets");
  }, [navigate]);

  const getTableTitle = () => {
    switch (activeFilter) {
      case "high-priority":
        return "High Priority Tickets";
      case "in-progress":
        return "In Progress Tickets";
      case "resolved":
        return "Resolved Tickets";
      case "closed":
        return "Closed Tickets";
      default:
        return "All Tickets";
    }
  };

  // Handle Excel download for ticket trends chart
  const handleTicketTrendsDownload = () => {
    exportChartData(
      chartData.xAxisData,
      chartData.seriesData,
      "ticket-trends-data"
    );
  };

  return (
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
        {
          layout: {
            type: "grid" as const,
            columns: 1,
            className: "w-full",
            rows: [
              {
                layout: "row" as const,
                className: "w-full",
                columns: [
                  {
                    name: "PageHeader",
                    props: {
                      title: filter ? getTableTitle() : "Tickets Overview",
                      onBackClick: filter
                        ? handleBackToCards
                        : () => window.history.back(),
                      backButtonText: filter
                        ? "Back to Tickets Overview"
                        : "Back to Dashboard",
                      buttonsLabel: "Create Ticket",
                      variant: "primary",
                      onClick: () => navigate("/create-ticket"),
                      ...(filter && {
                        showMenu: true,
                        showDropdown: true,
                        menuItems: [
                          { id: "all", label: "All Tickets" },
                          { id: "high-priority", label: "High Priority" },
                          { id: "in-progress", label: "In Progress" },
                          { id: "resolved", label: "Resolved" },
                          { id: "closed", label: "Closed" },
                        ],
                        onMenuItemClick: (itemId: string) =>
                          handleFilterChange(itemId as FilterType),
                      }),
                    },
                  },
                ],
              },
            ],
          },
        },
        ...(filter
          ? []
          : [
              {
                layout: {
                  type: "grid" as const,
                  columns: 5 as const,
                  className: "w-full gap-4",
                  rows: [
                    {
                      layout: "row" as const,
                      className: "w-full",
                      gridColumns: 5 as const,
                      span: { col: 5 as const, row: 1 as const },
                      columns: cardStatsData.map((card) => ({
                        name: "Card",
                        props: {
                          title: card.title,
                          value: card.value,
                          icon: card.icon,
                          showTrend: card.showTrend,
                          comparisonValue: card.comparisonValue,
                          subtitle1: card.subtitle1,
                          subtitle2: card.subtitle2,
                          onValueClick: () => handleCardClick(card.filterType),
                          iconStyle: ICON_FILTER_STYLE,
                          loading: isCardsLoading,
                        },
                      })),
                    },
                  ],
                },
              },
              {
                layout: {
                  type: "grid" as const,
                  columns: 1 as const,
                  className: "w-full",
                  rows: [
                    {
                      layout: "grid" as const,
                      className: "w-full",
                      columns: [
                        {
                          name: "BarChart",
                          props: {
                            xAxisData: chartData.xAxisData,
                            seriesData: chartData.seriesData,
                            seriesColors: chartData.seriesColors,
                            height: 320,
                            showHeader: true,
                            headerTitle: "Ticket Trends",
                            className: "w-full",
                            dateRange: "Last 12 months",
                            showDownloadButton: true,
                            onDownload: () => handleTicketTrendsDownload(),
                            showXAxisLabel: true,
                            isLoading: isChartLoading,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ]),
        {
          layout: {
            type: "grid" as const,
            columns: 1 as const,
            className: "w-full ",
            rows: [
              {
                layout: "grid" as const,
                gridColumns: 1 as const,
                className:'pb-4',
                columns: [
                  {
                    name: "Table",
                    props: {
                      columns: tableColumns,
                      data: filter ? filteredTicketsData : ticketTableData,
                      searchable: true,
                      pagination: true,
                      initialRowsPerPage: 10,
                      rowsPerPageOptions: [5, 10, 15, 20, 25],
                      emptyMessage: "No Tickets Found",
                      showActions: true,
                      showHeader: "true",
                      headerTitle: filter
                        ? `${getTableTitle()} (Last 30 days)`
                        : "All Tickets (Last 30 days)",
                      showPaginationInfo: true,
                      showRowsPerPageSelector: true,
                      className: "w-full",
                      availableTimeRanges: ["Daily", "Weekly", "Monthly"],
                      selectedTimeRange: selectedTimeRange,
                      onTimeRangeChange: setSelectedTimeRange,
                      onDelete: (row: any) =>
                        console.log("Delete ticket:", row),
                      onView: () => navigate("/ticket-view"),
                      isLoading: isTableLoading,
                    },
                  },
                ],
              },
            ],
          },
        },
        ...(filter
          ? [
              {
                layout: {
                  type: "grid" as const,
                  columns: 1 as const,
                  className: "w-full",
                  rows: [
                    {
                      layout: "row" as const,
                      className: "w-full",
                      columns: [
                        {
                          name: "SectionHeader",
                          props: {
                            title: "Recent Ticket Activity",
                            titleLevel: 2,
                            titleSize: "md",
                            titleVariant: "primary",    
                            titleWeight: "bold",
                            titleAlign: "left",
                          },
                        },
                      ],
                    },
                    {
                      layout: "row" as const,
                      className: "w-full",
                      columns: [
                        {
                          name: "RecentActivities",
                          props: {
                            activities: recentActivitiesData,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ]
          : []),
      ]}
    />
  );
};

export default AllTickets;
