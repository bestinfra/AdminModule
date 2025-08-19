import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../components/global/PageC";

const DGDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dgSets, setDgSets] = useState<any[]>([]);
  const cardsPerPage = 6;

  // Enhanced mock data for DG sets with smart meter data only - This will be used as fallback
  const fallbackDgSets = [
    {
      id: "DG001",
      name: "DG Set #1",
      location: "Plant A - Building 1",
      status: "running" as const,
      // Smart meter electrical parameters
      voltage: { r: 230, y: 232, b: 229, avg: 230 },
      current: { r: 100, y: 98, b: 102, avg: 100 },
      activePower: 147, // kW
      reactivePower: 30, // kVAR
      apparentPower: 162, // kVA
      powerFactor: 0.9,
      frequency: 50.1, // Hz
      energyToday: 300, // kWh
      energyTotal: 125000, // kWh
      // Calculated metrics
      loadFactor: 73.5, // (147 kW / 200 kW rated) * 100
      voltageUnbalance: 1.3, // %
      frequencyStability: 0.2, // %
      runtimeHours: 7.5, // inferred from electrical activity
      peakLoadToday: 180, // kW
      lastUpdate: "Just now",
      // Smart meter alerts
      alerts: { count: 1, type: "warning" as const },
      // Additional data for better display
      category: "Industrial Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg001.powercorp.com",
      created: "2023-01-15",
      updated: "2024-01-20",
      website: "powercorp.com",
      modules: [
        { name: "Power Monitoring" },
        { name: "Energy Management" },
        { name: "Alert System" },
      ],
      connectedApis: [
        { name: "SCADA System", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
        { name: "Load Monitor", status: "connected" as const },
      ],
      meters: { total: 15, active: 12, inactive: 3 },
      tickets: { count: 2, href: "/tickets/dg001" },
    },
    {
      id: "DG002",
      name: "DG Set #2",
      location: "Plant A - Building 2",
      status: "running" as const,
      voltage: { r: 231, y: 230, b: 232, avg: 231 },
      current: { r: 85, y: 87, b: 86, avg: 86 },
      activePower: 120, // kW
      reactivePower: 25, // kVAR
      apparentPower: 130, // kVA
      powerFactor: 0.92,
      frequency: 50.0, // Hz
      energyToday: 280, // kWh
      energyTotal: 98000, // kWh
      loadFactor: 60.0, // (120 kW / 200 kW rated) * 100
      voltageUnbalance: 0.9, // %
      frequencyStability: 0.0, // %
      runtimeHours: 6.5, // inferred from electrical activity
      peakLoadToday: 150, // kW
      lastUpdate: "2 min ago",
      category: "Emergency Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg002.powercorp.com",
      created: "2023-03-22",
      updated: "2024-01-19",
      website: "powercorp.com",
      modules: [{ name: "Emergency Control" }, { name: "Energy Monitoring" }],
      connectedApis: [
        { name: "Emergency System", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
      ],
      meters: { total: 8, active: 8, inactive: 0 },
      tickets: { count: 0, href: "/tickets/dg002" },
      alerts: { count: 0, type: "info" as const },
    },
    {
      id: "DG003",
      name: "DG Set #3",
      location: "Plant B - Building 1",
      status: "running" as const,
      voltage: { r: 229, y: 231, b: 230, avg: 230 },
      current: { r: 75, y: 78, b: 76, avg: 76.3 },
      activePower: 95, // kW
      reactivePower: 20, // kVAR
      apparentPower: 105, // kVA
      powerFactor: 0.9,
      frequency: 50.2, // Hz
      energyToday: 240, // kWh
      energyTotal: 75000, // kWh
      loadFactor: 47.5, // (95 kW / 200 kW rated) * 100
      voltageUnbalance: 0.9, // %
      frequencyStability: 0.4, // %
      runtimeHours: 5.8, // inferred from electrical activity
      peakLoadToday: 120, // kW
      lastUpdate: "1 min ago",
      category: "Industrial Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg003.powercorp.com",
      created: "2022-11-08",
      updated: "2024-01-20",
      website: "powercorp.com",
      modules: [
        { name: "High Power Control" },
        { name: "Advanced Monitoring" },
        { name: "Fault Detection" },
      ],
      connectedApis: [
        { name: "Power Controller", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
        { name: "Load Balancer", status: "connected" as const },
      ],
      meters: { total: 22, active: 22, inactive: 0 },
      tickets: { count: 0, href: "/tickets/dg003" },
      alerts: { count: 0, type: "info" as const },
    },
    {
      id: "DG004",
      name: "DG Set #4",
      location: "Plant B - Building 2",
      status: "running" as const,
      voltage: { r: 230, y: 233, b: 231, avg: 231.3 },
      current: { r: 90, y: 92, b: 91, avg: 91 },
      activePower: 135, // kW
      reactivePower: 28, // kVAR
      apparentPower: 145, // kVA
      powerFactor: 0.93,
      frequency: 50.1, // Hz
      energyToday: 320, // kWh
      energyTotal: 110000, // kWh
      loadFactor: 67.5, // (135 kW / 200 kW rated) * 100
      voltageUnbalance: 1.3, // %
      frequencyStability: 0.2, // %
      runtimeHours: 8.2, // inferred from electrical activity
      peakLoadToday: 170, // kW
      lastUpdate: "3 min ago",
      category: "Industrial Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg004.powercorp.com",
      created: "2023-06-14",
      updated: "2024-01-20",
      website: "powercorp.com",
      modules: [
        { name: "Efficiency Monitor" },
        { name: "Energy Analytics" },
        { name: "Performance Analytics" },
      ],
      connectedApis: [
        { name: "Efficiency System", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
        { name: "Performance Tracker", status: "connected" as const },
      ],
      meters: { total: 18, active: 18, inactive: 0 },
      tickets: { count: 1, href: "/tickets/dg004" },
      alerts: { count: 1, type: "warning" as const },
    },
    {
      id: "DG005",
      name: "DG Set #5",
      location: "Plant C - Building 1",
      status: "running" as const,
      voltage: { r: 228, y: 230, b: 229, avg: 229 },
      current: { r: 60, y: 62, b: 61, avg: 61 },
      activePower: 80, // kW
      reactivePower: 18, // kVAR
      apparentPower: 88, // kVA
      powerFactor: 0.91,
      frequency: 49.9, // Hz
      energyToday: 200, // kWh
      energyTotal: 65000, // kWh
      loadFactor: 40.0, // (80 kW / 200 kW rated) * 100
      voltageUnbalance: 0.9, // %
      frequencyStability: 0.2, // %
      runtimeHours: 4.3, // inferred from electrical activity
      peakLoadToday: 100, // kW
      lastUpdate: "5 min ago",
      category: "Support Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg005.powercorp.com",
      created: "2023-08-30",
      updated: "2024-01-20",
      website: "powercorp.com",
      modules: [{ name: "Support Systems" }, { name: "Load Management" }],
      connectedApis: [
        { name: "Support Controller", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
      ],
      meters: { total: 12, active: 12, inactive: 0 },
      tickets: { count: 0, href: "/tickets/dg005" },
      alerts: { count: 0, type: "info" as const },
    },
    {
      id: "DG006",
      name: "DG Set #6",
      location: "Plant C - Building 2",
      status: "running" as const,
      voltage: { r: 231, y: 230, b: 232, avg: 231 },
      current: { r: 82, y: 84, b: 83, avg: 83 },
      activePower: 110, // kW
      reactivePower: 22, // kVAR
      apparentPower: 120, // kVA
      powerFactor: 0.92,
      frequency: 50.0, // Hz
      energyToday: 260, // kWh
      energyTotal: 85000, // kWh
      loadFactor: 55.0, // (110 kW / 200 kW rated) * 100
      voltageUnbalance: 0.9, // %
      frequencyStability: 0.0, // %
      runtimeHours: 6.9, // inferred from electrical activity
      peakLoadToday: 140, // kW
      lastUpdate: "1 min ago",
      category: "Legacy Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg006.powercorp.com",
      created: "2021-12-03",
      updated: "2024-01-18",
      website: "powercorp.com",
      modules: [{ name: "Legacy Control" }, { name: "Maintenance Mode" }],
      connectedApis: [
        { name: "Legacy System", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
      ],
      meters: { total: 10, active: 10, inactive: 0 },
      tickets: { count: 0, href: "/tickets/dg006" },
      alerts: { count: 0, type: "info" as const },
    },
    {
      id: "DG007",
      name: "DG Set #7",
      location: "Plant D - Building 1",
      status: "running" as const,
      voltage: { r: 232, y: 234, b: 233, avg: 233 },
      current: { r: 95, y: 98, b: 96, avg: 96.3 },
      activePower: 155, // kW
      reactivePower: 32, // kVAR
      apparentPower: 165, // kVA
      powerFactor: 0.94,
      frequency: 50.2, // Hz
      energyToday: 380, // kWh
      energyTotal: 140000, // kWh
      loadFactor: 77.5, // (155 kW / 200 kW rated) * 100
      voltageUnbalance: 0.9, // %
      frequencyStability: 0.4, // %
      runtimeHours: 7.5, // inferred from electrical activity
      peakLoadToday: 190, // kW
      lastUpdate: "2 min ago",
      category: "Critical Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg007.powercorp.com",
      created: "2022-05-17",
      updated: "2024-01-20",
      website: "powercorp.com",
      modules: [
        { name: "Critical Control" },
        { name: "High Performance Monitor" },
        { name: "Redundancy System" },
      ],
      connectedApis: [
        { name: "Critical Controller", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
        { name: "Redundancy Checker", status: "connected" as const },
      ],
      meters: { total: 25, active: 25, inactive: 0 },
      tickets: { count: 1, href: "/tickets/dg007" },
      alerts: { count: 1, type: "warning" as const },
    },
    {
      id: "DG008",
      name: "DG Set #8",
      location: "Plant D - Building 2",
      status: "running" as const,
      voltage: { r: 230, y: 231, b: 230, avg: 230.3 },
      current: { r: 70, y: 72, b: 71, avg: 71 },
      activePower: 95, // kW
      reactivePower: 20, // kVAR
      apparentPower: 105, // kVA
      powerFactor: 0.9,
      frequency: 50.1, // Hz
      energyToday: 220, // kWh
      energyTotal: 72000, // kWh
      loadFactor: 47.5, // (95 kW / 200 kW rated) * 100
      voltageUnbalance: 0.4, // %
      frequencyStability: 0.2, // %
      runtimeHours: 5.1, // inferred from electrical activity
      peakLoadToday: 120, // kW
      lastUpdate: "4 min ago",
      category: "Backup Power",
      health: "Live" as const,
      company: "PowerCorp Industries",
      subdomain: "dg008.powercorp.com",
      created: "2023-02-28",
      updated: "2024-01-19",
      website: "powercorp.com",
      modules: [{ name: "Backup Control" }, { name: "Fault Detection" }],
      connectedApis: [
        { name: "Backup Controller", status: "connected" as const },
        { name: "Smart Meter", status: "connected" as const },
        { name: "System Monitor", status: "connected" as const },
      ],
      meters: { total: 14, active: 14, inactive: 0 },
      tickets: { count: 0, href: "/tickets/dg008" },
      alerts: { count: 0, type: "info" as const },
    },
  ];

  // Fetch DG sets from API
  const fetchDGSets = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      // Replace this with your actual API endpoint
      const response = await fetch('/api/dg-sets');
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      setDgSets(data);
    } catch (error) {
      console.error('Failed to fetch DG sets:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to fetch data');
      // Use fallback data when API fails
      setDgSets(fallbackDgSets);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDGSets();
  }, []);

  // Refresh function for the refresh button
  const handleRefresh = () => {
    fetchDGSets();
  };

  const filteredDGSets = dgSets.filter((dg) => {
    const matchesSearch =
      dg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dg.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate summary statistics based on smart meter data only
  // const runningCount = dgSets.filter(dg => dg.status === 'running').length;
  // const totalAlerts = dgSets.reduce((sum, dg) => sum + dg.alerts.count, 0);
  // const avgActivePower = Math.round(dgSets.reduce((sum, dg) => sum + dg.activePower, 0) / dgSets.length);
  // const avgPowerFactor = (dgSets.reduce((sum, dg) => sum + dg.powerFactor, 0) / dgSets.length).toFixed(2);
  // const avgVoltageUnbalance = (dgSets.reduce((sum, dg) => sum + dg.voltageUnbalance, 0) / dgSets.length).toFixed(1);
  // const totalEnergyGenerated = dgSets.reduce((sum, dg) => sum + dg.energyToday, 0);
  // const avgFrequencyStability = (dgSets.reduce((sum, dg) => sum + dg.frequencyStability, 0) / dgSets.length).toFixed(1);

  const dashboardConfig = {
    sections: [
      // Header section
      {
        layout: {
          type: "grid" as const,
          columns: 1,
          className: "",
        },
        components: [
          // Show error only when API fails and we have an error message
          ...(apiError ? [{
            name: "Error",
            props: {
              error: "Error loading DG sets",
              message: apiError,
              onRetry: fetchDGSets,
              retryButtonText: "Retry",
              showRetryButton: true,
            },
          }] : []),
          {
            name: "PageHeader",
            props: {
              title: "DG Monitor Dashboard",
              onBackClick: () => window.history.back(),
              backButtonText: "Back to Dashboard",
              buttonsLabel: "Refresh",
              variant: "primary",
              onClick: handleRefresh,
              showMenu: true,
              showDropdown: true,
              menuItems: [
                { id: "export", label: "Export Data" },
                { id: "settings", label: "Settings" },
              ],
              onMenuItemClick: (itemId: string) => {
                console.log(`Menu item clicked: ${itemId}`);
              },
            },
          },
        ],
      },

      // Summary Cards - Updated for smart meter data only
      {
        layout: {
          type: "grid" as const,
          columns: 5,
          gap: "gap-4",
          className: "",
        },
        components: [
          {
            name: "Card",
            props: {
              title: "Running DG Sets",
              value: isLoading ? "..." : dgSets.filter(dg => dg.status === 'running').length.toString(),
              previousValue: isLoading ? "Loading..." : `Out of ${dgSets.length} total DG sets`,
              subtitle1: "Active DG Sets",
              subtitle2: isLoading ? "Loading..." : "Updated just now",
              showTrend: !isLoading,
              comparisonValue: isLoading ? "" : "+2",
              icon: "/icons/dg-active.svg",
              bg: "bg-green-100",
              valueFontSize: "text-2xl",
              onValueClick: () => console.log("View running DG sets"),
            },
          },
          {
            name: "Card",
            props: {
              title: "Total Energy",
              value: isLoading ? "..." : `${dgSets.reduce((sum, dg) => sum + dg.energyToday, 0)} kWh`,
              previousValue: isLoading ? "Loading..." : "Yesterday: 2100 kWh",
              subtitle1: "Generated Today",
              subtitle2: "Cumulative for all sites",
              showTrend: !isLoading,
              comparisonValue: isLoading ? "" : "+100",
              icon: "/icons/bolt.svg",
              bg: "bg-blue-100",
            },
          },
          {
            name: "Card",
            props: {
              title: "Avg Power Factor",
              value: "0.92",
              previousValue: "Best: 0.98 | Lowest: 0.86",
              subtitle1: "Electrical Efficiency",
              subtitle2: "3 sites below limit",
              showTrend: true,
              comparisonValue: "-0.01",
              icon: "/icons/trend-up.svg",
              bg: "bg-purple-100",
            },
          },
          {
            name: "Card",
            props: {
              title: "Active Alerts",
              value: "3",
              previousValue: "Last 24 hrs: 5",
              subtitle1: "Total Warnings",
              subtitle2: "Click to view details",
              icon: "/icons/alert.svg",
              bg: "bg-yellow-100",
            },
          },
          {
            name: "Card",
            props: {
              title: "Average Load",
              value: isLoading ? "..." : `${Math.round(dgSets.reduce((sum, dg) => sum + dg.activePower, 0) / dgSets.length)} kW`,
              previousValue: isLoading ? "Loading..." : `Peak Today: ${Math.max(...dgSets.map(dg => dg.peakLoadToday))} kW`,
              subtitle1: "Active Power",
              subtitle2: "Across running DGs",
              showTrend: !isLoading,
              comparisonValue: isLoading ? "" : "-5",
              icon: "/icons/gauge.svg",
              bg: "bg-teal-100",
            },
          },
        ],
      },
      // DG Sets Container with Header, Search, and Pagination
      {
        layout: {
          type: "grid" as const,
          columns: 1,
          gap: "gap-0",
          className:
            "w-full border border-primary-border dark:border-dark-border bg-white dark:bg-primary-dark font-manrope",
          rows: [
            // Search and Filter Row
            {
              layout: "row" as const,
              gap: "gap-4",
              className:
                "px-4 py-4 border-b border-primary-border dark:border-dark-border",
              columns: [
                {
                  name: "Search",
                  props: {
                    value: searchQuery,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value),
                    placeholder: "Search DG sets by name, location, or ID...",
                    className: "w-full",
                    showShortcut: false,
                    results: [],
                    isLoading: false,
                    disabled: false,
                    required: false,
                    error: null,
                    name: "search",
                  },
                },
              ],
            },
            // DG Sets Grid Row
            {
              layout: "grid" as const,
              gap: "gap-6",
              gridColumns: 3,
              className: "p-4",
              columns: isLoading
                ? [
                    // Show loading skeletons while API is loading
                    ...Array.from({ length: 6 }, (_, index) => ({
                      name: "CardSkeleton",
                      props: {
                        key: `skeleton-${index}`,
                        className: "h-64",
                      },
                    })),
                  ]
                : filteredDGSets.length > 0
                ? filteredDGSets
                    .slice(
                      (currentPage - 1) * cardsPerPage,
                      currentPage * cardsPerPage
                    )
                    .map((dg: any) => ({
                      name: "DGCard",
                      props: {
                        id: dg.id,
                        name: dg.name,
                        plant: dg.location.split(" - ")[0] || "Plant",
                        building: dg.location.split(" - ")[1] || "Building",
                        status: dg.status,
                        // Smart meter data only
                        activePower: dg.activePower,
                        powerFactor: dg.powerFactor,
                        frequency: dg.frequency,
                        voltageUnbalance: dg.voltageUnbalance,
                        energyToday: dg.energyToday,
                        loadFactor: dg.loadFactor,
                        lastUpdate: dg.lastUpdate,
                        alerts: dg.alerts,
                        onViewDetails: () => navigate(`/dg-detail/${dg.id}`),
                      },
                    }))
                : [
                    {
                      name: "Holder",
                      props: {
                        title: "No matching DG sets found",
                        subtitle: searchQuery
                          ? `No DG sets match "${searchQuery}"`
                          : "No DG sets available",
                        className: "col-span-3 text-center py-8",
                      },
                    },
                  ],
            },
          ],
        },
      },
    ],
  };

  return (
    <div className="">
      {/* Use PageC component for the main dashboard layout */}
      <Page sections={dashboardConfig.sections} />

      {/* Manual pagination controls since they're not in the config */}
      {filteredDGSets.length > cardsPerPage && (
        <div className="flex justify-center items-center gap-4 w-full  pt-4  dark:border-dark-border">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-background-secondary hover:bg-background-secondary/80 text-neutral-darker dark:text-surface"
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-dark dark:text-surface font-medium">
              Page {currentPage} of{" "}
              {Math.ceil(filteredDGSets.length / cardsPerPage)}
            </span>
            {Array.from(
              { length: Math.ceil(filteredDGSets.length / cardsPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-background-secondary hover:bg-background-secondary/80 text-neutral-darker dark:text-surface"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  Math.ceil(filteredDGSets.length / cardsPerPage),
                  prev + 1
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredDGSets.length / cardsPerPage)
            }
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === Math.ceil(filteredDGSets.length / cardsPerPage)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-background-secondary hover:bg-background-secondary/80 text-neutral-darker dark:text-surface"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DGDashboard;
