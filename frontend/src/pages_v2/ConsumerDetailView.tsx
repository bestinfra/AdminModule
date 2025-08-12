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
  const [error, setError] = useState<string | null>(null);
  const lastComm = "30/06/2025 22:31:38";

  // State to control chart time range
  const [selectedTimeRange, setSelectedTimeRange] = useState<'Daily' | 'Monthly' | 'Yearly'>('Daily');

  // Mock consumer data for demonstration based on the image
  const mockConsumerData = {
    id: consumerId,
    name: ` ${consumerId}`,
    consumerNumber: consumerId,
    currentBalance: "₹0.00",
    uniqueIdentificationNo: consumerId,
    meterSerialNumber: "A9211434",
    occupancyStatus: "Occupied",
    permanentAddress: "GHASL, GMR",
    billingAddress: "GHASL, GMR",
    mobileNo: "+91********49",
    emailId: "************@gmail.com",
    connectionType: "COMMERCIAL",
    category: "COMMERCIAL",
    sanctionedLoad: 15.0,
    status: "ACTIVE",
  };

  // Consumer Statistics Cards Data
  const consumerStats = [
    {
      title: "R-Phase Voltage",
      value: "233.51",
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
      value: "0.0",
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
      value: "0.0",
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
      value: "0.45",
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
      value: "0.0",
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
      value: "0.0",
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

  // Handler for occupancy status click
  const handleOccupancyStatusClick = () => {
    navigate('/occupancy-status');
  };

  // Consumer Information Data Arrays (similar to MeterDetails structure)
  const CONSUMER_INFO_ROW_1 = [
    { title: "Current Balance (₹)", value: mockConsumerData.currentBalance },
    {
      title: "Unique Identification No",
      value: mockConsumerData.uniqueIdentificationNo,
    },
    { title: "Meter Serial Number", value: mockConsumerData.meterSerialNumber, statusIndicator: true },
      { 
    title: "Occupancy Status", 
    value: mockConsumerData.occupancyStatus,
    onClick: handleOccupancyStatusClick,
    clickable: true,
    className: "hover:text-primary"
  },
  ];

  const CONSUMER_INFO_ROW_2 = [
    { title: "Permanent Address", value: mockConsumerData.permanentAddress },
    { title: "Billing Address", value: mockConsumerData.billingAddress },
    { title: "Mobile No", value: mockConsumerData.mobileNo },
    { title: "Email ID", value: mockConsumerData.emailId },
  ];

  // Second Consumer Details Data (different data)
  // const CONSUMER_INFO_ROW_3 = [
  //   { title: "Connection Type", value: mockConsumerData.connectionType },
  //   { title: "Category", value: mockConsumerData.category },
  //   {
  //     title: "Sanctioned Load",
  //     value: `${mockConsumerData.sanctionedLoad} kW`,
  //   },
  //   { title: "Meter Status", value: mockConsumerData.status },
  // ];

  // const CONSUMER_INFO_ROW_4 = [
  //   { title: "Installation Date", value: "2023-01-15" },
  //   { title: "Last Reading Date", value: "2024-01-20" },
  //   { title: "Meter Type", value: "Smart Meter" },
  //   { title: "Phase Type", value: "Three Phase" },
  // ];

  // Current Bill Details Data
  const BILL_DETAILS_ROW = [
    { title: "Billing Month", value: "1/7/2025" },
    { title: "Bill Period", value: "1/6/2025 - 30/6/2025" },
    { title: "Due Date", value: "9/7/2025" },
  ];

  // Consumption Summary Cards Data
  const consumptionSummaryCards = [
    {
      title: "Monthly Consumption (kWh)",
      value: "8.45",
      subtitle1: "Last Month: 64.78 kWh",
      icon: "/icons/electric.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Daily Consumption (kWh)",
      value: "0.39",
      subtitle1: "Yesterday: 2.03 kWh",
      icon: "/icons/coins.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Total Outstanding (Rs.)",
      value: "0",
      subtitle1: "Last Month: ₹0",
      icon: "/icons/search.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Bill Status",
      value: "Overdue",
      subtitle1: "Due Date: 9/7/2025",
      icon: "/icons/bills2.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
  ];

  // Comprehensive Chart data for different time ranges
  const dailyChartData = {
    xAxisData: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    seriesData: [
    {
      name: "Energy Consumption (kWh)",
        data: [12.5, 18.2, 16.8, 19.5, 17.3, 20.1, 14.7],
    },
    {
      name: "Peak Demand (kW)",
        data: [2.1, 3.2, 2.8, 3.5, 2.9, 3.8, 2.4],
      },
    ],
    seriesColors: ["#10B981", "#3B82F6"],
  };

  const monthlyChartData = {
    xAxisData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    seriesData: [
      { name: 'Consumption (kWh)', data: [120, 140, 100, 130, 150, 170, 165, 180, 190, 175, 160, 185] }
    ],
    seriesColors: ["#10B981", "#3B82F6"],
  };

  const yearlyChartData = {
    xAxisData: ['2020', '2021', '2022', '2023', '2024', '2025'],
    seriesData: [
      {
        name: "Energy Consumption (kWh)",
        data: [1850, 2100, 1950, 2200, 2050, 1800],
      },
      {
        name: "Peak Demand (kW)",
        data: [18, 22, 20, 25, 23, 19],
      },
    ],
    seriesColors: ["#10B981", "#3B82F6"],
  };

  // Dynamic chart data based on selected time range
  const getChartData = () => {
    switch (selectedTimeRange) {
      case 'Daily':
        return dailyChartData;
      case 'Monthly':
        return monthlyChartData;
      case 'Yearly':
        return yearlyChartData;
      default:
        return dailyChartData;
    }
  };

  const currentChartData = getChartData();

  // Separate chart data for the first chart (with its own time range state)
  const [firstChartTimeRange, setFirstChartTimeRange] = useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');
  
  const getFirstChartData = () => {
    switch (firstChartTimeRange) {
      case 'Daily':
        return dailyChartData;
      case 'Monthly':
        return monthlyChartData;
      case 'Yearly':
        return yearlyChartData;
      default:
        return monthlyChartData;
    }
  };

  const firstChartData = getFirstChartData();

  // Pie chart data for billing distribution
  const billingPieData = [
    { name: "Paid Bills", value: 65, color: "#10B981" },
    { name: "Pending Bills", value: 20, color: "#F59E0B" },
    { name: "Overdue Bills", value: 15, color: "#EF4444" },
  ];

  // Meter readings table data
  const meterReadingsData = [
    {
      id: 1,
      uid: "BI25GMRA001",
      meterSerialNo: "A9211434",
      companyName: "Airborne General Store",
      unitName: "Main Unit",
      createdOn: "2024-01-15",
    },
    {
      id: 2,
      uid: "BI25GMRA002",
      meterSerialNo: "A9345417",
      companyName: "Neo Travels",
      unitName: "Office Unit",
      createdOn: "2024-01-16",
    },
    {
      id: 3,
      uid: "BI25GMRA003",
      meterSerialNo: "A9211433",
      companyName: "Mobikins",
      unitName: "Shop Unit",
      createdOn: "2024-01-17",
    },

{
      id: 4,
      uid: "BI25GMRA001",
      meterSerialNo: "A9211434",
      companyName: "Airborne General Store",
      unitName: "Main Unit",
      createdOn: "2024-01-15",
    },
    {
      id: 5,
      uid: "BI25GMRA002",
      meterSerialNo: "A9345417",
      companyName: "Neo Travels",
      unitName: "Office Unit",
      createdOn: "2024-01-16",
    },
    {
      id: 6,
      uid: "BI25GMRA003",
      meterSerialNo: "A9211433",
      companyName: "Mobikins",
      unitName: "Shop Unit",
      createdOn: "2024-01-17",
    },






  ];

  const meterReadingsColumns = [
    { key: "uid", label: "UID" },
    { key: "meterSerialNo", label: "Meter Serial No" },
    { key: "companyName", label: "Company Name" },
    { key: "unitName", label: "Unit Name" },
    { key: "createdOn", label: "Created On" },
  ];

  // Payment history table data
  const paymentHistoryData = [
    {
      id: 1,
      transactionId: "TXN-001",
      creditAmount: "₹1,250.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-01-20",
    },
    {
      id: 2,
      transactionId: "TXN-002",
      creditAmount: "₹1,350.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-02-18",
    },
    {
      id: 3,
      transactionId: "TXN-003",
      creditAmount: "₹1,450.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-03-25",
    },

    {
      id: 4,
      transactionId: "TXN-004",
      creditAmount: "₹1,250.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-01-20",
    },
    {
      id: 2,
      transactionId: "TXN-002",
      creditAmount: "₹1,350.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-02-18",
    },
    {
      id: 3,
      transactionId: "TXN-003",
      creditAmount: "₹1,450.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-03-25",
    },
    {
      id: 1,
      transactionId: "TXN-001",
      creditAmount: "₹1,250.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-01-20",
    },
    {
      id: 2,
      transactionId: "TXN-002",
      creditAmount: "₹1,350.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-02-18",
    },
    {
      id: 3,
      transactionId: "TXN-003",
      creditAmount: "₹1,450.00",
      currentBalanceAmount: "₹0.00",
      paymentDate: "2024-03-25",
    },





  ];

  const paymentHistoryColumns = [
    { key: "transactionId", label: "Transaction ID" },
    { key: "creditAmount", label: "Credit Amount" },
    { key: "currentBalanceAmount", label: "Current Balance Amount" },
    { key: "paymentDate", label: "Payment Date" },
  ];

  // Alerts table data
  const alertsData = [
    {
      id: 1,
      sNo: 1,
      eventDescription: "High consumption alert triggered",
      status: "Active",
      eventDate: "2024-01-17",
    },
    {
      id: 2,
      sNo: 2,
      eventDescription: "Payment due reminder sent",
      status: "Resolved",
      eventDate: "2024-03-20",
    },
    {
      id: 3,
      sNo: 3,
      eventDescription: "Meter communication restored",
      status: "Completed",
      eventDate: "2024-01-25",
    },
    {
      id: 4,
      sNo: 4,
      eventDescription: "High consumption alert triggered",
      status: "Active",
      eventDate: "2024-01-17",
    },
    {
      id: 5,
      sNo: 5,
      eventDescription: "Payment due reminder sent",
      status: "Resolved",
      eventDate: "2024-03-20",
    },
    {
      id: 6,
      sNo: 6,
      eventDescription: "Meter communication restored",
      status: "Completed",
      eventDate: "2024-01-25",
    },
  ];

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

  const fetchConsumerData = async () => {
    if (!consumerId) {
      setError("No consumer ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, use mock data instead of API call to avoid the JSON parsing error
      // TODO: Replace with actual API call when backend is ready
      console.log("Fetching consumer data for ID:", consumerId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Use mock data
      setConsumer(mockConsumerData);
      console.log("Consumer data set:", mockConsumerData);

      // Uncomment below when API is ready:
      // const response = await fetch(`${BACKEND_URL}/consumers/${consumerId}`);
      // if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data = await response.json();
      // setConsumer(data);
    } catch (err) {
      console.error("Error fetching consumer data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching consumer data"
      );
      // Fallback to mock data on error
      setConsumer(mockConsumerData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumerData();
  }, [consumerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading consumer details...</div>
      </div>
    );
  }

  if (error && !consumer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!consumer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Consumer not found</div>
      </div>
    );
  }

  console.log("Rendering with consumer data:", consumer);

  return (
    <Page
      sections={[
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
                title: consumer.name || "Consumer Details",
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
              },
            },
          ],
        },
      ]}
    />
  );
};

export default ConsumerDetailView;
