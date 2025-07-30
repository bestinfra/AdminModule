import React, { useState } from 'react';
import type { TableData } from '@components/global/Table';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import { exportChartData } from '@/utils/excelExport';

// Brand green icon style
const ICON_FILTER_STYLE = {
    filter: 'brightness(0) saturate(100%) invert(52%) sepia(60%) saturate(497%) hue-rotate(105deg) brightness(95%) contrast(90%)',
};

const DTRDashboard: React.FC = () => {
    const navigate = useNavigate();

    // State for time range toggle
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');

    // Chart data variables
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const alertSeries = [
        {
            name: 'Alerts',
            data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 12]
        }
    ];
    const alertColors = ['#10B981'];
    const statsRange = selectedTimeRange;

    // Chart download handler
    const handleChartDownload = () => {
        exportChartData(months, alertSeries, 'dtr-statistics-data');
    };

    // Handle DTR table actions
    const handleViewDTR = (row: TableData) => {
        console.log('Viewing DTR:', row);
        navigate(`/dtr/${row.dtrId}`);
    };



  // DTR statistics cards data - Using only daily data consistently
  const dtrStatsCards = [
    {
      title: "Total DTRs",
      value: 29,
      icon: "/icons/dtr.svg",
      subtitle1: "Total Transformer Units",
      onValueClick: () => navigate("/dtr-statistics/total-dtrs"),
      iconStyle: ICON_FILTER_STYLE,
      bg: "bg-stat-icon-gradient",
    },
    {
      title: "Total LT Feeders",
      value: 33,
      icon: "/icons/feeder.svg",
      subtitle1: "Connected to DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-lt-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Today's Fuse Blown",
      value: 1,
      icon: "/icons/power_failure.svg",
      subtitle1: "0.03% of Total DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-fuse-blown"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Overloaded Feeders",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total Feeders",
      onValueClick: () => navigate("/dtr-statistics/overloaded-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Underloaded Feeders",
      value: 33,
      icon: "/icons/dtr.svg",
      subtitle1: "100.0% of Total Feeders",
      onValueClick: () => navigate("/dtr-statistics/underloaded-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "LT Side Fuse Blown",
      value: 1,
      icon: "/icons/power_failure.svg",
      subtitle1: "1 Incident Today",
      onValueClick: () => navigate("/dtr-statistics/lt-side-fuse-blown"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Unbalanced DTRs",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total DTRs",
      onValueClick: () => navigate("/dtr-statistics/unbalanced-dtrs"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "Power Failure Feeders",
      value: 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "0.00% of Feeders",
      onValueClick: () => navigate("/dtr-statistics/power-failure-feeders"),
      iconStyle: ICON_FILTER_STYLE,
    },
    {
      title: "HT Side Fuse Blown",
      value: 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "0 Incident Today",
      onValueClick: () => navigate("/dtr-statistics/ht-side-fuse-blown"),
      iconStyle: ICON_FILTER_STYLE,
    },
  ];

    // DTR Consumption Cards - Daily data
    const dailyConsumptionCards = [
        {
            title: "Total kWh",
            value: "3,847.32",
            icon: "/icons/consumption.svg",
            subtitle1: "Today's Active Energy",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Total kVAh",
            value: "3,892.45",
            icon: "/icons/consumption.svg",
            subtitle1: "Today's Apparent Energy",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Total kW",
            value: "6.10",
            icon: "/icons/consumption.svg",
            subtitle1: "Current Active Power",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Total kVA",
            value: "6.26",
            icon: "/icons/consumption.svg",
            subtitle1: "Current Apparent Power",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Active DTRs",
            value: 29,
            icon: "/icons/dtr.svg",
            subtitle1: "100.00% of Total DTRs",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "In-Active DTRs",
            value: 0,
            icon: "/icons/dtr.svg",
            subtitle1: "0.00% of Total DTRs",
            iconStyle: ICON_FILTER_STYLE,
        },
    ];

    // DTR Consumption Cards - Monthly data
    const monthlyConsumptionCards = [
        {
            title: "Total kWh",
            value: "111,931.96",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Active Energy",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Total kVAh",
            value: "113,369.06",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Apparent Energy",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Avg kW",
            value: "5.87",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Average Power",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Avg kVA",
            value: "6.02",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Average Apparent",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "Active DTRs",
            value: 29,
            icon: "/icons/dtr.svg",
            subtitle1: "100.00% of Total DTRs",
            iconStyle: ICON_FILTER_STYLE,
        },
        {
            title: "In-Active DTRs",
            value: 0,
            icon: "/icons/dtr.svg",
            subtitle1: "0.00% of Total DTRs",
            iconStyle: ICON_FILTER_STYLE,
        },
    ];

  // Get current consumption cards data based on selected time range
  const getCurrentConsumptionCards = () => {
    return selectedTimeRange === 'Daily' ? dailyConsumptionCards : monthlyConsumptionCards;
  };
  // Dummy data for DTRs table
  const dtrTableColumns = [
    { key: "dtrId", label: "DTR ID" },
    { key: "dtrName", label: "DTR Name" },
    { key: "feedersCount", label: "Feeders Count" },
    { key: "streetName", label: "Street Name" },
    { key: "city", label: "City" },
    { key: "commStatus", label: "Comm-Status" },
  ];
  const dtrTableData = [
    {
      dtrId: "TRANSFORMER-01",
      dtrName: "TGNP_DTR-01",
      feedersCount: 1,
      streetName: "Waddepally",
      city: "Warangal",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-02",
      dtrName: "TGNP_DTR-02",
      feedersCount: 1,
      streetName: "Sun city",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-03",
      dtrName: "TGNP_DTR-03",
      feedersCount: 4,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-04",
      dtrName: "TGNP_DTR-04",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-05",
      dtrName: "TGNP_DTR-05",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-06",
      dtrName: "TGNP_DTR-06",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-07",
      dtrName: "TGNP_DTR-07",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-08",
      dtrName: "TGNP_DTR-08",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-09",
      dtrName: "TGNP_DTR-09",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
    {
      dtrId: "TRANSFORMER-10",
      dtrName: "TGNP_DTR-10",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
    },
  ];


    // Dummy data for Latest Alerts table
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
    ];

    // Daily alerts data
    const dailyAlertsData = [
        {
            alert: 'Overload detected on DTR-01',
            date: '2024-07-25 14:30',
            status: 'Active',
        },
        { 
            alert: 'Fuse blown on DTR-03', 
            date: '2024-07-25 13:15', 
            status: 'Resolved' 
        },
        { 
            alert: 'Power failure on DTR-07', 
            date: '2024-07-25 12:45', 
            status: 'Active' 
        },
        {
            alert: 'Low voltage detected on DTR-02',
            date: '2024-07-25 11:20',
            status: 'Active',
        },
        {
            alert: 'Communication lost on DTR-05',
            date: '2024-07-25 10:30',
            status: 'Resolved',
        },
        {
            alert: 'High temperature on DTR-08',
            date: '2024-07-25 09:15',
            status: 'Active',
        },
    ];

    // Monthly alerts data
    const monthlyAlertsData = [
        {
            alert: 'Monthly overload summary - DTR-01',
            date: 'July 2024',
            status: 'Active',
        },
        {
            alert: 'Monthly fuse blown incidents - DTR-03',
            date: 'July 2024',
            status: 'Resolved'
        },
        {
            alert: 'Monthly power failure report - DTR-07',
            date: 'July 2024',
            status: 'Active'
        },
        {
            alert: 'Monthly voltage fluctuation - DTR-02',
            date: 'July 2024',
            status: 'Active',
        },
        {
            alert: 'Monthly communication issues - DTR-05',
            date: 'July 2024',
            status: 'Resolved',
        },
        {
            alert: 'Monthly temperature monitoring - DTR-08',
            date: 'July 2024',
            status: 'Active',
        },
        {
            alert: 'Monthly maintenance alert - DTR-04',
            date: 'July 2024',
            status: 'Scheduled',
        },
        {
            alert: 'Monthly performance report - DTR-06',
            date: 'July 2024',
            status: 'Completed',
        },
    ];

    // Function to handle time range change
    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    // Get current alerts data based on selected time range
    const getCurrentAlertsData = () => {
        return selectedTimeRange === 'Daily' ? dailyAlertsData : monthlyAlertsData;
    };


    // Dummy data for DTR Alert Statistics
    // TODO: Unused - consider removing if not needed.
    // const [statsRange, setStatsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    // const [statsRange] = useState<'Monthly' | 'Yearly'>('Monthly');
    // const alertTypes = [
    //     { name: 'LT Fuse Blown (R - Phase)', color: '#e74c3c' },
    //     { name: 'Unbalanced Load', color: '#f39c12' },
    //     { name: 'Low PF (R - Phase)', color: '#3498db' },
    //     { name: 'Power Failure', color: '#9b59b6' },
    //     { name: 'B_PH Missing', color: '#8e44ad' },
    //     { name: 'R_PH CT Reversed', color: '#e67e22' },
    //     { name: 'HT Fuse Blown (B - Phase)', color: '#f1c40f' },
    //     { name: 'LT Fuse Blown (Y - Phase)', color: '#1abc9c' },
    //     { name: 'LT Fuse Blown (B - Phase)', color: '#e67e22' },
    //     { name: 'R-L-P', color: '#9b59b6' },
    // ];
    // const months = [
    //     'May 2025',
    //     'Apr 2025',
    //     'Mar 2025',
    //     'Feb 2025',
    //     'Jan 2025',
    //     'Dec 2024',
    //     'Nov 2024',
    //     'Oct 2024',
    //     'Sept 2024',
    // ];
    // const alertSeries = alertTypes.map((type) => ({
    //     name: type.name,
    //     data: months.map(() => Math.floor(Math.random() * 350)),
    // }));
    // const alertColors = alertTypes.map((type) => type.color);

    // // Handle Excel download for chart data
    // const handleChartDownload = () => {
    //     exportChartData(months, alertSeries, 'dtr-statistics-data');
    // };

    return (
        <div className="p-2 min-h-screen">
            <Page
                sections={[
                    // Header section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: 'mb-6',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'DTR Dashboard',
                                    onBackClick: () => window.history.back(),
                                    backButtonText: 'Back to Dashboard',
                                    buttonsLabel: 'Upload',
                                    variant: 'primary',
                                    onClick: () =>
                                        console.log('Adding new DTR...'),
                                    showMenu: true,
                                    showDropdown: true,
                                    menuItems: [
                                        { id: 'all', label: 'Alerts' },
                                        { id: 'export', label: 'Export' },
                                    ],
                                    onMenuItemClick: (itemId: string) => {
                                        console.log(`Filter by: ${itemId}`);
                                    },
                                },
                            },
                        ],
                    },
                    // DTR Statistics Cards
          {
            layout: {
              type: "grid",
              columns: 5,
              gap: "gap-6",
              rows: [
                {
                  layout: "grid",
                  gap: "gap-4",
                  gridColumns: 3,
                  gridRows: 2,
                  span: { col: 3, row: 1 },
                  className:'border border-primary-border rounded-3xl px-3 py-3 bg-background-secondary',
                  columns: [
                    {
                      name: "SectionHeader",
                      props: {
                        title: "Distribution Transformer (DTR) Statistics",
                        titleLevel: 2,
                        titleSize: "md",
                        titleVariant: "colorPrimaryDark",
                        titleWeight: "medium",
                        titleAlign: "left",
                        layout: "horizontal",
                        gap: "gap-4",
                      },
                      span: { col: 3, row: 1 },
                    },
                      ...dtrStatsCards.map((stat) => ({
                       name: "Card",
                       props: {
                         title: stat.title,
                         value: stat.value,
                         icon: stat.icon,
                         subtitle1: stat.subtitle1,
                         onValueClick: stat.onValueClick,
                         iconStyle: stat.iconStyle,
                         bg: "bg-stat-icon-gradient",
                       },
                       span: { col: 1, row: 1 },
                     })),
                  ],
                },
                {
                    layout: "grid",
                    gap: "gap-4",
                    gridColumns: 2,
                    gridRows: 2,
                    span: { col: 2, row: 1 },
                    className:'border border-primary-border rounded-3xl p-3 bg-background-secondary',
                    columns: [
                                              {
                          name: "SectionHeader",
                          props: {
                            title: "Latest Alerts",
                            titleLevel: 2,
                            titleSize: "md",
                            titleVariant: "colorPrimaryDark",
                            titleWeight: "normal",
                            titleAlign: "left",
                            rightComponent: {
                              name: "TimeRangeSelector",
                              props: {
                                availableTimeRanges: ["Daily", "Monthly"],
                                selectedTimeRange: selectedTimeRange,
                                handleTimeRangeChange: handleTimeRangeChange,
                                timeRangeLabels: {},
                              },
                            },
                            layout: "horizontal",
                            gap: "gap-4",
                          },
                          span: { col: 2, row: 1 },
                        },
                          ...getCurrentConsumptionCards().map((card) => ({
                             name: 'Card',
                             props: {
                                 title: card.title,
                                 value: card.value,
                                 icon: card.icon,
                                 subtitle1: card.subtitle1,
                                 iconStyle: card.iconStyle,
                                 bg: "bg-stat-icon-gradient",
                             },
                             span: { col: 1, row: 1 },
                         }))
                    ],
                },
              ],
            },
          },

                    // DTRs Table section
                    {
                        layout: {
                            type: 'grid',
                            columns: 1,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 1,
                                    gap: 'gap-6',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: dtrTableData,
                                                columns: dtrTableColumns,
                                                showHeader: false,
                                                headerTitle: 'DTR Management',
                                                dateRange: 'All DTRs',
                                                searchable: true,
                                                sortable: true,
                                                pagination: true,
                                                showActions: true,
                                                text: 'DTR Management Table',
                                                onRowClick: (row: TableData) =>
                                                    navigate(`/dtr/${row.dtrId}`),
                                                onView: handleViewDTR,
                                                availableTimeRanges: [],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // // Latest Alerts section
                    {
                        layout: {
                            type: 'column' as const,
                            className: 'mb-8 border border-primary-border rounded-3xl p-6 mt-6',
                        },
                        components: [
                            {
                                name: 'Heading',
                                props: {
                                    text: 'Latest Alerts',
                                    level: 2,
                                    className: 'text-base font-medium',
                                },
                            },
                            {
                                name: 'Table',
                                props: {
                                    data: getCurrentAlertsData(),
                                    columns: alertsTableColumns,
                                    showActions: false,
                                    searchable: true,
                                    pagination: true,
                                    initialRowsPerPage: 10,
                                    emptyMessage: 'No alerts found',
                                },
                            },
                        ],
                    },
                    // Statistics Chart section
                    {
                        layout: {
                            type: 'column' as const,
                            className:
                                'mb-8',
                        },
                        components: [
                            {
                                name: 'BarChart',
                                props: {
                                    xAxisData: months,
                                    seriesData: alertSeries,
                                    seriesColors: alertColors,
                                    height: 300,
                                    showLegendInteractions: true,
                                    timeRange: statsRange,
                                    showHeader: true,
                                    headerTitle: 'Statistics',
                                    showDownloadButton: true,
                                    onDownload: () => handleChartDownload(),
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
};

export default DTRDashboard;