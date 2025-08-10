import React, { useState } from 'react';
import type { TableData } from '@/components/global/Table';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import { exportChartData } from '@/utils/excelExport';
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';

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
    const alertColors = ['#163b7c'];
    const statsRange = selectedTimeRange;

    // Handle Excel download for all DTR Dashboard data
    const handleExportData = () => {
        // Import XLSX library
        import('xlsx').then((XLSX) => {
            // Create a new workbook
            const workbook = XLSX.utils.book_new();

            // Prepare DTR Statistics data
            const dtrStatsData = dtrStatsCards.map(stat => ({
                'Metric': stat.title,
                'Value': stat.value,
                'Subtitle': stat.subtitle1 || '',
            }));

            // Prepare DTR Table data
            const dtrTableExportData = dtrTableData.map(dtr => ({
                'DTR ID': dtr.dtrId,
                'DTR Name': dtr.dtrName,
                'Feeders Count': dtr.feedersCount,
                'Street Name': dtr.streetName,
                'City': dtr.city,
                'Communication Status': dtr.commStatus,
                'Last Communication': dtr.lastCommunication,
            }));

            // Prepare Daily Consumption data
            const dailyConsumptionExportData = dailyConsumptionCards.map(card => ({
                'Metric': card.title,
                'Value': card.value,
                'Subtitle': card.subtitle1 || '',
            }));

            // Prepare Monthly Consumption data
            const monthlyConsumptionExportData = monthlyConsumptionCards.map(card => ({
                'Metric': card.title,
                'Value': card.value,
                'Subtitle': card.subtitle1 || '',
            }));

            // Prepare Daily Alerts data
            const dailyAlertsExportData = dailyAlertsData.map(alert => ({
                'Alert': alert.alert,
                'Date': alert.date,
                'Status': alert.status,
            }));

            // Prepare Monthly Alerts data
            const monthlyAlertsExportData = monthlyAlertsData.map(alert => ({
                'Alert': alert.alert,
                'Date': alert.date,
                'Status': alert.status,
            }));

            // Prepare Chart Performance data
            const chartPerformanceData = months.map((month, index) => ({
                'Month': month,
                'Alerts': alertSeries[0].data[index],
            }));

            // Convert data to worksheets
            const dtrStatsSheet = XLSX.utils.json_to_sheet(dtrStatsData);
            const dtrTableSheet = XLSX.utils.json_to_sheet(dtrTableExportData);
            const dailyConsumptionSheet = XLSX.utils.json_to_sheet(dailyConsumptionExportData);
            const monthlyConsumptionSheet = XLSX.utils.json_to_sheet(monthlyConsumptionExportData);
            const dailyAlertsSheet = XLSX.utils.json_to_sheet(dailyAlertsExportData);
            const monthlyAlertsSheet = XLSX.utils.json_to_sheet(monthlyAlertsExportData);
            const chartPerformanceSheet = XLSX.utils.json_to_sheet(chartPerformanceData);

            // Add worksheets to workbook
            XLSX.utils.book_append_sheet(workbook, dtrStatsSheet, 'DTR Statistics');
            XLSX.utils.book_append_sheet(workbook, dtrTableSheet, 'DTR Table');
            XLSX.utils.book_append_sheet(workbook, dailyConsumptionSheet, 'Daily Consumption');
            XLSX.utils.book_append_sheet(workbook, monthlyConsumptionSheet, 'Monthly Consumption');
            XLSX.utils.book_append_sheet(workbook, dailyAlertsSheet, 'Daily Alerts');
            XLSX.utils.book_append_sheet(workbook, monthlyAlertsSheet, 'Monthly Alerts');
            XLSX.utils.book_append_sheet(workbook, chartPerformanceSheet, 'Performance Metrics');

            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Create blob and download
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'dtr-dashboard-complete-data.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        });
    };

    // Chart download handler (for chart-specific export)
    const handleChartDownload = () => {
        exportChartData(months, alertSeries, 'dtr-statistics-data');
    };

    // Handle DTR table actions
    const handleViewDTR = (row: TableData) => {
        console.log('Viewing DTR:', row);
        navigate(`/dtr-detail/${row.dtrId}`);
    };



  // DTR statistics cards data - Using only daily data consistently
  const dtrStatsCards = [
    {
      title: "Total DTRs",
      value: 29,
      icon: "/icons/dtr.svg",
      subtitle1: "Total Transformer Units",
      onValueClick: () => navigate("/dtr-statistics/total-dtrs"),
      bg: "bg-stat-icon-gradient",
    },
    {
      title: "Total LT Feeders",
      value: 33,
      icon: "/icons/feeder.svg",
      subtitle1: "Connected to DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-lt-feeders"),
    },
    {
      title: "Today's Fuse Blown",
      value: 1,
      icon: "/icons/power_failure.svg",
      subtitle1: "0.03% of Total DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-fuse-blown"),
    },
    {
      title: "Overloaded Feeders",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total Feeders",
      onValueClick: () => navigate("/dtr-statistics/overloaded-feeders"),
    },
    {
      title: "Underloaded Feeders",
      value: 33,
      icon: "/icons/dtr.svg",
      subtitle1: "100.0% of Total Feeders",
      onValueClick: () => navigate("/dtr-statistics/underloaded-feeders"),
    },
    {
      title: "LT Side Fuse Blown",
      value: 1,
      icon: "/icons/power_failure.svg",
      subtitle1: "1 Incident Today",
      onValueClick: () => navigate("/dtr-statistics/lt-side-fuse-blown"),
    },
    {
      title: "Unbalanced DTRs",
      value: 0,
      icon: "/icons/dtr.svg",
      subtitle1: "0.00% of Total DTRs",
      onValueClick: () => navigate("/dtr-statistics/unbalanced-dtrs"),
    },
    {
      title: "Power Failure Feeders",
      value: 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "0.00% of Feeders",
      onValueClick: () => navigate("/dtr-statistics/power-failure-feeders"),
    },
    {
      title: "HT Side Fuse Blown",
      value: 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "0 Incident Today",
      onValueClick: () => navigate("/dtr-statistics/ht-side-fuse-blown"),
    },
  ];

    // DTR Consumption Cards - Daily data
    const dailyConsumptionCards = [
        {
            title: "Total kWh",
            value: "3,847.32",
            icon: "/icons/energy.svg",
            subtitle1: "Today's Active Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kVAh",
            value: "3,892.45",
            icon: "/icons/energy.svg",
            subtitle1: "Today's Apparent Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kW",
            value: "6.10",
            icon: "/icons/energy.svg",
            subtitle1: "Current Active Power",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kVA",
            value: "6.26",
            icon: "/icons/energy.svg",
            subtitle1: "Current Apparent Power",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Active DTRs",
            value: 29,
            icon: "/icons/dtr.svg",
            subtitle1: "100.00% of Total DTRs",
            iconStyle: FILTER_STYLES.WHITE, // White icon for Active DTRs
            bg:'bg-[var(--color-secondary)]'
        },
        {
            title: "In-Active DTRs",
            value: 0,
            icon: "/icons/dtr.svg",
            subtitle1: "0.00% of Total DTRs",
            iconStyle: FILTER_STYLES.WHITE, // White icon for In-Active DTRs
            bg: 'bg-[var(--color-danger)]'
        },
    ];

    // DTR Consumption Cards - Monthly data
    const monthlyConsumptionCards = [
        {
            title: "Total kWh",
            value: "111,931.96",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Active Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kVAh",
            value: "113,369.06",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Apparent Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Avg kW",
            value: "5.87",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Average Power",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Avg kVA",
            value: "6.02",
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Average Apparent",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Active DTRs",
            value: 29,
            icon: "/icons/dtr.svg",
            subtitle1: "100.00% of Total DTRs",
            iconStyle: FILTER_STYLES.WHITE, // White icon for Active DTRs
            bg: 'bg-[var(--color-secondary)]',
        },
        {
            title: "In-Active DTRs",
            value: 0,
            icon: "/icons/dtr.svg",
            subtitle1: "0.00% of Total DTRs",
            iconStyle: FILTER_STYLES.WHITE, // White icon for In-Active DTRs
            bg: 'bg-[var(--color-danger)]',
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
    { 
      key: "commStatus", 
      label: "Communication-Status",
      statusIndicator: {},
      isActive: (value: string | number | boolean | null | undefined) => String(value).toLowerCase() === 'active'
    },
    { key: "lastCommunication", label: "Last Communication" },
  ];
  const dtrTableData = [
    {
      dtrId: "TRANSFORMER-01",
      dtrName: "TGNP_DTR-01",
      feedersCount: 1,
      streetName: "Waddepally",
      city: "Warangal",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:30:25",
    },
    {
      dtrId: "TRANSFORMER-02",
      dtrName: "TGNP_DTR-02",
      feedersCount: 1,
      streetName: "Sun city",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:28:15",
    },
    {
      dtrId: "TRANSFORMER-03",
      dtrName: "TGNP_DTR-03",
      feedersCount: 4,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:25:42",
    },
    {
      dtrId: "TRANSFORMER-04",
      dtrName: "TGNP_DTR-04",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:22:18",
    },
    {
      dtrId: "TRANSFORMER-05",
      dtrName: "TGNP_DTR-05",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:20:33",
    },
    {
      dtrId: "TRANSFORMER-06",
      dtrName: "TGNP_DTR-06",
      feedersCount: 1,
      streetName: "Prashanth Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:18:55",
    },
    {
      dtrId: "TRANSFORMER-07",
      dtrName: "TGNP_DTR-07",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:15:27",
    },
    {
      dtrId: "TRANSFORMER-08",
      dtrName: "TGNP_DTR-08",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:12:44",
    },
    {
      dtrId: "TRANSFORMER-09",
      dtrName: "TGNP_DTR-09",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:10:18",
    },
    {
      dtrId: "TRANSFORMER-10",
      dtrName: "TGNP_DTR-10",
      feedersCount: 1,
      streetName: "Hyder Nagar",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:08:32",
    },
    {
      dtrId: "TRANSFORMER-11",
      dtrName: "TGNP_DTR-11",
      feedersCount: 2,
      streetName: "Gachibowli",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:05:15",
    },
    {
      dtrId: "TRANSFORMER-12",
      dtrName: "TGNP_DTR-12",
      feedersCount: 3,
      streetName: "Madhapur",
      city: "Hyderabad",
      commStatus: "Inactive",
      lastCommunication: "2024-07-24 18:45:22",
    },
    {
      dtrId: "TRANSFORMER-13",
      dtrName: "TGNP_DTR-13",
      feedersCount: 1,
      streetName: "HITEC City",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:02:48",
    },
    {
      dtrId: "TRANSFORMER-14",
      dtrName: "TGNP_DTR-14",
      feedersCount: 2,
      streetName: "Jubilee Hills",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 14:00:12",
    },
    {
      dtrId: "TRANSFORMER-15",
      dtrName: "TGNP_DTR-15",
      feedersCount: 1,
      streetName: "Banjara Hills",
      city: "Hyderabad",
      commStatus: "Active",
      lastCommunication: "2024-07-25 13:58:35",
    },
  ];


    // Dummy data for Latest Alerts table
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Occured On' },
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
        {
            alert: 'Unbalanced load on DTR-11',
            date: '2024-07-25 08:45',
            status: 'Active',
        },
        {
            alert: 'Low power factor on DTR-14',
            date: '2024-07-25 08:00',
            status: 'Resolved',
        },
        {
            alert: 'Frequency deviation on DTR-12',
            date: '2024-07-25 07:30',
            status: 'Active',
        },
        {
            alert: 'Phase loss detected on DTR-15',
            date: '2024-07-25 07:00',
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
    //     exportChartData(months, alertSeries, 'dtr-statis tics-data');
    // };

    return (
        <div className="">
            <Page
                sections={[
                    // Header section
                    {
                        layout: {
                            type: 'grid' as const,
                            columns: 1,
                            className: '',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'DTR Dashboard',
                                    onBackClick: () => window.history.back(),
                                    backButtonText: 'Back to Dashboard',
                                    buttonsLabel: 'Export',
                                    variant: 'primary',
                                    onClick: () => handleExportData(),
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
                            // {
                            //     name: 'CustomComponent',
                            //     props: {
                            //         component: FilterStyleController,
                            //     },
                            // },
                        ],
                    },
                    // DTR Statistics Cards
          {
            layout: {
              type: "grid",
              columns: 5,
              gap: "gap-4",
              rows: [
                {
                  layout: "grid",
                  gap: "gap-4",
                  gridColumns: 3,
                  span: { col: 3, row: 1 },
                    className:'border border-primary-border rounded-3xl p-4 bg-background-secondary',
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
                          bg: stat.bg || "bg-stat-icon-gradient",
                        },
                        span: { col: 1 as const, row: 1 as const },
                      })),
                  ],
                },
                {
                    layout: "grid",
                    gap: "gap-4",
                    gridColumns: 2,
                    span: { col: 2, row: 1 },
                    className:'border border-primary-border rounded-3xl p-4 bg-background-secondary',
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
                                 iconStyle: card.iconStyle, // Only for Active/In-Active DTRs
                                 bg: card.bg || "bg-stat-icon-gradient",
                             },
                             span: { col: 1 as const, row: 1 as const },
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
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gridColumns: 1,
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                                                              
                                                data: dtrTableData,
                                                columns: dtrTableColumns,
                                                showHeader: true,
                                                headerTitle: 'Distribution Transformers',  
                                                headerClassName:'h-18',
                                                searchable: true, 
                                                sortable: true,
                                                pagination: true,
                                                initialRowsPerPage: 10,
                                                showActions: true,
                                                text: 'DTR Management Table',
                                                onRowClick: (row: TableData) =>
                                                    navigate(`/dtr-detail/${row.dtrId}`),
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
                             type: 'grid' as const,
                             className: '',
                             columns:2,
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
                                headerTitle: 'DTR Performance Metrics',
                                showDownloadButton: true,
                                onDownload: () => handleChartDownload(),
                            },
                        },
                             {
                                 name: 'Table',
                                 props: {
                                     data: getCurrentAlertsData(),
                                     columns: alertsTableColumns,
                                     showHeader: true,
                                     headerTitle: 'Latest Alerts',
                                     showActions: false,
                                     searchable: true,
                                     pagination: true,
                                     availableTimeRanges: [],
                                     initialRowsPerPage: 3,
                                     emptyMessage: 'No alerts found',
                                 },
                             },
                           
                         ],
                     },
                    // // Statistics Chart section
                    // {
                    //     layout: {  
                    //         type: 'column' as const,
                    //         className:
                    //             '',
                    //     },
                    //     components: [
                           
                    //     ],
                    // },
                ]}
            />
        </div>
    );
};

export default DTRDashboard;