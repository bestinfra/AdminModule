import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "@/components/global/PageC";
// import BACKEND_URL from "../config";
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';

const ConsumerDetailView: React.FC = () => {
  const { consumerId } = useParams<{ consumerId: string }>();
  const navigate = useNavigate();

    // State for consumer data
  const [consumer, setConsumer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const lastComm = "30/06/2025 22:31:38";

  // State to control chart time range
  const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly' | 'Yearly'>('Daily');



  // Consumer Statistics Cards Data
  const getConsumerStats = () => {
    if (errors.length > 0 || !consumer) {
      return [
        {
          title: "R-Phase Voltage",
          value: "N/A",
          subtitle1: "Volts",
          icon: "/icons/r-phase-voltage.svg",
          bg: "bg-danger",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: FILTER_STYLES.WHITE,
          iconClassName: "w-4 h-4",
          width: "w-8",
          height: "h-8",
        },
        {
          title: "Y-Phase Voltage",
          value: "N/A",
          subtitle1: "Volts",
          icon: "/icons/r-phase-current.svg",
          bg: "bg-warning-alt",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: FILTER_STYLES.WHITE,
          iconClassName: "w-4 h-4 ",
          width: "w-8",
          height: "h-8",
        },
        {
          title: "B-Phase Voltage",
          value: "N/A",
          subtitle1: "Volts",
          icon: "/icons/r-phase-current.svg",
          bg: "bg-primary",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: FILTER_STYLES.WHITE,
          iconClassName: "w-4 h-4",
          width: "w-8",
          height: "h-8",
        },
        {
          title: "R-Phase Current",
          value: "N/A",
          subtitle1: "Amps",
          icon: "/icons/r-phase-current.svg",
          bg: "bg-danger",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: FILTER_STYLES.WHITE,
          iconClassName: "w-4 h-4",
          width: "w-8",
          height: "h-8",
        },
        {
          title: "Y-Phase Current",
          value: "N/A",
          subtitle1: "Amps",
          icon: "/icons/r-phase-current.svg",
          bg: "bg-warning-alt",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: FILTER_STYLES.WHITE,
          iconClassName: "w-4 h-4",
          width: "w-8",
          height: "h-8",
        },
        {
          title: "B-Phase Current",
          value: "N/A",
          subtitle1: "Amps",
          icon: "/icons/r-phase-current.svg",
          bg: "bg-primary",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: FILTER_STYLES.WHITE,
          iconClassName: "w-4 h-4",
          width: "w-8",
          height: "h-8",
        },
      ];
    }
    return [
      {
        title: "R-Phase Voltage",
        value: consumer?.rPhaseVoltage || "N/A",
        subtitle1: "Volts",
        icon: "/icons/r-phase-voltage.svg",
        bg: "bg-danger",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: FILTER_STYLES.WHITE,
        iconClassName: "w-4 h-4",
        width: "w-8",
        height: "h-8",
      },
      {
        title: "Y-Phase Voltage",
        value: consumer?.yPhaseVoltage || "N/A",
        subtitle1: "Volts",
        icon: "/icons/r-phase-current.svg",
        bg: "bg-warning-alt",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: FILTER_STYLES.WHITE,
        iconClassName: "w-4 h-4 ",
        width: "w-8",
        height: "h-8",
      },
      {
        title: "B-Phase Voltage",
        value: consumer?.bPhaseVoltage || "N/A",
        subtitle1: "Volts",
        icon: "/icons/r-phase-current.svg",
        bg: "bg-primary",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: FILTER_STYLES.WHITE,
        iconClassName: "w-4 h-4",
        width: "w-8",
        height: "h-8",
      },
      {
        title: "R-Phase Current",
        value: consumer?.rPhaseCurrent || "N/A",
        subtitle1: "Amps",
        icon: "/icons/r-phase-current.svg",
        bg: "bg-danger",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: FILTER_STYLES.WHITE,
        iconClassName: "w-4 h-4",
        width: "w-8",
        height: "h-8",
      },
      {
        title: "Y-Phase Current",
        value: consumer?.yPhaseCurrent || "N/A",
        subtitle1: "Amps",
        icon: "/icons/r-phase-current.svg",
        bg: "bg-warning-alt",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: FILTER_STYLES.WHITE,
        iconClassName: "w-4 h-4",
        width: "w-8",
        height: "h-8",
      },
      {
        title: "B-Phase Current",
        value: consumer?.bPhaseCurrent || "N/A",
        subtitle1: "Amps",
        icon: "/icons/r-phase-current.svg",
        bg: "bg-primary",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: FILTER_STYLES.WHITE,
        iconClassName: "w-4 h-4",
        width: "w-8",
        height: "h-8",
      },
    ];
  };

  const consumerStats = getConsumerStats();

  // Handler for occupancy status click
  const handleOccupancyStatusClick = () => {
    navigate('/occupancy-status');
  };

  // Consumer Information Data Arrays
  const getConsumerInfoRow1 = () => {
    if (errors.length > 0 || !consumer) {
      return [
        { title: "Current Balance (₹)", value: "N/A" },
        {
          title: "Unique Identification No",
          value: "N/A",
        },
        { title: "Meter Serial Number", value: "N/A", statusIndicator: true },
        { 
          title: "Occupancy Status", 
          value: "N/A",
          onClick: handleOccupancyStatusClick,
          clickable: true,
          className: "hover:text-primary"
        },
      ];
    }
    return [
      { title: "Current Balance (₹)", value: consumer?.currentBalance || "N/A" },
      {
        title: "Unique Identification No",
        value: consumer?.uniqueIdentificationNo || "N/A",
      },
      { title: "Meter Serial Number", value: consumer?.meterSerialNumber || "N/A", statusIndicator: true },
      { 
        title: "Occupancy Status", 
          value: consumer?.occupancyStatus || "N/A",
          onClick: handleOccupancyStatusClick,
          clickable: true,
          className: "hover:text-primary"
      },
    ];
  };

  const CONSUMER_INFO_ROW_1 = getConsumerInfoRow1();

  const getConsumerInfoRow2 = () => {
    if (errors.length > 0 || !consumer) {
      return [
        { title: "Permanent Address", value: "N/A" },
        { title: "Billing Address", value: "N/A" },
        { title: "Mobile No", value: "N/A" },
        { title: "Email ID", value: "N/A" },
      ];
    }
    return [
      { title: "Permanent Address", value: consumer?.permanentAddress || "N/A" },
      { title: "Billing Address", value: consumer?.billingAddress || "N/A" },
      { title: "Mobile No", value: consumer?.mobileNo || "N/A" },
      { title: "Email ID", value: consumer?.emailId || "N/A" },
    ];
  };

  const CONSUMER_INFO_ROW_2 = getConsumerInfoRow2();

  // Current Bill Details Data
  const getBillDetailsRow = () => {
    if (errors.length > 0 || !consumer) {
      return [
        { title: "Billing Month", value: "N/A" },
        { title: "Bill Period", value: "N/A" },
        { title: "Due Date", value: "N/A" },
      ];
    }
    return [
      { title: "Billing Month", value: consumer?.billingMonth || "N/A" },
      { title: "Bill Period", value: consumer?.billPeriod || "N/A" },
      { title: "Due Date", value: consumer?.dueDate || "N/A" },
    ];
  };

  const BILL_DETAILS_ROW = getBillDetailsRow();

  // Consumption Summary Cards Data
  const getConsumptionSummaryCards = () => {
    if (errors.length > 0 || !consumer) {
      return [
        {
          title: "Monthly Consumption (kWh)",
          value: "N/A",
          subtitle1: "Last Month: N/A",
          icon: "/icons/electric.svg",
          bg: "bg-stat-icon-gradient",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: "BRAND_GREEN",
        },
        {
          title: "Daily Consumption (kWh)",
          value: "N/A",
          subtitle1: "Yesterday: N/A",
          icon: "/icons/coins.svg",
          bg: "bg-stat-icon-gradient",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: "BRAND_GREEN",
        },
        {
          title: "Total Outstanding (Rs.)",
          value: "N/A",
          subtitle1: "Last Month: N/A",
          icon: "/icons/search.svg",
          bg: "bg-stat-icon-gradient",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: "BRAND_GREEN",
        },
        {
          title: "Bill Status",
          value: "N/A",
          subtitle1: "Due Date: N/A",
          icon: "/icons/bills2.svg",
          bg: "bg-stat-icon-gradient",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
          iconStyle: "BRAND_GREEN",
        },
      ];
    }
    return [
      {
        title: "Monthly Consumption (kWh)",
        value: consumer?.monthlyConsumption || "N/A",
        subtitle1: `Last Month: ${consumer?.lastMonthConsumption || "N/A"}`,
        icon: "/icons/electric.svg",
        bg: "bg-stat-icon-gradient",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: "BRAND_GREEN",
      },
      {
        title: "Daily Consumption (kWh)",
        value: consumer?.dailyConsumption || "N/A",
        subtitle1: `Yesterday: ${consumer?.yesterdayConsumption || "N/A"}`,
        icon: "/icons/coins.svg",
        bg: "bg-stat-icon-gradient",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: "BRAND_GREEN",
      },
      {
        title: "Total Outstanding (Rs.)",
        value: consumer?.totalOutstanding || "N/A",
        subtitle1: `Last Month: ${consumer?.lastMonthOutstanding || "N/A"}`,
        icon: "/icons/search.svg",
        bg: "bg-stat-icon-gradient",
        valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: "BRAND_GREEN",
      },
      {
        title: "Bill Status",
        value: consumer?.billStatus || "N/A",
        subtitle1: `Due Date: ${consumer?.dueDate || "N/A"}`,
        icon: "/icons/bills2.svg",
        bg: "bg-stat-icon-gradient",
          valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
        iconStyle: "BRAND_GREEN",
      },
    ];
  };

  const consumptionSummaryCards = getConsumptionSummaryCards();

  // Chart data for different time ranges
  const getChartDataByRange = (range: string) => {
    if (errors.length > 0 || !consumer) {
      return {
        xAxisData: [],
        seriesData: [],
        seriesColors: ["#10B981", "#3B82F6"],
      };
    }
    
    const chartData = consumer?.chartData?.[range.toLowerCase()];
    return {
      xAxisData: chartData?.xAxisData || [],
      seriesData: chartData?.seriesData || [],
      seriesColors: chartData?.seriesColors || ["#10B981", "#3B82F6"],
    };
  };

  // Dynamic chart data based on selected time range
  const currentChartData = getChartDataByRange(selectedTimeRange);

  // Separate chart data for the first chart (with its own time range state)
  const [firstChartTimeRange, setFirstChartTimeRange] = useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');
  const firstChartData = getChartDataByRange(firstChartTimeRange);

  // Pie chart data for billing distribution
  const getBillingPieData = () => {
    if (errors.length > 0 || !consumer) {
      return [];
    }
    return consumer?.billingDistribution || [];
  };

  const billingPieData = getBillingPieData();

  // Meter readings table data
  const getMeterReadingsData = () => {
    if (errors.length > 0 || !consumer) {
      return [];
    }
    return consumer?.meterReadings || [];
  };

  const meterReadingsData = getMeterReadingsData();

  const meterReadingsColumns = [
    { key: "uid", label: "UID" },
    { key: "meterSerialNo", label: "Meter Serial No" },
    { key: "companyName", label: "Company Name" },
    { key: "unitName", label: "Unit Name" },
    { key: "createdOn", label: "Created On" },
      ];

  // Payment history table data
  const getPaymentHistoryData = () => {
    if (errors.length > 0 || !consumer) {
      return [];
    }
    return consumer?.paymentHistory || [];
  };

  const paymentHistoryData = getPaymentHistoryData();

  const paymentHistoryColumns = [
    { key: "transactionId", label: "Transaction ID" },
    { key: "creditAmount", label: "Credit Amount" },
    { key: "currentBalanceAmount", label: "Current Balance Amount" },
    { key: "paymentDate", label: "Payment Date" },
  ];

  // Alerts table data
  const getAlertsData = () => {
    if (errors.length > 0 || !consumer) {
      return [];
    }
    return consumer?.alerts || [];
  };

  const alertsData = getAlertsData();

  const alertsColumns = [
    { key: "sNo", label: "S.No" },
    { key: "eventDescription", label: "Event Description" },
    { key: "status", label: "Status" },
    { key: "eventDate", label: "Event Date" },
  ];

  // Menu items for PageHeader
  const menuItems = [
    { id: "refresh", label: "Edit", icon: "/icons/Edit.svg" },
  ];

  const handleBackClick = () => {
    navigate("/consumers");
  };

  const handleEditClick = () => {
    console.log("Edit button clicked");
    // Add edit logic here
  };

  const handleChartDownload = () => {
    console.log("Downloading chart data...");
    // Add chart download logic here
  };

  // Time range change handler for main chart
  const handleTimeRangeChange = (range: string) => {
    if (range === 'Daily' || range === 'Monthly' || range === 'Yearly') {
      setSelectedTimeRange(range as 'Daily' | 'Monthly' | 'Yearly');
    }
    console.log("Main chart time range changed to:", range);
  };

  // Time range change handler for first chart
  const handleFirstChartTimeRangeChange = (range: string) => {
    if (range === 'Daily' || range === 'Monthly' || range === 'Yearly') {
      setFirstChartTimeRange(range as 'Daily' | 'Monthly' | 'Yearly');
    }
    console.log("First chart time range changed to:", range);
  };



  // Initial loading state with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds initial loading

    return () => clearTimeout(timer);
  }, []);

  const fetchConsumerData = async () => {
    if (!consumerId) {
      setErrors(["No consumer ID provided"]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      // TODO: Replace with actual API calls when backend is ready
      const response = await fetch(`/api/consumers/${consumerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setConsumer(data);
    } catch (err) {
      console.error("Error fetching consumer data:", err);
      // Add multiple errors to simulate different API failures
      setErrors([
        "Failed to fetch consumer details",
        "Failed to fetch billing data",
        "Failed to fetch consumption data",
        "Failed to fetch meter readings",
        "Failed to fetch payment history",
        "Failed to fetch alerts data",
        "Failed to fetch chart data",
        "Failed to fetch statistics",
        "Failed to fetch occupancy status",
        "Failed to fetch real-time data"
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumerData();
  }, [consumerId]);



  return (
    <Page
      sections={[

                // Error Display Section - Stacked Card Effect (like other pages)
        ...(errors.length > 0 ? [{
          layout: {
            type: 'column' as const,
            gap: 'gap-4',
          },
          components: [
            {
              name: 'Error',
              props: {
                visibleErrors: errors,
                showRetry: true,
                maxVisibleErrors: 3, // Show max 3 errors at once with stacked effect
                onRetry: () => window.location.reload(),
              },
            },
          ],
        }] : []),
        // Header Section
        {
          layout: {
            type: "column",
            gap: "gap-4",
          },
          components: [
            {
              name: "PageHeader",
              props: {
                title: consumer ? consumer.name : "Consumer Details",
                menuItems: menuItems,
                showMenu: true,
                showDropdown: true,
                buttonsLabel: "Recharge",
                variant: "primary",
                onClick: handleEditClick,
                onBackClick: handleBackClick,
                backButtonText: "Back to Consumers",
              },
            },
          ],
        },

        // Consumer Information Section
        {
          layout: {
            type: "grid",
            columns: 2,
            className: "border border-primary-border rounded-3xl p-4 ",
            rows: [
              {
                layout: "row",
                className: "justify-between w-full",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "SectionHeader",
                    props: {
                      title: "Consumer Details",
                      titleVariant: "primary-dark",
                      titleWeight: "normal",
                      titleSize: "md",
                      titleAlign: "left",
                      layout: "horizontal",
                      gap: "gap-4",
                      className: "w-full",
                    },
                  },
                ],
              },
              // First Row - Basic Consumer Information
              {
                layout: "row" as const,
                className:
                  "border border-primary-border rounded-3xl p-4 bg-background-secondary",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "PageInformation",
                    props: {
                      gridColumns: 4,
                      rows: [
                        {
                          layout: "row",
                          className: "justify-between w-full",
                          span: { col: 4, row: 1 },
                          items: CONSUMER_INFO_ROW_1.map((item) => ({
                            title: item.title,
                            value: item.value,
                            align: "start",
                            gap: "gap-1",
                            statusIndicator: item.statusIndicator,
                            onClick: item.onClick,
                            clickable: item.clickable,
                            className: item.className,
                          })),
                        },
                      ],
                    },
                  },
                ],
              },
              // Second Row - Contact and Address Information
              {
                layout: "row" as const,
                className: "justify-between w-full pl-4",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "PageInformation",
                    props: {
                      gridColumns: 4,
                      rows: [
                        {
                          layout: "row",
                          className: "justify-between w-full",
                          span: { col: 4, row: 1 },
                          items: CONSUMER_INFO_ROW_2.map((item) => ({
                            title: item.title,
                            value: item.value,
                            align: "start",
                            gap: "gap-1",
                          })),
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        // Consumer Statistics Cards Section
        {
          layout: {
            type: "grid" as const,
            columns: 1,
            className:
              "w-full p-4 border border-primary-border rounded-3xl bg-background-secondary",
            rows: [
              {
                layout: "row" as const,
                className: "justify-between w-full",
                span: { col: 1, row: 1 },
                columns: [
                  {
                    name: "SectionHeader",
                    props: {
                      title: "Instantaneous Data",
                      titleLevel: 2,
                      titleSize: "md",
                      titleVariant: "primary-dark",
                      titleWeight: "normal",
                      titleAlign: "left",
                      className: "w-full",
                      rightComponent: {
                        name: "LastComm",
                        props: { value: lastComm },
                      },
                    },
                    span: { col: 1, row: 1 },
                  },
                ],
              },
              {
                layout: "grid" as const,
                gridColumns: 3,
                className: "w-full gap-4",
                columns: consumerStats.map((stat) => ({
                  name: "Card",
                  props: {
                    title: stat.title,
                    value: stat.value,
                    subtitle1: stat.subtitle1,
                    icon: stat.icon,
                    bg: stat.bg || "bg-stat-icon-gradient",
                    valueFontSize:
                      stat.valueFontSize ||
                      "text-lg lg:text-xl md:text-lg sm:text-base",
                    iconStyle: stat.iconStyle || "BRAND_GREEN",
                    iconClassName: stat.iconClassName,
                    width: stat.width,
                    height: stat.height,
                    loading: loading,
                  },
                  span: { col: 1, row: 1 },
                })),
              },
            ],
          },
        },
        // Consumer Performance and Billing Section (2-column grid like DTRDashboard)
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
                className: "bg-white border border-primary-border rounded-3xl  col-span-1",
                columns: [
                  {
                    name: "Holder",
                    props: {
                      title: "Billing Distribution",
                      subtitle: "Overview of bill statuses",
                      className: "border-none rounded-t-3xl text-center",
                    },
                  },
                  {
                    name: "PieChart",
                    props: {
                      data: billingPieData,
                      height: 300,
                      showLegendInteractions: true,
                      showHeader: false,
                      className: "px-2 flex justify-center",
                      showDownloadButton: true,
                      
                      onDownload: () => handleChartDownload(),
                      isLoading: loading,
                    },
                  },
                ],
              },
              {
                layout: "column",
                gap: "gap-0",
                className: "",
                columns: [
                  {
                    name: "BarChart",
                    props: {
                      xAxisData: firstChartData.xAxisData,
                      seriesData: firstChartData.seriesData,
                      seriesColors: firstChartData.seriesColors,
                      height: 300,
                      showLegendInteractions: true,
                      showHeader: true,
                      headerTitle: "Energy Consumption",
                      prependTimeRangeInTitle: false,
                      availableTimeRanges: ['Daily', 'Monthly', 'Yearly'],
                      initialTimeRange: firstChartTimeRange,
                      onTimeRangeChange: handleFirstChartTimeRangeChange,
                      showDownloadButton: true,
                      onDownload: () => handleChartDownload(),
                      isLoading: loading,
                    },
                  },
                ],
              },
            ],
          },
        },
        
        // Daily Consumption Chart and Tables Section
        {
          layout: {
            type: "grid" as const,
            className: "",
            columns: 1,
          },
          components: [
            // Daily Consumption Chart (1 row)
            {
              name: "BarChart",
              props: {
                xAxisData: currentChartData.xAxisData,
                seriesData: currentChartData.seriesData,
                seriesColors: currentChartData.seriesColors,
                height: 300,
                showLegendInteractions: true,
                showHeader: true,
                headerTitle: "Energy Consumption",
                prependTimeRangeInTitle: false,
                availableTimeRanges: ['Daily', 'Monthly', 'Yearly'],
                initialTimeRange: selectedTimeRange,
                onTimeRangeChange: handleTimeRangeChange,
                showDownloadButton: true,
                onDownload: () => handleChartDownload(),
                isLoading: loading,
              },
            },
          ],
        },
        // Current Bill Details and Consumption Summary Section
        {
          layout: {
            type: "grid",
            columns: 2,
            className: "border border-primary-border rounded-3xl p-4 ",
            rows: [
              {
                layout: "row",
                className: "justify-between w-full",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "SectionHeader",
                    span: { col: 1, row: 2 },
                    props: {
                      title: "Billing & History",
                      titleVariant: "primary-dark",
                      titleWeight: "normal",
                      titleSize: "md",
                      titleAlign: "left",
                      layout: "vertical",
                      gap: "gap-4",
                      className: "w-full",
                    },
                  },
                ],
              },
              {
                layout: "row",
                className: "justify-between w-full",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "SectionHeader",
                    span: { col: 1, row: 2 },
                    props: {
                      title: "Current Bill Details",
                      titleVariant: "primary-dark",
                      titleWeight: "normal",
                      titleSize: "md",
                      titleAlign: "left",
                      layout: "horizontal",
                      gap: "gap-4",
                      className: "w-full",
                    },
                  },
                ],
              },
              // Billing Dates Information
              {
                layout: "row" as const,
                className:
                  "border border-primary-border rounded-3xl p-4 bg-background-secondary",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "PageInformation",
                    props: {
                      gridColumns: 3,
                      rows: [
                        {
                          layout: "row",
                          className: "justify-between w-full",
                          span: { col: 3, row: 1 },
                          items: BILL_DETAILS_ROW.map((item) => ({
                            title: item.title,
                            value: item.value,
                            align: "start",
                            gap: "gap-1",
                          })),
                        },
                      ],
                    },
                  },
                ],
              },
              {
                layout: "row",
                className: "justify-between w-full mt-4",
                span: { col: 2, row: 1 },
                columns: [
                  {
                    name: "SectionHeader",
                    props: {
                      title: "Consumption Summary",
                      titleVariant: "primary-dark",
                      titleWeight: "normal",
                      titleSize: "md",
                      titleAlign: "left",
                      layout: "horizontal",
                      gap: "gap-4",
                      className: "w-full",
                    },
                  },
                ],
              },
              // Consumption Summary Cards
              {
                layout: "row" as const,
                className: "justify-between w-full",
                span: { col: 2, row: 1 },
                columns: consumptionSummaryCards.map((item) => ({
                  name: "Card",
                  props: {
                    title: item.title,
                    value: item.value,
                    subtitle1: item.subtitle1,
                    icon: item.icon,
                  width:2,
                  height:2,

                    bg: item.bg,
                    valueFontSize: item.valueFontSize,
                    iconStyle: item.iconStyle,
                    className:
                      "bg-background-secondary border border-primary-border",
                    loading: loading,
                  },
                })),
              },
            ],
          },
        },

        // Unit History Table Section
        {
          layout: {
            type: "grid" as const,
            className: "",
            columns: 1,
          },
          components: [
            {
              name: "Table",
              props: {
                data: meterReadingsData,
                columns: meterReadingsColumns,
                showHeader: true,
                headerTitle: "Unit History",
                showActions: false,
                searchable: true,
                pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: "No unit history found",
                loading: loading,
              },
            },
          ],
        },
        // Transaction History Table Section
        {
          layout: {
            type: "grid" as const,
            className: "",
            columns: 1,
          },
          components: [
            {
              name: "Table",
              props: {
                data: paymentHistoryData,
                columns: paymentHistoryColumns,
                showHeader: true,
                headerTitle: "Transaction History",
                showActions: false,
                searchable: true,
                pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: "No payment records found",
                loading: loading,
              },
            },
          ],
        },
        // Events Table Section
        {
          layout: {
            type: "grid" as const,
            className: "pb-4",
            columns: 1,
          },
          components: [
            {
              name: "Table",
              props: {
                data: alertsData,
                columns: alertsColumns,
                showHeader: true,
                headerTitle: "Events",
                showActions: false,
                searchable: true,
                 pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: "No alerts found",
                loading: loading,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default ConsumerDetailView;
