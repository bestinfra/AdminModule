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
      title: "R-Phase Voltage",
      value: "233.51",
      subtitle1: "Volts",
      icon: "/icons/voltage.svg",
      bg: "bg-danger",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Y-Phase Voltage",
      value: "0.0",
      subtitle1: "Volts",
      icon: "/icons/voltage.svg",
      bg: "bg-warning-alt",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "B-Phase Voltage",
      value: "0.0",
      subtitle1: "Volts",
      icon: "/icons/voltage.svg",
      bg: "bg-primary",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "R-Phase Current",
      value: "0.45",
      subtitle1: "Amps",
      icon: "/icons/current.svg",
      bg: "bg-danger",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "Y-Phase Current",
      value: "0.0",
      subtitle1: "Amps",
      icon: "/icons/current.svg",
      bg: "bg-warning-alt",
      valueFontSize: "text-lg lg:text-xl md:text-lg sm:text-base",
      iconStyle: "BRAND_GREEN",
    },
    {
      title: "B-Phase Current",
      value: "0.0",
      subtitle1: "Amps",
      icon: "/icons/current.svg",
      bg: "bg-primary",
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
      uid: 'BI25GMRA001',
      meterSerialNo: 'A9211434',
      companyName: 'Airborne General Store',
      unitName: 'Main Unit',
      createdOn: '2024-01-15',
    },
    {
      id: 2,
      uid: 'BI25GMRA002',
      meterSerialNo: 'A9345417',
      companyName: 'Neo Travels',
      unitName: 'Office Unit',
      createdOn: '2024-01-16',
    },
    {
      id: 3,
      uid: 'BI25GMRA003',
      meterSerialNo: 'A9211433',
      companyName: 'Mobikins',
      unitName: 'Shop Unit',
      createdOn: '2024-01-17',
    },
  ];

  const meterReadingsColumns = [
    { key: 'uid', label: 'UID' },
    { key: 'meterSerialNo', label: 'Meter Serial No' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'unitName', label: 'Unit Name' },
    { key: 'createdOn', label: 'Created On' },
  ];

  // Payment history table data
  const paymentHistoryData = [
    {
      id: 1,
      transactionId: 'TXN-001',
      creditAmount: '₹1,250.00',
      currentBalanceAmount: '₹0.00',
      paymentDate: '2024-01-20',
    },
    {
      id: 2,
      transactionId: 'TXN-002',
      creditAmount: '₹1,350.00',
      currentBalanceAmount: '₹0.00',
      paymentDate: '2024-02-18',
    },
    {
      id: 3,
      transactionId: 'TXN-003',
      creditAmount: '₹1,450.00',
      currentBalanceAmount: '₹0.00',
      paymentDate: '2024-03-25',
    },
  ];

  const paymentHistoryColumns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'creditAmount', label: 'Credit Amount' },
    { key: 'currentBalanceAmount', label: 'Current Balance Amount' },
    { key: 'paymentDate', label: 'Payment Date' },
  ];

  // Alerts table data
  const alertsData = [
    {
      id: 1,
      sNo: 1,
      eventDescription: 'High consumption alert triggered',
      status: 'Active',
      eventDate: '2024-01-17',
    },
    {
      id: 2,
      sNo: 2,
      eventDescription: 'Payment due reminder sent',
      status: 'Resolved',
      eventDate: '2024-03-20',
    },
    {
      id: 3,
      sNo: 3,
      eventDescription: 'Meter communication restored',
      status: 'Completed',
      eventDate: '2024-01-25',
    },
  ];

  const alertsColumns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'eventDescription', label: 'Event Description' },
    { key: 'status', label: 'Status' },
    { key: 'eventDate', label: 'Event Date' },
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
            className: 'pb-4',
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
                headerTitle: 'Unit History',
                showActions: false,
                searchable: true,
                pagination: true,
                availableTimeRanges: [],
                initialRowsPerPage: 3,
                emptyMessage: 'No unit history found',
              },
            },
            // Payment History Table (1 row)
            {
              name: 'Table',
              props: {
                data: paymentHistoryData,
                columns: paymentHistoryColumns,
                showHeader: true,
                headerTitle: 'Transaction History',
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
                headerTitle: 'Events',
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
