import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "@/components/global/PageC";
import BACKEND_URL from "../config";

const ConsumerDetailView: React.FC = () => {
  const { consumerId } = useParams<{ consumerId: string }>();
  const navigate = useNavigate();

  // State for consumer data
  const [consumer, setConsumer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastComm = '30/06/2025 22:31:38';

  // Mock consumer data for demonstration based on the image
  const mockConsumerData = {
    id: consumerId,
    name: `Consumer ${consumerId}`,
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
      title: "Current Balance",
      value: mockConsumerData.currentBalance,
      subtitle1: "Available Balance",
      icon: "/icons/current-balance.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Meter Status",
      value: mockConsumerData.status,
      subtitle1: "Connection Status",
      icon: "/icons/meter_managment.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Sanctioned Load",
      value: `${mockConsumerData.sanctionedLoad} kW`,
      subtitle1: "Maximum Load",
      icon: "/icons/energy.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Connection Type",
      value: mockConsumerData.connectionType,
      subtitle1: "Service Category",
      icon: "/icons/connection.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Occupancy",
      value: mockConsumerData.occupancyStatus,
      subtitle1: "Property Status",
      icon: "/icons/user_managment.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Meter Number",
      value: mockConsumerData.meterSerialNumber,
      subtitle1: "Serial Number",
      icon: "/icons/meter_managment.svg",
      bg: "bg-stat-icon-gradient",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
  ];

  // Consumer Information Data Arrays (similar to MeterDetails structure)
  const CONSUMER_INFO_ROW_1 = [
    { title: "Current Balance (₹)", value: mockConsumerData.currentBalance },
    {
      title: "Unique Identification No",
      value: mockConsumerData.uniqueIdentificationNo,
    },
    { title: "Meter Serial Number", value: mockConsumerData.meterSerialNumber },
    { title: "Occupancy Status", value: mockConsumerData.occupancyStatus },
  ];

  const CONSUMER_INFO_ROW_2 = [
    { title: "Permanent Address", value: mockConsumerData.permanentAddress },
    { title: "Billing Address", value: mockConsumerData.billingAddress },
    { title: "Mobile No", value: mockConsumerData.mobileNo },
    { title: "Email ID", value: mockConsumerData.emailId },
  ];

  // Chart data for consumer consumption
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const consumptionSeries = [
    {
      name: 'Energy Consumption (kWh)',
      data: [180, 195, 210, 185, 200, 175, 190, 205, 220, 195, 180, 200]
    },
    {
      name: 'Peak Demand (kW)',
      data: [15, 16, 18, 14, 17, 13, 16, 19, 20, 16, 15, 17]
    }
  ];
  const consumptionColors = ['#10B981', '#3B82F6'];

  // Daily consumption chart data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyConsumptionSeries = [
    {
      name: 'Daily Consumption (kWh)',
      data: [25, 28, 22, 30, 26, 20, 18]
    }
  ];
  const dailyConsumptionColors = ['#8B5CF6'];

  // Billing history table data
  const billingHistoryData = [
    {
      id: 1,
      billNumber: 'BILL-001',
      billDate: '2024-01-15',
      dueDate: '2024-02-15',
      amount: '₹1,250.00',
      status: 'Paid',
    },
    {
      id: 2,
      billNumber: 'BILL-002',
      billDate: '2024-02-15',
      dueDate: '2024-03-15',
      amount: '₹1,350.00',
      status: 'Pending',
    },
    {
      id: 3,
      billNumber: 'BILL-003',
      billDate: '2024-03-15',
      dueDate: '2024-04-15',
      amount: '₹1,450.00',
      status: 'Overdue',
    },
  ];

  const billingHistoryColumns = [
    { key: 'billNumber', label: 'Bill Number' },
    { key: 'billDate', label: 'Bill Date' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ];

  // Meter readings table data
  const meterReadingsData = [
    {
      id: 1,
      date: '2024-01-15',
      reading: '1250.50',
      consumption: '45.20',
      peakDemand: '12.5',
      status: 'Normal',
    },
    {
      id: 2,
      date: '2024-01-16',
      reading: '1295.70',
      consumption: '42.30',
      peakDemand: '11.8',
      status: 'Normal',
    },
    {
      id: 3,
      date: '2024-01-17',
      reading: '1338.00',
      consumption: '48.90',
      peakDemand: '14.2',
      status: 'High',
    },
  ];

  const meterReadingsColumns = [
    { key: 'date', label: 'Date' },
    { key: 'reading', label: 'Reading (kWh)' },
    { key: 'consumption', label: 'Consumption (kWh)' },
    { key: 'peakDemand', label: 'Peak Demand (kW)' },
    { key: 'status', label: 'Status' },
  ];

  // Payment history table data
  const paymentHistoryData = [
    {
      id: 1,
      paymentId: 'PAY-001',
      date: '2024-01-20',
      amount: '₹1,250.00',
      method: 'Online',
      status: 'Completed',
    },
    {
      id: 2,
      paymentId: 'PAY-002',
      date: '2024-02-18',
      amount: '₹1,350.00',
      method: 'Cash',
      status: 'Completed',
    },
    {
      id: 3,
      paymentId: 'PAY-003',
      date: '2024-03-25',
      amount: '₹1,450.00',
      method: 'Cheque',
      status: 'Pending',
    },
  ];

  const paymentHistoryColumns = [
    { key: 'paymentId', label: 'Payment ID' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status' },
  ];

  // Alerts table data
  const alertsData = [
    {
      id: 1,
      type: 'High Consumption',
      message: 'Daily consumption exceeded threshold',
      date: '2024-01-17',
      severity: 'Warning',
      status: 'Active',
    },
    {
      id: 2,
      type: 'Payment Due',
      message: 'Bill payment overdue by 5 days',
      date: '2024-03-20',
      severity: 'Critical',
      status: 'Active',
    },
    {
      id: 3,
      type: 'Meter Alert',
      message: 'Meter communication issue detected',
      date: '2024-01-25',
      severity: 'Info',
      status: 'Resolved',
    },
  ];

  const alertsColumns = [
    { key: 'type', label: 'Alert Type' },
    { key: 'message', label: 'Message' },
    { key: 'date', label: 'Date' },
    { key: 'severity', label: 'Severity' },
    { key: 'status', label: 'Status' },
  ];

  // Menu items for PageHeader
  const menuItems = [
    { id: "refresh", label: "Refresh Data", icon: "/icons/refresh.svg" },
    { id: "export", label: "Export Data", icon: "/icons/export.svg" },
    { id: "settings", label: "Settings", icon: "/icons/settings.svg" },
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
                buttonsLabel: "Edit",
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
                      titleWeight: "bold",
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
                      rightComponent: { name: 'LastComm', props: { value: lastComm } },
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
            type: 'grid' as const,
            className: '',
            columns: 2,
          },
          components: [
            {
              name: 'BarChart',
              props: {
                xAxisData: months,
                seriesData: consumptionSeries,
                seriesColors: consumptionColors,
                height: 300,
                showLegendInteractions: true,
                showHeader: true,
                headerTitle: 'Consumer Energy Consumption',
                showDownloadButton: true,
                onDownload: () => handleChartDownload(),
              },
            },
            {
              name: 'Table',
              props: {
                data: billingHistoryData,
                columns: billingHistoryColumns,
                showHeader: true,
                headerTitle: 'Billing History',
                showActions: false,
                searchable: true,
                pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: 'No billing records found',
              },
            },
          ],
        },
        // Daily Consumption Chart and Tables Section
        {
          layout: {
            type: 'grid' as const,
            className: '',
            columns: 1,
          },
          components: [
            // Daily Consumption Chart (1 row)
            {
              name: 'BarChart',
              props: {
                xAxisData: days,
                seriesData: dailyConsumptionSeries,
                seriesColors: dailyConsumptionColors,
                height: 300,
                showLegendInteractions: true,
                showHeader: true,
                headerTitle: 'Daily Energy Consumption',
                showDownloadButton: true,
                onDownload: () => handleChartDownload(),
              },
            },
            // Meter Readings Table (1 row)
            {
              name: 'Table',
              props: {
                data: meterReadingsData,
                columns: meterReadingsColumns,
                showHeader: true,
                headerTitle: 'Meter Readings',
                showActions: false,
                searchable: true,
                pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: 'No meter readings found',
              },
            },
            // Payment History Table (1 row)
            {
              name: 'Table',
              props: {
                data: paymentHistoryData,
                columns: paymentHistoryColumns,
                showHeader: true,
                headerTitle: 'Payment History',
                showActions: false,
                searchable: true,
                pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: 'No payment records found',
              },
            },
            // Alerts Table (1 row)
            {
              name: 'Table',
              props: {
                data: alertsData,
                columns: alertsColumns,
                showHeader: true,
                headerTitle: 'Consumer Alerts',
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
      ]}
    />
  );
};

export default ConsumerDetailView;
