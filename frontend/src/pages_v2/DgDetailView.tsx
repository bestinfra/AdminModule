import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "@/components/global/PageC";
import { Pagination } from "antd";

// Interface for ActivityLogEntry
interface ActivityLogEntry {
  id: string | number;
  description: string;
  timestamp: string;
  status?: string;
  subText?: string;
  author?: string;
}

// Interface for Electrical Parameters Table Data
interface ElectricalParameterData {
  parameter: string;
  r: string;
  y: string;
  b: string;
  avg: string;
}

const DgDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { dgId } = useParams<{ dgId: string }>();

  // Activity log state with dummy data
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([
    {
      id: 1,
      description: "DG Set started successfully",
      timestamp: "2025-08-10T08:00:00",
      status: "Completed",
      author: "System Operator",
    },
    {
      id: 2,
      description: "Load increased to 71%",
      timestamp: "2025-08-10T08:15:00",
      status: "In Progress",
      author: "Auto System",
    },
    {
      id: 3,
      description: "Fuel level alert - 60% remaining",
      timestamp: "2025-08-10T09:30:00",
      status: "Warning",
      author: "Monitoring System",
    },
    {
      id: 4,
      description: "Power factor optimized to 0.90",
      timestamp: "2025-08-10T10:00:00",
      status: "Completed",
      author: "Auto System",
    },
    {
      id: 5,
      description: "Maintenance schedule reminder",
      timestamp: "2025-08-10T11:00:00",
      status: "Pending",
      author: "Maintenance System",
      subText: "Next maintenance due in 50 hours",
    },
    {
      id: 6,
      description: "Voltage imbalance detected - 0.7%",
      timestamp: "2025-08-10T12:00:00",
      status: "Monitoring",
      author: "Power Quality Monitor",
    },
    {
      id: 7,
      description: "Running hours updated - 1250:45 total",
      timestamp: "2025-08-10T12:30:00",
      status: "Completed",
      author: "Hour Meter",
    },
    {
      id: 8,
      description: "Emergency stop test completed",
      timestamp: "2025-08-10T13:00:00",
      status: "Completed",
      author: "Safety System",
    },
  ]);

  // Electrical Parameters Table Data state
  const [electricalParamsTableData, setElectricalParamsTableData] = useState<ElectricalParameterData[]>([
    {
      parameter: "Voltage (V)",
      r: "230 V",
      y: "232 V",
      b: "229 V",
      avg: "230 V",
    },
    {
      parameter: "Current (A)",
      r: "100 A",
      y: "98 A",
      b: "102 A",
      avg: "100 A",
    },
    {
      parameter: "Active Power (kW)",
      r: "50 kW",
      y: "48 kW",
      b: "49 kW",
      avg: "147 kW",
    },
    {
      parameter: "Reactive Power (kVAR)",
      r: "10 kVAR",
      y: "9 kVAR",
      b: "11 kVAR",
      avg: "30 kVAR",
    },
    {
      parameter: "Apparent Power (kVA)",
      r: "55 kVA",
      y: "53 kVA",
      b: "54 kVA",
      avg: "162 kVA",
    },
    {
      parameter: "Frequency (Hz)",
      r: "50.1 Hz",
      y: "50.1 Hz",
      b: "50.1 Hz",
      avg: "50.1 Hz",
    },
    {
      parameter: "Power Factor",
      r: "0.90",
      y: "0.91",
      b: "0.89",
      avg: "0.90",
    },
    {
      parameter: "Energy Today (kWh)",
      r: "300 kWh",
      y: "300 kWh",
      b: "300 kWh",
      avg: "300 kWh",
    },
    {
      parameter: "Total Energy (kWh)",
      r: "125,000 kWh",
      y: "125,000 kWh",
      b: "125,000 kWh",
      avg: "125,000 kWh",
    },
  ]);

  // Engine Health data for StatusCard
  const engineHealthMetrics = [
    {
      icon: "/icons/shield.svg",
      label: "Oil Pressure",
      value: "4.5 bar",
    },
    {
      icon: "/icons/gear.svg",
      label: "Engine Temp",
      value: "85°C",
    },
    {
      icon: "/icons/thermometer.svg",
      label: "Coolant Temp",
      value: "90°C",
    },
    {
      icon: "/icons/battery.svg",
      label: "Battery Voltage",
      value: "12.8 V",
    },
    {
      icon: "/icons/power.svg",
      label: "Start Attempts",
      value: "3",
    },
    {
      icon: "/icons/power.svg",
      label: "Successful Starts",
      value: "2",
    },
  ];

  // Additional DG operational data
  const dgOperationalData = {
    performance: {
      efficiency: "85.2%",
      fuelConsumption: "12.5 L/hour",
      powerOutput: "625 kW",
      reactivePower: "30 kVAR",
      apparentPower: "626 kVA",
    },
    maintenance: {
      lastService: "2025-07-15",
      nextService: "2025-09-15",
      serviceInterval: "500 hours",
      remainingHours: "50 hours",
      totalServices: "8",
      lastTechnician: "John Smith",
    },
    alerts: {
      critical: 1,
      warning: 2,
      info: 3,
      resolved: 15,
    },
    fuel: {
      currentLevel: "60%",
      currentVolume: "1200 L",
      consumptionToday: "150 L",
      consumptionThisMonth: "4500 L",
      lastRefill: "2025-08-01",
      refillAmount: "1000 L",
      theftAlerts: 0,
    },
  };

  // Electrical metrics data for ElectricalMetricsCard
  const electricalMetrics = [
    {
      label: "PF Avg",
      value: "0.90",
      status: "good" as const,
      color: "var(--color-secondary)", // Green
    },
    {
      label: "Freq",
      value: "50.1",
      unit: "Hz",
      status: "good" as const,
      color: "var(--color-primary)", // Blue
    },
    {
      label: "V Imbalance",
      value: "0.7",
      unit: "%",
      status: "neutral" as const,
      color: "var(--color-grey)", // Grey
    },
  ];

  // DG performance history data
  const performanceHistory = [
    {
      date: "2025-08-01",
      load: "65%",
      efficiency: "87.1%",
      fuelConsumption: "11.8 L/h",
    },
    {
      date: "2025-08-02",
      load: "72%",
      efficiency: "85.9%",
      fuelConsumption: "12.9 L/h",
    },
    {
      date: "2025-08-03",
      load: "68%",
      efficiency: "86.5%",
      fuelConsumption: "12.2 L/h",
    },
    {
      date: "2025-08-04",
      load: "75%",
      efficiency: "84.8%",
      fuelConsumption: "13.1 L/h",
    },
    {
      date: "2025-08-05",
      load: "71%",
      efficiency: "85.2%",
      fuelConsumption: "12.5 L/h",
    },
    {
      date: "2025-08-06",
      load: "69%",
      efficiency: "86.8%",
      fuelConsumption: "12.0 L/h",
    },
    {
      date: "2025-08-07",
      load: "73%",
      efficiency: "85.6%",
      fuelConsumption: "12.7 L/h",
    },
    {
      date: "2025-08-08",
      load: "67%",
      efficiency: "87.3%",
      fuelConsumption: "11.9 L/h",
    },
    {
      date: "2025-08-09",
      load: "74%",
      efficiency: "84.9%",
      fuelConsumption: "13.0 L/h",
    },
    {
      date: "2025-08-10",
      load: "71%",
      efficiency: "85.2%",
      fuelConsumption: "12.5 L/h",
    },
  ];

  // DG maintenance history
  const maintenanceHistory = [
    {
      id: 1,
      date: "2025-07-15",
      type: "Scheduled Service",
      technician: "John Smith",
      hours: "1200",
      cost: "$2,500",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-06-15",
      type: "Oil Change",
      technician: "Mike Johnson",
      hours: "1150",
      cost: "$800",
      status: "Completed",
    },
    {
      id: 3,
      date: "2025-05-15",
      type: "Filter Replacement",
      technician: "Sarah Wilson",
      hours: "1100",
      cost: "$1,200",
      status: "Completed",
    },
    {
      id: 4,
      date: "2025-04-15",
      type: "Scheduled Service",
      technician: "John Smith",
      hours: "1050",
      cost: "$2,300",
      status: "Completed",
    },
    {
      id: 5,
      date: "2025-03-15",
      type: "Emergency Repair",
      technician: "Mike Johnson",
      hours: "1000",
      cost: "$3,500",
      status: "Completed",
    },
  ];

  // DG alert history
  const alertHistory = [
    {
      id: 1,
      timestamp: "2025-08-10T12:00:00",
      type: "Warning",
      message: "Fuel level below 70%",
      status: "Active",
    },
    {
      id: 2,
      timestamp: "2025-08-10T10:30:00",
      type: "Info",
      message: "Power factor optimization completed",
      status: "Resolved",
    },
    {
      id: 3,
      timestamp: "2025-08-10T09:15:00",
      type: "Warning",
      message: "Engine temperature approaching limit",
      status: "Resolved",
    },
    {
      id: 4,
      timestamp: "2025-08-10T08:45:00",
      type: "Critical",
      message: "Voltage imbalance detected",
      status: "Active",
    },
    {
      id: 5,
      timestamp: "2025-08-10T08:00:00",
      type: "Info",
      message: "DG Set started successfully",
      status: "Resolved",
    },
  ];

  const rpmChartData = {
    label: "RPM (last hour)",
    value: "1557 RPM",
    icon: "/icons/heartbeat.svg",
    data: [45, 67, 89, 76, 54, 78, 92, 85, 67, 89, 76, 54],
  };

  // Handle Excel export
  const handleExportData = () => {
    import("xlsx").then((XLSX) => {
      const workbook = XLSX.utils.book_new();

      // Prepare DG Overview data
      const dgOverviewData = [
        { Metric: "DG Set", Value: `DG Set ${dgId} – Plant A` },
        { Metric: "Location", Value: "Plant A • 40.7128° N, 74.0060° W" },
        { Metric: "Status", Value: "Fault" },
        { Metric: "Running Hours Today", Value: "05:41" },
        { Metric: "Total Running Hours", Value: "1250:45" },
        { Metric: "Load", Value: "71%" },
        { Metric: "Fuel Level", Value: "60% (1200 L)" },
        { Metric: "Power Factor Average", Value: "0.90" },
        { Metric: "Frequency", Value: "50.1 Hz" },
        { Metric: "Voltage Imbalance", Value: "0.7%" },
      ];

      // Prepare Electrical Parameters data
      const electricalParamsData = [
        { Parameter: "Voltage (V)", R: 230, Y: 232, B: 229, Avg: 230 },
        { Parameter: "Current (A)", R: 100, Y: 98, B: 102, Avg: 100 },
        { Parameter: "Active Power (kW)", R: 50, Y: 48, B: 49, Avg: 147 },
        { Parameter: "Reactive Power (kVAR)", R: 10, Y: 9, B: 11, Avg: 30 },
        { Parameter: "Apparent Power (kVA)", R: 55, Y: 53, B: 54, Avg: 162 },
        { Parameter: "Frequency (Hz)", R: 50.1, Y: 50.1, B: 50.1, Avg: 50.1 },
        { Parameter: "Power Factor", R: 0.9, Y: 0.91, B: 0.89, Avg: 0.9 },
        { Parameter: "Energy Today (kWh)", R: 300, Y: 300, B: 300, Avg: 300 },
        {
          Parameter: "Total Energy (kWh)",
          R: 125000,
          Y: 125000,
          B: 125000,
          Avg: 125000,
        },
      ];

      // Convert data to worksheets
      const overviewSheet = XLSX.utils.json_to_sheet(dgOverviewData);
      const electricalSheet = XLSX.utils.json_to_sheet(electricalParamsData);

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, overviewSheet, "DG Overview");
      XLSX.utils.book_append_sheet(
        workbook,
        electricalSheet,
        "Electrical Parameters"
      );

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dg-${dgId}-detail-view-data.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="">
      <Page
        sections={[
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
                  title: `DG Set ${dgId} – Plant A`,
                  onBackClick: () => navigate("/dg-dashboard"),
                  backButtonText: "Back to DG Dashboard",
                  buttonsLabel: "Export",
                  variant: "primary",
                  onClick: () => handleExportData(),
                  showMenu: true,
                  showDropdown: true,
                  menuItems: [
                    { id: "startDg", label: "Start DG" },
                    { id: "stopDg", label: "Stop DG" },
                    { id: "emergencyStop", label: "Emergency Stop" },
                  ],
                  onMenuItemClick: (itemId: string) => {
                    console.log(`Menu item clicked: ${itemId}`);
                  },
                },
              },
            ],
          },
          // Status Cards below PageHeader - 2 columns layout
          {
            layout: {
              type: "grid",
              columns: 2,
              gap: "gap-6",
              className: "p-4 border border-primary-border rounded-xl bg-background-secondary items-center",
              rows: [
                // Row 1: Left side - Running Hours Card, Right side - System Status Card
                {
                  layout: "grid",
                  gap: "gap-6",
                  gridColumns: 2,
                  columns: [
                    {
                      name: "Card",
                      props: {
                        title: "Running Hours",
                        value: "05:41 / 1250:45",
                        icon: "/icons/clock.svg",
                        subtitle1: "Today / Total",
                        subtitle2: "Current operational time",
                        bg: "bg-blue-50",
                        className: "",
                      },
                      span: { col: 1, row: 1 },
                    },
                    {
                      name: "Card",
                      props: {
                        title: "Load & Fuel Status",
                        value: "71% / 60%",
                        icon: "/icons/gauge.svg",
                        subtitle1: "Load / Fuel Level",
                        subtitle2: "Current operational metrics",
                        bg: "bg-green-50",
                      },
                      span: { col: 1, row: 1 },
                    },
                  ],
                },
                {
                    layout: "grid",
                    gap: "gap-6",
                    gridColumns: 1,
                    className:'w-full',
                    columns: [
                    
  
                      {
                        name: "StatusCard",
                        span: { col: 1, row: 1 },
                        props: {
                          title: "System Status",
                          titleProps: {
                            size: "md",
                            weight: "bold",
                          },
                          metrics: [
                            {
                              icon: "/icons/power.svg",
                              label: "Load",
                              value: "0.90",
                              progressBar: {
                                percentage: 90,
                                color: "primary",
                              },
                            },
                            {
                              icon: "/icons/frequency.svg",
                              label: "Fuel",
                              value: "50.1 Hz",
                              progressBar: {
                                percentage: 100,
                                color: "secondary",
                              },
                            },
                          ],
                          className: "bg-background-secondary p-0",
                        },
                      },
                    ],
                  },
                // Row 2: Left side - Load & Fuel Status Card
              ],
            },
          },
          {
            layout: {
              type: "column",
              className: "",
            },
            components: [
              {
                name: "ElectricalMetricsCard",
                props: {
                  metrics: electricalMetrics,
                  title: "Electrical System Metrics",
                  className: "w-full",
                },
              },
            ],
          },
          {
            layout: {
              type: "grid",
              columns: 3,
              gap: "gap-6",
              className: "",
            },
            components: [
              // Combined Row: Fuel & Efficiency, Engine Health, and Communication Device
              // Fuel & Efficiency Card
              {
                name: "StatusCard",
                props: {
                  title: "Fuel & Efficiency",
                  titleProps: {
                    size: "md",
                    weight: "bold",
                  },
                  metrics: [
                    {
                      icon: "/icons/fuel.svg",
                      label: "Fuel Level",
                      value: "60% (1200 L)",
                      progressBar: {
                        percentage: 60,
                        color: "primary",
                      },
                    },
                    {
                      icon: "/icons/consumption.svg",
                      label: "Consumption",
                      value: "12.5 L/h",
                    },
                    {
                      icon: "/icons/efficiency.svg",
                      label: "Efficiency",
                      value: "85.2%",
                    },
                    {
                      icon: "/icons/refill.svg",
                      label: "Last Refill",
                      value: "2025-08-01",
                    },
                    {
                      icon: "/icons/trending.svg",
                      label: "Trend",
                      value: "Stable",
                    },
                  ],

                  className: "bg-white p-6 border border-primary-border h-fit",
                  buttons: [
                    {
                      label: "Refill Request",
                      variant: "primary",
                      onClick: () => console.log("Refill Request clicked"),
                    },
                  ],
                },
              },
              // Engine Health StatusCard
              {
                name: "StatusCard",
                props: {
                  title: "Engine Health",
                  titleProps: {
                    size: "md",
                    weight: "bold",
                  },
                  metrics: [
                    {
                      icon: "/icons/power.svg",
                      label: "Load Status",
                      value: "71% (625 kW)",
                      progressBar: {
                        percentage: 71,
                        color: "secondary",
                      },
                    },
                    ...engineHealthMetrics,
                  ],
                  chartData: rpmChartData,
                  className: "bg-white p-6 border border-primary-border",
                  buttons: [
                    {
                      label: "View History",
                      onClick: () => console.log("View History clicked"),
                    },
                  ],
                },
              },
              // Communication & Device
              {
                name: "SummaryInfo",

                props: {
                  title: "Communication & Device",
                  status: {
                    text: "Online",
                    variant: "success",
                  },
                  rightStatus: {
                    text: "120 hours",
                    variant: "info",
                    onClick: () => console.log("Uptime details clicked"),
                  },
                  data: {
                    leftColumn: [
                      { label: "Device ID", value: "DGX-12345" },
                      { label: "Firmware", value: "v2.3.1" },
                      { label: "Comm Status", value: "Online" },
                      {
                        label: "Last Comm Time",
                        value: "10/8/2025, 17:11:56 IST",
                      },
                    ],
                    rightColumn: [
                      { label: "Signal", value: "-55 dBm" },
                      { label: "Uptime", value: "120 hours" },
                      { label: "Protocol", value: "Modbus TCP" },
                      { label: "IP Address", value: "192.168.1.100" },
                    ],
                  },
                  buttons: [
                    {
                      label: "Ping Device",
                      variant: "primary",
                      onClick: () => {
                        console.log("Ping Device clicked");
                        // Add ping device logic here
                      },
                    },
                    {
                      label: "Restart",
                      variant: "warning",
                      onClick: () => {
                        console.log("Restart clicked");
                        // Add restart logic here
                      },
                    },
                  ],
                  className: " border border-primary-border h-fit",
                  titleClassName: "text-lg font-semibold text-gray-900",
                },
              },
            ],
          },
          // Two Graphs Section
          // Performance Analytics Section Header
          {
            layout: {
              type: "column",
              className: "",
            },
            components: [
              {
                name: "SectionHeader",
                props: {
                  title: "Performance Analytics",
                  subtitle: "Electrical Parameters and Engine Health Metrics",
                  className: "",
                },
              },
            ],
          },
          // Two Graphs Section
          {
            layout: {
              type: "grid",
              columns: 2,
              gap: "gap-6",
              className: "",
            },
            components: [
              // Electrical Parameters Bar Chart
              {
                name: "BarChart",
                props: {
                  xAxisData: [
                    "Voltage (V)",
                    "Current (A)",
                    "Active Power (kW)",
                    "Reactive Power (kVAR)",
                    "Apparent Power (kVA)",
                  ],
                  seriesData: [
                    {
                      name: "R Phase",
                      data: [230, 100, 50, 10, 55],
                    },
                    {
                      name: "Y Phase",
                      data: [232, 98, 48, 9, 53],
                    },
                    {
                      name: "B Phase",
                      data: [229, 102, 49, 11, 54],
                    },
                  ],
                  seriesColors: ["#3B82F6", "#10B981", "#F59E0B"],
                  height: "400px",
                  showHeader: true,
                  headerTitle: "Electrical Parameters",
                  dateRange: "Real-time",
                  showDownloadButton: true,
                  headerHeight: "h-12",
                  ariaLabel: "Electrical parameters visualization chart",
                  onDownload: () => {
                    console.log("Downloading electrical parameters chart");
                    // Add download logic here
                  },
                },
              },
              // Engine Health Bar Chart
              {
                name: "BarChart",
                props: {
                  xAxisData: [
                    "Oil Pressure",
                    "Engine Temp",
                    "Coolant Temp",
                    "Battery Voltage",
                  ],
                  seriesData: [
                    {
                      name: "Current Values",
                      data: [4.5, 85, 90, 24.5],
                    },
                  ],
                  seriesColors: ["#8B5CF6"],
                  height: "400px",
                  showHeader: true,
                  headerTitle: "Engine Health Metrics",
                  dateRange: "Real-time",
                  showDownloadButton: true,
                  headerHeight: "h-12",
                  ariaLabel: "Engine health metrics visualization chart",
                  onDownload: () => {
                    console.log("Downloading engine health chart");
                    // Add download logic here
                  },
                },
              },
            ],
          },
          // Operational Data Section Header
          {
            layout: {
              type: "column",
              className: "",
            },
            components: [
              {
                name: "SectionHeader",
                props: {
                  title: "Operational Data & Monitoring",
                  subtitle: "Electrical Parameters and System Alerts",
                  className: "",
                },
              },
            ],
          },
          // Electrical Parameters and Alerts/Faults Section
          {
            layout: {
              type: "grid",
              columns: 2,
              gap: "gap-6",
              className: "",
            },
            components: [
              // Electrical Parameters Table
              {
                name: "Table",
                props: {
                  data: electricalParamsTableData,
                  columns: [
                    { key: "parameter", label: "Parameter" },
                    { key: "r", label: "R" },
                    { key: "y", label: "Y" },
                    { key: "b", label: "B" },
                    { key: "avg", label: "Avg" },
                  ],
                  loading: false,
                  searchable: false,
                  pagination: true,
                  initialRowsPerPage: 6,
                  showActions: false,
                  showHeader: true,
                  headerTitle: "Electrical Parameters",
                  dateRange: "Real-time",
                  headerClassName: "h-12",
                  height: 300,
                  className: "w-full",
                },
              },
              // Alerts and Activity Log
              {
                name: "ActivityLog",
                props: {
                  entries: activityLog,
                  maxHeight: "h-96",
                  showHeader: true,
                  headerTitle: "System Alerts & Activity Log",
                  dateRange: "Last 24 hours",
                  headerClassName: "h-96",
                },
              },
            ],
          },
          // Progress Bars and Metrics
          {
            layout: {
              type: "grid",
              columns: 3,
              gap: "gap-6",
              className: "",
            },
            components: [
              {
                name: "Card",
                props: {
                  title: "Load & Fuel Status",
                  value: "71% / 60%",
                  icon: "/icons/gauge.svg",
                  subtitle1: "Current operational metrics",
                  bg: "bg-gray-50",
                },
              },
              {
                name: "Card",
                props: {
                  title: "Power Quality",
                  value: "0.90 PF",
                  icon: "/icons/lightning.svg",
                  subtitle1: "Electrical performance metrics",
                  bg: "bg-gray-50",
                },
              },
              {
                name: "Card",
                props: {
                  title: "Quick Actions",
                  value: "3 Controls",
                  icon: "/icons/settings.svg",
                  subtitle1: "Operational controls",
                  bg: "bg-gray-50",
                },
              },
            ],
          },

          // Performance History Table Section
          {
            layout: {
              type: "grid" as const,
              columns: 1,
              className: "",
            },
            components: [
              {
                name: "SectionHeader",
                props: {
                  title: "Performance History (Last 10 Days)",
                  titleLevel: 3,
                  titleSize: "md",
                  titleVariant: "colorPrimaryDark",
                  titleWeight: "medium",
                  titleAlign: "left",
                  layout: "horizontal",
                  gap: "gap-4",
                },
              },
              {
                name: "Table",
                props: {
                  data: performanceHistory,
                  columns: [
                    { key: "date", label: "Date" },
                    { key: "load", label: "Load (%)" },
                    { key: "efficiency", label: "Efficiency (%)" },
                    { key: "fuelConsumption", label: "Fuel Consumption (L/h)" },
                  ],
                  loading: false,
                  searchable: true,
                  pagination: true,
                  showActions: false,
                  showHeader: true,
                  headerTitle: "Daily Performance Metrics",
                  height: 300,
                  className: "w-full",
                },
              },
            ],
          },
          // Maintenance History Table Section
          {
            layout: {
              type: "grid" as const,
              columns: 1,
              className: "",
            },
            components: [
              {
                name: "SectionHeader",
                props: {
                  title: "Maintenance History",
                  titleLevel: 3,
                  titleSize: "md",
                  titleVariant: "colorPrimaryDark",
                  titleWeight: "medium",
                  titleAlign: "left",
                  layout: "horizontal",
                  gap: "gap-4",
                },
              },
              {
                name: "Table",
                props: {
                  data: maintenanceHistory,
                  columns: [
                    { key: "date", label: "Date" },
                    { key: "type", label: "Service Type" },
                    { key: "technician", label: "Technician" },
                    { key: "hours", label: "Running Hours" },
                    { key: "cost", label: "Cost" },
                    { key: "status", label: "Status" },
                  ],
                  loading: false,
                  searchable: true,
                  pagination: true,
                  showActions: false,
                  showHeader: true,
                  headerTitle: "Service Records",
                  height: 300,
                  className: "w-full",
                },
              },
            ],
          },
          // DG Status Cards
        //   {
        //     layout: {
        //       type: "grid",
        //       columns: 4,
        //       gap: "gap-4",
        //       className: "",
        //     },
        //     components: [
        //       {
        //         name: "Card",
        //         props: {
        //           title: "Location",
        //           value: "Plant A • 40.7128° N, 74.0060° W",
        //           icon: "/icons/location.svg",
        //           subtitle1: "Geographic coordinates",
        //           bg: "bg-blue-50",
        //         },
        //       },
        //       {
        //         name: "Card",
        //         props: {
        //           title: "Running Hours Today",
        //           value: "05:41",
        //           icon: "/icons/clock.svg",
        //           subtitle1: "Current day operation",
        //           bg: "bg-green-50",
        //         },
        //       },
        //       {
        //         name: "Card",
        //         props: {
        //           title: "Total Running Hours",
        //           value: "1250:45",
        //           icon: "/icons/timer.svg",
        //           subtitle1: "Lifetime operation",
        //           bg: "bg-purple-50",
        //         },
        //       },
        //       {
        //         name: "Card",
        //         props: {
        //           title: "Status",
        //           value: "Fault",
        //           icon: "/icons/alert-triangle.svg",
        //           subtitle1: "Last update: 10/8/2025, 12:24:43 IST",
        //           bg: "bg-red-50",
        //         },
        //       },
        //     ],
        //   },
        ]}
      />

     
      {/* Quick Actions */}
      {/* <div className="">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Start DG
                        </button>
                        <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
                            Stop DG
                        </button>
                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Emergency Stop
                        </button>
                    </div>
                </div>
            </div> */}
    </div>
  );
};

export default DgDetailView;
