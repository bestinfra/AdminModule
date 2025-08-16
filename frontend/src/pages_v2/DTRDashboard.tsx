import React, { useState, useEffect } from 'react';
import type { TableData } from '@/components/global/Table';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import { exportChartData } from '@/utils/excelExport';
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';
import BACKEND_URL from '../config';

const DTRDashboard: React.FC = () => {
    const navigate = useNavigate();

    // State for time range toggle
    const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly'>('Daily');

    // State for API data
    const [dtrStatsData, setDtrStatsData] = useState<any>({});
    const [dtrConsumptionData, setDtrConsumptionData] = useState<{
        daily: { totalKwh: string | number; totalKvah: string | number; totalKw: string | number; totalKva: string | number };
        monthly: { totalKwh: string | number; totalKvah: string | number; totalKw: string | number; totalKva: string | number };
    }>({
        daily: { totalKwh: 0, totalKvah: 0, totalKw: 0, totalKva: 0 },
        monthly: { totalKwh: 0, totalKvah: 0, totalKw: 0, totalKva: 0 },
    });
    const [dtrTableData, setDtrTableData] = useState<TableData[]>([]);
    const [alertsData, setAlertsData] = useState<any[]>([]);
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    // Chart data variables (alerts trends)
    const [chartMonths, setChartMonths] = useState<string[]>([]);
    const [chartSeries, setChartSeries] = useState<{ name: string; data: number[] }[]>([]);
    const alertColors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#9467bd', '#d62728'];
    const statsRange = selectedTimeRange;
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    
    // State for managing which 3 errors to show (sliding window)
    const [currentErrorIndex, setCurrentErrorIndex] = useState(0);

    // Calculate which 3 errors to show
    const visibleErrors = errorMessages.slice(currentErrorIndex, currentErrorIndex + 3);

    // Reset current error index when errors change
    useEffect(() => {
        setCurrentErrorIndex(0);
    }, [errorMessages.length]);

  
    // API Functions
    const fetchDTRStats = async () => {
        // setLoading(prev => ({ ...prev, stats: true }));
        try {
            const response = await fetch(`${BACKEND_URL}/dtrs/stats`);
            const data = await response.json();

            if (data.success) {
                // Consolidated API returns { data: { row1: {...}, row2: { daily: {...}, monthly: {...} } } }
                const row1 = data.data?.row1 || {};
                const row2 = data.data?.row2 || {};
                setDtrStatsData(row1);
                setDtrConsumptionData({
                    daily: row2.daily || { totalKwh: 0, totalKvah: 0, totalKw: 0, totalKva: 0 },
                    monthly: row2.monthly || { totalKwh: 0, totalKvah: 0, totalKw: 0, totalKva: 0 },
                });
            } else {
                throw new Error(data.message || 'Failed to fetch DTR stats');// goes to catch
            }
        } catch (error) {
            console.error('Error fetching DTR stats:', error);
            setErrorMessages(prev => [...prev, "Failed to load the Dashboard Widgets"]);
            // Fallback to demo data
            setDtrStatsData({});

        } finally {
            // setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    const fetchDTRTable = async (page = 1, limit = 10) => {
        // setLoading(prev => ({ ...prev, table: true }));
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('pageSize', String(limit));
            
            const response = await fetch(`${BACKEND_URL}/dtrs?${params.toString()}`);
            const data = await response.json();
            
            if (data.success) {
                setDtrTableData(data.data);
                setServerPagination({
                    currentPage: data.page || 1,
                    totalPages: Math.ceil(data.total / data.pageSize) || 1,
                    totalItems: data.total || 0,
                    itemsPerPage: data.pageSize || 10,
                });
            } else {
                throw new Error(data.message || 'Failed to fetch DTR table');
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, "Failed to load the DTR Table"]);
            // Fallback to demo data
            setDtrTableData([]);
        } finally {
            // setLoading(prev => ({ ...prev, table: false }));
        }
    };

    const fetchDTRAlerts = async () => {
        // setLoading(prev => ({ ...prev, alerts: true }));
        try {
            const response = await fetch(`${BACKEND_URL}/dtrs/alerts`);
            const data = await response.json();
            
            if (data.success) {
                setAlertsData(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch DTR alerts');
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, "Failed to load the DTR Alerts"]);
            // Fallback to demo data
            setAlertsData([]);
        } finally {
            // setLoading(prev => ({ ...prev, alerts: false }));
        }
    };

    const fetchDTRAlertsTrends = async () => {
        // setLoading(prev => ({ ...prev, trends: true }));
        try {
            const response = await fetch(`${BACKEND_URL}/dtrs/alerts/trends`);
            const data = await response.json();
            
            if (data.success) {
                const rows: Array<{
                    month: string;
                    detected_count: number;
                    analyzing_count: number;
                    repairing_count: number;
                    resolved_count: number;
                    unresolved_count: number;
                }> = data.data || [];

                const monthsList = rows.map(r => r.month);
                const detected = rows.map(r => r.detected_count || 0);
                const analyzing = rows.map(r => r.analyzing_count || 0);
                const repairing = rows.map(r => r.repairing_count || 0);
                const resolved = rows.map(r => r.resolved_count || 0);
                const unresolved = rows.map(r => r.unresolved_count || 0);

                setChartMonths(monthsList);
                setChartSeries([
                    { name: 'Detected', data: detected },
                    { name: 'Analyzing', data: analyzing },
                    { name: 'Repairing', data: repairing },
                    { name: 'Resolved', data: resolved },
                    { name: 'Unresolved', data: unresolved },
                ]);
            } else {
                throw new Error(data.message || 'Failed to fetch DTR alerts trends');
            }
        } catch (error) {
            setErrorMessages(prev => [...prev, "Failed to load the DTR Alerts Trends"]);
            // Fallback to demo data
            setChartMonths([]);
            setChartSeries([]);
        } finally {
            // setLoading(prev => ({ ...prev, trends: false }));
        }
    };

    // Load data on component mount
    useEffect(() => {
        const fetchDTRStats = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/dtrs/stats`);
                const data = await response.json();

                if (data.success) {
                    const row1 = data.data?.row1 || {};
                    const row2 = data.data?.row2 || {};
                    setDtrStatsData(row1);
                    setDtrConsumptionData({
                        daily: row2.daily || { totalKwh: 0, totalKvah: 0, totalKw: 0, totalKva: 0 },
                        monthly: row2.monthly || { totalKwh: 0, totalKvah: 0, totalKw: 0, totalKva: 0 },
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch DTR stats');
                }
            } catch (error) {
                console.error('Error fetching DTR stats:', error);
                setErrorMessages(prev => {
                    // Only add error if it's not already there
                    if (!prev.includes("Failed to load the Dashboard Widgets")) {
                        return [...prev, "Failed to load the Dashboard Widgets"];
                    }
                    return prev;
                });
                // Fallback to dummy data for cards
                setDtrStatsData({
                    totalDtrs: "N/A",
                    totalLtFeeders: "N/A",
                    totalFuseBlown: "N/A",
                    fuseBlownPercentage: "N/A",
                    overloadedFeeders: "N/A",
                    overloadedPercentage: "N/A",
                    underloadedFeeders: "N/A",
                    underloadedPercentage: "N/A",
                    ltSideFuseBlown: "N/A",
                    unbalancedDtrs: "N/A",
                    unbalancedPercentage: "N/A",
                    powerFailureFeeders: "N/A",
                    powerFailurePercentage: "N/A",
                    htSideFuseBlown: "N/A",
                    activeDtrs: "N/A",
                    inactiveDtrs: "N/A",
                    activePercentage: "N/A",
                    inactivePercentage: "N/A"
                });
                setDtrConsumptionData({
                    daily: { totalKwh: "N/A", totalKvah: "N/A", totalKw: "N/A", totalKva: "N/A" },
                    monthly: { totalKwh: "N/A", totalKvah: "N/A", totalKw: "N/A", totalKva: "N/A" },
                });
            }
        };
        fetchDTRStats();
    }, []);

    useEffect(() => {
        const fetchDTRTable = async () => {
            try {
                const params = new URLSearchParams();
                params.append('page', '1');
                params.append('pageSize', '10');
                
                const response = await fetch(`${BACKEND_URL}/dtrs?${params.toString()}`);
                const data = await response.json();
                
                if (data.success) {
                    setDtrTableData(data.data);
                    setServerPagination({
                        currentPage: data.page || 1,
                        totalPages: Math.ceil(data.total / data.pageSize) || 1,
                        totalItems: data.total || 0,
                        itemsPerPage: data.pageSize || 10,
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch DTR table');
                }
            } catch (error) {
                setErrorMessages(prev => {
                    // Only add error if it's not already there
                    if (!prev.includes("Failed to load the DTR Table")) {
                        return [...prev, "Failed to load the DTR Table"];
                    }
                    return prev;
                });
                // Fallback to dummy data
                setDtrTableData([
                    {
                        dtrId: "N/A",
                        dtrName: "N/A",
                        feedersCount: "N/A",
                        streetName: "N/A",
                        city: "N/A",
                        commStatus: "N/A",
                        lastCommunication: "N/A",
                    }
                ]);
            }
        };
        fetchDTRTable();
    }, []);

    useEffect(() => {
        const fetchDTRAlerts = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/dtrs/alerts`);
                const data = await response.json();
                
                if (data.success) {
                    setAlertsData(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch DTR alerts');
                }
            } catch (error) {
                setErrorMessages(prev => {
                    // Only add error if it's not already there
                    if (!prev.includes("Failed to load the DTR Alerts")) {
                        return [...prev, "Failed to load the DTR Alerts"];
                    }
                    return prev;
                });
                // Fallback to dummy data
                setAlertsData([
                    {
                        alert: 'N/A',
                        date: 'N/A',
                    }
                ]);
            }
        };
        fetchDTRAlerts();
    }, []);

    useEffect(() => {
        const fetchDTRAlertsTrends = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/dtrs/alerts/trends`);
                const data = await response.json();
                
                if (data.success) {
                    const rows = data.data || [];
                    const monthsList = rows.map((r: any) => r.month);
                    const detected = rows.map((r: any) => r.detected_count || 0);
                    const analyzing = rows.map((r: any) => r.analyzing_count || 0);
                    const repairing = rows.map((r: any) => r.repairing_count || 0);
                    const resolved = rows.map((r: any) => r.resolved_count || 0);
                    const unresolved = rows.map((r: any) => r.unresolved_count || 0);

                    setChartMonths(monthsList);
                    setChartSeries([
                        { name: 'Detected', data: detected },
                        { name: 'Analyzing', data: analyzing },
                        { name: 'Repairing', data: repairing },
                        { name: 'Resolved', data: resolved },
                        { name: 'Unresolved', data: unresolved },
                    ]);
                } else {
                    throw new Error(data.message || 'Failed to fetch DTR alerts trends');
                }
            } catch (error) {
                setErrorMessages(prev => {
                    // Only add error if it's not already there
                    if (!prev.includes("Failed to load the DTR Alerts Trends")) {
                        return [...prev, "Failed to load the DTR Alerts Trends"];
                    }
                    return prev;
                });
                // Fallback to dummy data
                setChartMonths(['N/A']);
                setChartSeries([
                    { name: 'Detected', data: [0] },
                    { name: 'Analyzing', data: [0] },
                    { name: 'Repairing', data: [0] },
                    { name: 'Resolved', data: [0] },
                    { name: 'Unresolved', data: [0] },
                ]);
            }
        };
        fetchDTRAlertsTrends();
    }, []);

    // Clear all error messages
    const clearErrors = () => {
        setErrorMessages([]);
    };

    // Remove a specific error message
    const removeError = (indexToRemove: number) => {
        setErrorMessages(prev => prev.filter((_, index) => index !== indexToRemove));
        
        // Move to next set of errors if available
        if (currentErrorIndex + 3 < errorMessages.length) {
            setCurrentErrorIndex(prev => prev + 1);
        } else if (currentErrorIndex > 0) {
            // If we're at the end, move back to show previous errors
            setCurrentErrorIndex(prev => Math.max(0, prev - 1));
        }
    };

    // Handle Excel download for all DTR Dashboard data
    const handleExportData = () => {
        // Import XLSX library
        import('xlsx').then((XLSX) => {
            // Create a new workbook
            const workbook = XLSX.utils.book_new();

            // Prepare DTR Statistics data (widgets)
            const dtrStatsExportData = dtrStatsCards.map(stat => ({
                'Metric': stat.title,
                'Value': stat.value,
                'Subtitle': stat.subtitle1 || '',
            }));

            // Prepare Consumption Widgets data (energy consumption cards)
            const currentConsumptionCards = getCurrentConsumptionCards();
            const consumptionWidgetsExportData = currentConsumptionCards.map(card => ({
                'Metric': card.title,
                'Value': card.value,
                'Subtitle': card.subtitle1 || '',
            }));

            // Convert data to worksheets
            const dtrStatsSheet = XLSX.utils.json_to_sheet(dtrStatsExportData);
            const consumptionWidgetsSheet = XLSX.utils.json_to_sheet(consumptionWidgetsExportData);

            // Add only widgets worksheets to workbook
            XLSX.utils.book_append_sheet(workbook, dtrStatsSheet, 'DTR Statistics Widgets');
            XLSX.utils.book_append_sheet(workbook, consumptionWidgetsSheet, 'Consumption Widgets');

            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Create blob and download
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'dtr-dashboard-widgets.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        });
    };

    // Chart download handler (for chart-specific export)
    const handleChartDownload = () => {
        exportChartData(chartMonths, chartSeries, 'dtr-alerts-trends');
    };

    // Handle DTR table actions
    const handleViewDTR = (row: TableData) => {
        console.log('Viewing DTR:', row);
        navigate(`/dtr-detail/${row.dtrId}`);
    };

    // Handle table pagination
    const handlePageChange = (page: number, limit: number) => {
        fetchDTRTable(page, limit);
    };



  // DTR statistics cards data - Using API data
  const dtrStatsCards = [
    {
      title: "Total DTRs",
      value: dtrStatsData.totalDtrs || dtrStatsData?.row1?.totalDtrs || 0,
      icon: "/icons/dtr.svg",
      subtitle1: "Total Transformer Units",
      onValueClick: () => navigate("/dtr-statistics/total-dtrs"),
      bg: "bg-stat-icon-gradient",
    },
    {
      title: "Total LT Feeders",
      value: dtrStatsData.totalLtFeeders || dtrStatsData?.row1?.totalLtFeeders || 0,
      icon: "/icons/feeder.svg",
      subtitle1: "Connected to DTRs",
      onValueClick: () => navigate("/dtr-statistics/total-lt-feeders"),
    },
    {
      title: "Today's Fuse Blown",
      value: dtrStatsData.totalFuseBlown || dtrStatsData?.row1?.totalFuseBlown || 0,
      icon: "/icons/power_failure.svg",
      subtitle1: `${dtrStatsData.fuseBlownPercentage || dtrStatsData?.row1?.fuseBlownPercentage || 0}% of Total DTRs`,
      onValueClick: () => navigate("/dtr-statistics/total-fuse-blown"),
    },
    {
      title: "Overloaded Feeders",
      value: dtrStatsData.overloadedFeeders || dtrStatsData?.row1?.overloadedFeeders || 0,
      icon: "/icons/dtr.svg",
      subtitle1: `${dtrStatsData.overloadedPercentage || dtrStatsData?.row1?.overloadedPercentage || 0}% of Total Feeders`,
      onValueClick: () => navigate("/dtr-statistics/overloaded-feeders"),
    },
    {
      title: "Underloaded Feeders",
      value: dtrStatsData.underloadedFeeders || dtrStatsData?.row1?.underloadedFeeders || 0,
      icon: "/icons/dtr.svg",
      subtitle1: `${dtrStatsData.underloadedPercentage || dtrStatsData?.row1?.underloadedPercentage || 0}% of Total Feeders`,
      onValueClick: () => navigate("/dtr-statistics/underloaded-feeders"),
    },
    {
      title: "LT Side Fuse Blown",
      value: dtrStatsData.ltSideFuseBlown || dtrStatsData?.row1?.ltSideFuseBlown || 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "Incidents Today",
      onValueClick: () => navigate("/dtr-statistics/lt-side-fuse-blown"),
    },
    {
      title: "Unbalanced DTRs",
      value: dtrStatsData.unbalancedDtrs || dtrStatsData?.row1?.unbalancedDtrs || 0,
      icon: "/icons/dtr.svg",
      subtitle1: `${dtrStatsData.unbalancedPercentage || dtrStatsData?.row1?.unbalancedPercentage || 0}% of Total DTRs`,
      onValueClick: () => navigate("/dtr-statistics/unbalanced-dtrs"),
    },
    {
      title: "Power Failure Feeders",
      value: dtrStatsData.powerFailureFeeders || dtrStatsData?.row1?.powerFailureFeeders || 0,
      icon: "/icons/power_failure.svg",
      subtitle1: `${dtrStatsData.powerFailurePercentage || dtrStatsData?.row1?.powerFailurePercentage || 0}% of Feeders`,
      onValueClick: () => navigate("/dtr-statistics/power-failure-feeders"),
    },
    {
      title: "HT Side Fuse Blown",
      value: dtrStatsData.htSideFuseBlown || dtrStatsData?.row1?.htSideFuseBlown || 0,
      icon: "/icons/power_failure.svg",
      subtitle1: "Incidents Today",
      onValueClick: () => navigate("/dtr-statistics/ht-side-fuse-blown"),
    },
  ];

    // DTR Consumption Cards - Daily data
    const dailyConsumptionCards = [
        {
            title: "Total kWh",
            value: String(dtrConsumptionData.daily.totalKwh || 0),
            icon: "/icons/energy.svg",
            subtitle1: "Today's Active Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kVAh",
            value: String(dtrConsumptionData.daily.totalKvah || 0),
            icon: "/icons/energy.svg",
            subtitle1: "Today's Apparent Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kW",
            value: String(dtrConsumptionData.daily.totalKw || 0),
            icon: "/icons/energy.svg",
            subtitle1: "Current Active Power",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kVA",
            value: String(dtrConsumptionData.daily.totalKva || 0),
            icon: "/icons/energy.svg",
            subtitle1: "Current Apparent Power",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Active DTRs",
            value: Number(dtrStatsData?.activeDtrs || 0),
            icon: "/icons/dtr.svg",
            subtitle1: `${dtrStatsData?.activePercentage ?? 0}% of Total DTRs`,
            iconStyle: FILTER_STYLES.WHITE, // White icon for Active DTRs
            bg:'bg-[var(--color-secondary)]'
        },
        {
            title: "In-Active DTRs",
            value: Number(dtrStatsData?.inactiveDtrs || 0),
            icon: "/icons/dtr.svg",
            subtitle1: `${dtrStatsData?.inactivePercentage ?? 0}% of Total DTRs`,
            iconStyle: FILTER_STYLES.WHITE, // White icon for In-Active DTRs
            bg: 'bg-[var(--color-danger)]'
        },
    ];

    // DTR Consumption Cards - Monthly data
    const monthlyConsumptionCards = [
        {
            title: "Total kWh",
            value: String(dtrConsumptionData.monthly.totalKwh || 0),
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Active Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Total kVAh",
            value: String(dtrConsumptionData.monthly.totalKvah || 0),
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Apparent Energy",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Avg kW",
            value: String(dtrConsumptionData.monthly.totalKw || 0),
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Average Power",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Avg kVA",
            value: String(dtrConsumptionData.monthly.totalKva || 0),
            icon: "/icons/consumption.svg",
            subtitle1: "Monthly Average Apparent",
            bg: "bg-stat-icon-gradient",
        },
        {
            title: "Active DTRs",
            value: Number(dtrStatsData?.activeDtrs || 0),
            icon: "/icons/dtr.svg",
            subtitle1: `${dtrStatsData?.activePercentage ?? 0}% of Total DTRs`,
            iconStyle: FILTER_STYLES.WHITE, // White icon for Active DTRs
            bg: 'bg-[var(--color-secondary)]',
        },
        {
            title: "In-Active DTRs",
            value: Number(dtrStatsData?.inactiveDtrs || 0),
            icon: "/icons/dtr.svg",
            subtitle1: `${dtrStatsData?.inactivePercentage ?? 0}% of Total DTRs`,
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
  // const dtrTableData = [
  //   {
  //     dtrId: "TRANSFORMER-01",
  //     dtrName: "TGNP_DTR-01",
  //     feedersCount: 1,
  //     streetName: "Waddepally",
  //     city: "Warangal",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:30:25",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-02",
  //     dtrName: "TGNP_DTR-02",
  //     feedersCount: 1,
  //     streetName: "Sun city",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:28:15",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-03",
  //     dtrName: "TGNP_DTR-03",
  //     feedersCount: 4,
  //     streetName: "Prashanth Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:25:42",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-04",
  //     dtrName: "TGNP_DTR-04",
  //     feedersCount: 1,
  //     streetName: "Prashanth Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:22:18",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-05",
  //     dtrName: "TGNP_DTR-05",
  //     feedersCount: 1,
  //     streetName: "Prashanth Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:20:33",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-06",
  //     dtrName: "TGNP_DTR-06",
  //     feedersCount: 1,
  //     streetName: "Prashanth Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:18:55",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-07",
  //     dtrName: "TGNP_DTR-07",
  //     feedersCount: 1,
  //     streetName: "Hyder Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:15:27",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-08",
  //     dtrName: "TGNP_DTR-08",
  //     feedersCount: 1,
  //     streetName: "Hyder Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:12:44",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-09",
  //     dtrName: "TGNP_DTR-09",
  //     feedersCount: 1,
  //     streetName: "Hyder Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:10:18",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-10",
  //     dtrName: "TGNP_DTR-10",
  //     feedersCount: 1,
  //     streetName: "Hyder Nagar",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:08:32",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-11",
  //     dtrName: "TGNP_DTR-11",
  //     feedersCount: 2,
  //     streetName: "Gachibowli",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:05:15",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-12",
  //     dtrName: "TGNP_DTR-12",
  //     feedersCount: 3,
  //     streetName: "Madhapur",
  //     city: "Hyderabad",
  //     commStatus: "Inactive",
  //     lastCommunication: "2024-07-24 18:45:22",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-13",
  //     dtrName: "TGNP_DTR-13",
  //     feedersCount: 1,
  //     streetName: "HITEC City",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:02:48",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-14",
  //     dtrName: "TGNP_DTR-14",
  //     feedersCount: 2,
  //     streetName: "Jubilee Hills",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 14:00:12",
  //   },
  //   {
  //     dtrId: "TRANSFORMER-15",
  //     dtrName: "TGNP_DTR-15",
  //     feedersCount: 1,
  //     streetName: "Banjara Hills",
  //     city: "Hyderabad",
  //     commStatus: "Active",
  //     lastCommunication: "2024-07-25 13:58:35",
  //   },
  // ];


    // Dummy data for Latest Alerts table
    const alertsTableColumns = [
        { key: 'alert', label: 'Alert' },
        { key: 'date', label: 'Occured On' },
    ];

    // Daily alerts data - commented out as unused
    // const dailyAlertsData = [
    //     {
    //         alert: 'Overload detected on DTR-01',
    //         date: '2024-07-25 14:30',
    //         status: 'Active',
    //     },
    //     { 
    //         alert: 'Fuse blown on DTR-03', 
    //         date: '2024-07-25 13:15', 
    //         status: 'Resolved' 
    //     },
    //     { 
    //         alert: 'Power failure on DTR-07', 
    //         date: '2024-07-25 12:45', 
    //         status: 'Active' 
    //     },
    //     {
    //         alert: 'Low voltage detected on DTR-02',
    //         date: '2024-07-25 11:20',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Communication lost on DTR-05',
    //         date: '2024-07-25 10:30',
    //         status: 'Resolved',
    //     },
    //     {
    //         alert: 'High temperature on DTR-08',
    //         date: '2024-07-25 09:15',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Unbalanced load on DTR-11',
    //         date: '2024-07-25 08:45',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Low power factor on DTR-14',
    //         date: '2024-07-25 08:00',
    //         status: 'Resolved',
    //     },
    //     {
    //         alert: 'Frequency deviation on DTR-12',
    //         date: '2024-07-25 07:30',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Phase loss detected on DTR-15',
    //         date: '2024-07-25 07:00',
    //         status: 'Active',
    //     },
    // ];

    // Monthly alerts data - commented out as unused
    // const monthlyAlertsData = [
    //     {
    //         alert: 'Monthly overload summary - DTR-01',
    //         date: 'July 2024',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Monthly fuse blown incidents - DTR-03',
    //         date: 'July 2024',
    //         status: 'Resolved'
    //     },
    //     {
    //         alert: 'Monthly power failure report - DTR-07',
    //         date: 'July 2024',
    //         status: 'Active'
    //     },
    //     {
    //         alert: 'Monthly voltage fluctuation - DTR-02',
    //         date: 'July 2024',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Monthly communication issues - DTR-05',
    //         date: 'July 2024',
    //         status: 'Resolved',
    //     },
    //     {
    //         alert: 'Monthly temperature monitoring - DTR-08',
    //         date: 'July 2024',
    //         status: 'Active',
    //     },
    //     {
    //         alert: 'Monthly maintenance alert - DTR-04',
    //         date: 'July 2024',
    //         status: 'Scheduled',
    //     },
    //     {
    //         alert: 'Monthly performance report - DTR-06',
    //         date: 'July 2024',
    //         status: 'Completed',
    //     },
    // ];

    // Function to handle time range change
    const handleTimeRangeChange = (range: string) => {
        setSelectedTimeRange(range as 'Daily' | 'Monthly');
    };

    // Remove unused function
    // const getCurrentAlertsData = () => {
    //     return alertsData;
    // };


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
                            // Render all errors in a single stacked card effect
                            ...(errorMessages.length > 0 ? [{
                                name: 'Error',
                                props: {
                                    visibleErrors: visibleErrors,
                                    totalErrors: errorMessages.length,
                                    onRetry: () => {
                                        clearErrors();
                                        fetchDTRStats();
                                        fetchDTRTable();
                                        fetchDTRAlerts();
                                        fetchDTRAlertsTrends();
                                    },
                                    onClose: () => removeError(0), // Remove the top error
                                    className: 'text-center',
                                },
                            }] : []),
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
                                                initialRowsPerPage: 10,
                                                showActions: true,
                                                text: 'DTR Management Table',
                                                onRowClick: (row: TableData) =>
                                                    navigate(`/dtr-detail/${row.dtrId}`),
                                                onView: handleViewDTR,
                                                availableTimeRanges: [],
                                                onPageChange: handlePageChange,
                                                pagination: serverPagination,
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
                                xAxisData: chartMonths,
                                seriesData: chartSeries,
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
                                     data: alertsData,
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