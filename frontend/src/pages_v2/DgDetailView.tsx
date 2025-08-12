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

  // Activity log state with smart meter focused data
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([
    {
      id: 1,
      description: "DG Set electrical output detected",
      timestamp: "2025-08-10T08:00:00",
      status: "Completed",
      author: "Smart Meter",
    },
    {
      id: 2,
      description: "Load increased to 71% - Active Power: 147 kW",
      timestamp: "2025-08-10T08:15:00",
      status: "In Progress",
      author: "Power Monitor",
    },
    {
      id: 3,
      description: "Power factor optimization completed - PF: 0.90",
      timestamp: "2025-08-10T09:30:00",
      status: "Completed",
      author: "Power Quality Monitor",
    },
    {
      id: 4,
      description: "Voltage imbalance detected - 0.7%",
      timestamp: "2025-08-10T10:00:00",
      status: "Warning",
      author: "Voltage Monitor",
    },
    {
      id: 5,
      description: "Frequency stability alert - deviation: 0.2%",
      timestamp: "2025-08-10T11:00:00",
      status: "Monitoring",
      author: "Frequency Monitor",
      subText: "Frequency variation within acceptable limits",
    },
    {
      id: 6,
      description: "Energy generation milestone - 125,000 kWh total",
      timestamp: "2025-08-10T12:00:00",
      status: "Completed",
      author: "Energy Meter",
    },
    {
      id: 7,
      description: "Reactive power optimization - 30 kVAR",
      timestamp: "2025-08-10T12:30:00",
      status: "Completed",
      author: "Power Factor Controller",
    },
    {
      id: 8,
      description: "Daily energy generation - 300 kWh",
      timestamp: "2025-08-10T13:00:00",
      status: "Completed",
      author: "Energy Monitor",
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

  // Electrical system metrics for StatusCard
  const electricalSystemMetrics = [
    {
      icon: "/icons/lightning.svg",
      label: "Active Power",
      value: "147 kW",
    },
    {
      icon: "/icons/gauge.svg",
      label: "Power Factor",
      value: "0.90",
    },
    {
      icon: "/icons/frequency.svg",
      label: "Frequency",
      value: "50.1 Hz",
    },
    {
      icon: "/icons/voltage.svg",
      label: "Voltage Unbalance",
      value: "0.7%",
    },
    {
      icon: "/icons/energy.svg",
      label: "Energy Today",
      value: "300 kWh",
    },
    {
      icon: "/icons/trending.svg",
      label: "Load Factor",
      value: "73.5%",
    },
  ];

  // Additional DG operational data based on smart meter
  const dgOperationalData = {
    performance: {
      efficiency: "85.2%", // Calculated from power factor and load factor
      powerOutput: "147 kW", // Active power from meter
      reactivePower: "30 kVAR", // From meter
      apparentPower: "162 kVA", // From meter
      loadFactor: "73.5%", // (147 kW / 200 kW rated) * 100
    },
    electrical: {
      voltageStability: "99.8%", // Based on voltage variations
      frequencyStability: "99.6%", // Based on frequency variations
      powerQuality: "Excellent", // Based on PF and voltage unbalance
      lastOptimization: "2025-08-10T10:00:00",
      totalOptimizations: "15",
      lastTechnician: "Power Quality System",
    },
    alerts: {
      critical: 1,
      warning: 2,
      info: 3,
      resolved: 15,
    },
    energy: {
      currentGeneration: "300 kWh",
      generationThisMonth: "8,500 kWh",
      lastPeakLoad: "180 kW",
      averageLoad: "147 kW",
      energyEfficiency: "0.90 PF",
      voltageUnbalance: "0.7%",
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

  // DG performance history data based on smart meter
  const performanceHistory = [
    {
      date: "2025-08-01",
      load: "65%",
      powerFactor: "0.87",
      energyGenerated: "280 kWh",
      voltageUnbalance: "0.5%",
    },
    {
      date: "2025-08-02",
      load: "72%",
      powerFactor: "0.89",
      energyGenerated: "310 kWh",
      voltageUnbalance: "0.8%",
    },
    {
      date: "2025-08-03",
      load: "68%",
      powerFactor: "0.88",
      energyGenerated: "290 kWh",
      voltageUnbalance: "0.6%",
    },
    {
      date: "2025-08-04",
      load: "75%",
      powerFactor: "0.86",
      energyGenerated: "330 kWh",
      voltageUnbalance: "1.2%",
    },
    {
      date: "2025-08-05",
      load: "71%",
      powerFactor: "0.90",
      energyGenerated: "300 kWh",
      voltageUnbalance: "0.7%",
    },
    {
      date: "2025-08-06",
      load: "69%",
      powerFactor: "0.91",
      energyGenerated: "285 kWh",
      voltageUnbalance: "0.4%",
    },
    {
      date: "2025-08-07",
      load: "73%",
      powerFactor: "0.88",
      energyGenerated: "315 kWh",
      voltageUnbalance: "0.9%",
    },
    {
      date: "2025-08-08",
      load: "67%",
      powerFactor: "0.92",
      energyGenerated: "275 kWh",
      voltageUnbalance: "0.3%",
    },
    {
      date: "2025-08-09",
      load: "74%",
      powerFactor: "0.87",
      energyGenerated: "325 kWh",
      voltageUnbalance: "1.1%",
    },
    {
      date: "2025-08-10",
      load: "71%",
      powerFactor: "0.90",
      energyGenerated: "300 kWh",
      voltageUnbalance: "0.7%",
    },
  ];

  // DG electrical maintenance history
  const electricalMaintenanceHistory = [
    {
      id: 1,
      date: "2025-07-15",
      type: "Power Factor Optimization",
      technician: "Power Quality System",
      hours: "1200",
      cost: "$500",
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-06-15",
      type: "Voltage Calibration",
      technician: "Electrical System",
      hours: "1150",
      cost: "$300",
      status: "Completed",
    },
    {
      id: 3,
      date: "2025-05-15",
      type: "Frequency Stabilization",
      technician: "Frequency Controller",
      hours: "1100",
      cost: "$400",
      status: "Completed",
    },
    {
      id: 4,
      date: "2025-04-15",
      type: "Power Quality Check",
      technician: "Power Quality System",
      hours: "1050",
      cost: "$250",
      status: "Completed",
    },
    {
      id: 5,
      date: "2025-03-15",
      type: "Emergency Power Restoration",
      technician: "Auto System",
      hours: "1000",
      cost: "$0",
      status: "Completed",
    },
  ];

  // DG alert history based on electrical parameters
  const alertHistory = [
    {
      id: 1,
      timestamp: "2025-08-10T12:00:00",
      type: "Warning",
      message: "Voltage imbalance detected - 0.7%",
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
      message: "Frequency deviation approaching limit",
      status: "Resolved",
    },
    {
      id: 4,
      timestamp: "2025-08-10T08:45:00",
      type: "Critical",
      message: "Power quality below threshold",
      status: "Active",
    },
    {
      id: 5,
      timestamp: "2025-08-10T08:00:00",
      type: "Info",
      message: "DG electrical output detected",
      status: "Resolved",
    },
  ];

  const powerQualityChartData = {
    label: "Power Factor (last hour)",
    value: "0.90 PF",
    icon: "/icons/lightning.svg",
    data: [0.87, 0.89, 0.91, 0.88, 0.90, 0.92, 0.89, 0.91, 0.88, 0.90, 0.91, 0.89],
  };

  // Handle Excel export
  const handleExportData = () => {
    import("xlsx").then((XLSX) => {
      const workbook = XLSX.utils.book_new();

      // Prepare DG Overview data
      const dgOverviewData = [
        { Metric: "DG Set", Value: `DG Set ${dgId} – Plant A` },
        { Metric: "Location", Value: "Plant A • 40.7128° N, 74.0060° W" },
        { Metric: "Status", Value: "Running" },
        { Metric: "Active Power", Value: "147 kW" },
        { Metric: "Power Factor", Value: "0.90" },
        { Metric: "Frequency", Value: "50.1 Hz" },
        { Metric: "Voltage Unbalance", Value: "0.7%" },
        { Metric: "Load Factor", Value: "73.5%" },
        { Metric: "Energy Today", Value: "300 kWh" },
        { Metric: "Total Energy", Value: "125,000 kWh" },
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
                // Row 1: Left side - Electrical Status Card, Right side - Power Quality Card
                {
                  layout: "grid",
                  gap: "gap-6",
                  gridColumns: 2,
                  columns: [
                    {
                      name: "Card",
                      props: {
                        title: "Electrical Status",
                        value: "147 kW / 0.90 PF",
                        icon: "/icons/lightning.svg",
                        subtitle1: "Active Power / Power Factor",
                        subtitle2: "Current electrical output",
                        bg: "bg-blue-50",
                        className: "",
                      },
                      span: { col: 1, row: 1 },
                    },
                    {
                      name: "Card",
                      props: {
                        title: "Power Quality",
                        value: "50.1 Hz / 0.7%",
                        icon: "/icons/gauge.svg",
                        subtitle1: "Frequency / V Unbalance",
                        subtitle2: "Electrical system health",
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
                          title: "Electrical System Metrics",
                          titleProps: {
                            size: "md",
                            weight: "bold",
                          },
                          metrics: [
                            {
                              icon: "/icons/lightning.svg",
                              label: "Active Power",
                              value: "147 kW",
                              progressBar: {
                                percentage: 73.5,
                                color: "primary",
                              },
                            },
                            {
                              icon: "/icons/frequency.svg",
                              label: "Frequency",
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
              // Combined Row: Power Quality, Electrical Health, and Communication Device
              // Power Quality Card
              {
                name: "StatusCard",
                props: {
                  title: "Power Quality & Efficiency",
                  titleProps: {
                    size: "md",
                    weight: "bold",
                  },
                  metrics: [
                    {
                      icon: "/icons/lightning.svg",
                      label: "Power Factor",
                      value: "0.90",
                      progressBar: {
                        percentage: 90,
                        color: "primary",
                      },
                    },
                    {
                      icon: "/icons/energy.svg",
                      label: "Energy Generated",
                      value: "300 kWh",
                    },
                    {
                      icon: "/icons/trending.svg",
                      label: "Load Factor",
                      value: "73.5%",
                    },
                    {
                      icon: "/icons/voltage.svg",
                      label: "Voltage Stability",
                      value: "99.8%",
                    },
                    {
                      icon: "/icons/frequency.svg",
                      label: "Frequency Stability",
                      value: "99.6%",
                    },
                  ],

                  className: "bg-white p-6 border border-primary-border h-fit",
                  buttons: [
                    {
                      label: "Optimize Power Factor",
                      variant: "primary",
                      onClick: () => console.log("Power Factor Optimization clicked"),
                    },
                  ],
                },
              },
              // Electrical Health StatusCard
              {
                name: "StatusCard",
                props: {
                  title: "Electrical System Health",
                  titleProps: {
                    size: "md",
                    weight: "bold",
                  },
                  metrics: [
                    {
                      icon: "/icons/lightning.svg",
                      label: "Active Power",
                      value: "147 kW (73.5%)",
                      progressBar: {
                        percentage: 73.5,
                        color: "secondary",
                      },
                    },
                    ...electricalSystemMetrics,
                  ],
                  chartData: powerQualityChartData,
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
                  title: "Electrical Performance Analytics",
                  subtitle: "Power Quality and Electrical System Metrics",
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
              // Power Quality Bar Chart
              {
                name: "BarChart",
                props: {
                  xAxisData: [
                    "Power Factor",
                    "Frequency (Hz)",
                    "Voltage Unbalance (%)",
                    "Load Factor (%)",
                  ],
                  seriesData: [
                    {
                      name: "Current Values",
                      data: [0.90, 50.1, 0.7, 73.5],
                    },
                  ],
                  seriesColors: ["#8B5CF6"],
                  height: "400px",
                  showHeader: true,
                  headerTitle: "Power Quality Metrics",
                  dateRange: "Real-time",
                  showDownloadButton: true,
                  headerHeight: "h-12",
                  ariaLabel: "Power quality metrics visualization chart",
                  onDownload: () => {
                    console.log("Downloading power quality chart");
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
                  title: "Electrical Data & Monitoring",
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
                  headerTitle: "Electrical System Alerts & Activity Log",
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
                  title: "Load Factor",
                  value: "73.5%",
                  icon: "/icons/gauge.svg",
                  subtitle1: "System utilization",
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
                  title: "Electrical Performance History (Last 10 Days)",
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
                    { key: "powerFactor", label: "Power Factor" },
                    { key: "energyGenerated", label: "Energy Generated (kWh)" },
                    { key: "voltageUnbalance", label: "Voltage Unbalance (%)" },
                  ],
                  loading: false,
                  searchable: true,
                  pagination: true,
                  showActions: false,
                  showHeader: true,
                  headerTitle: "Daily Electrical Performance Metrics",
                  height: 300,
                  className: "w-full",
                },
              },
            ],
          },
          // Electrical Maintenance History Table Section
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
                  title: "Electrical System Maintenance History",
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
                  data: electricalMaintenanceHistory,
                  columns: [
                    { key: "date", label: "Date" },
                    { key: "type", label: "Service Type" },
                    { key: "technician", label: "System" },
                    { key: "hours", label: "Running Hours" },
                    { key: "cost", label: "Cost" },
                    { key: "status", label: "Status" },
                  ],
                  loading: false,
                  searchable: true,
                  pagination: true,
                  showActions: false,
                  showHeader: true,
                  headerTitle: "Electrical System Records",
                  height: 300,
                  className: "w-full",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default DgDetailView;
