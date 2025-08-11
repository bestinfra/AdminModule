import React from "react";

interface DGCardProps {
  // Basic data props
  id: string;
  name: string;
  plant: string;
  building: string;
  status: "running" | "stopped" | "fault" | string;
  load: number;
  fuel: number;
  runningHoursToday: string;
  runningHoursTotal: string;
  efficiency: string;
  efficiencyTrend: "up" | "down" | "stable" | string;
  lastUpdate: string;
  
  // Customization props
  statusOptions?: {
    running?: { bg: string; text: string; border: string };
    stopped?: { bg: string; text: string; border: string };
    fault?: { bg: string; text: string; border: string };
    [key: string]: { bg: string; text: string; border: string } | undefined;
  };
  loadThresholds?: { warning: number; critical: number };
  fuelThresholds?: { warning: number; critical: number };
  efficiencyTrendOptions?: {
    up?: { icon: string; color: string };
    down?: { icon: string; color: string };
    stable?: { icon: string; color: string };
    [key: string]: { icon: string; color: string } | undefined;
  };
  
  // Icon props
  headerIcon?: React.ReactNode;
  headerIconBgColor?: string;
  locationIcon?: React.ReactNode;
  loadIcon?: React.ReactNode;
  fuelIcon?: React.ReactNode;
  runningHoursIcon?: React.ReactNode;
  viewDetailsIcon?: React.ReactNode;
  
  // Label props
  loadLabel?: string;
  fuelLabel?: string;
  runningHoursLabel?: string;
  efficiencyLabel?: string;
  todayLabel?: string;
  totalLabel?: string;
  lastUpdateLabel?: string;
  viewDetailsLabel?: string;
  
  // Styling props
  cardClassName?: string;
  headerClassName?: string;
  metricsClassName?: string;
  runningHoursClassName?: string;
  efficiencyClassName?: string;
  footerClassName?: string;
  
  // Action props
  onViewDetails: () => void;
  onStatusClick?: () => void;
  onLoadClick?: () => void;
  onFuelClick?: () => void;
  onEfficiencyClick?: () => void;
  
  // Custom render props
  renderCustomHeader?: () => React.ReactNode;
  renderCustomMetrics?: () => React.ReactNode;
  renderCustomFooter?: () => React.ReactNode;
  
  // Progress bar customization
  progressBarBgColor?: string;
  progressBarFillColor?: string;
  progressBarHeight?: string;
  
  // Status indicator customization
  showStatusIndicator?: boolean;
  statusIndicatorColor?: string;
  statusIndicatorSize?: string;
}

const DGCard: React.FC<DGCardProps> = ({
  // Basic data
  id,
  name,
  plant,
  building,
  status,
  load,
  fuel,
  runningHoursToday,
  runningHoursTotal,
  efficiency,
  efficiencyTrend,
  lastUpdate,
  
  // Customization
  statusOptions = {
    running: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    stopped: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    fault: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" }
  },
  loadThresholds = { warning: 50, critical: 80 },
  fuelThresholds = { warning: 50, critical: 30 },
  efficiencyTrendOptions = {
    up: { icon: "↗️", color: "text-green-600" },
    down: { icon: "↘️", color: "text-red-600" },
    stable: { icon: "→", color: "text-gray-600" }
  },
  
  // Icons
  headerIcon,
  headerIconBgColor = "bg-green-500",
  locationIcon,
  loadIcon,
  fuelIcon,
  runningHoursIcon,
  viewDetailsIcon,
  
  // Labels
  loadLabel = "Load",
  fuelLabel = "Fuel",
  runningHoursLabel = "Running Hours",
  efficiencyLabel = "Efficiency",
  todayLabel = "Today:",
  totalLabel = "Total:",
  lastUpdateLabel = "Last update:",
  viewDetailsLabel = "View Details",
  
  // Styling
  cardClassName = "text-main rounded-3xl p-4 shadow-md border border-primary-border",
  headerClassName = "flex items-start justify-between mb-6",
  metricsClassName = "grid grid-cols-2 gap-6 mb-6",
  runningHoursClassName = "flex items-center gap-2 mb-4",
  efficiencyClassName = "flex justify-between items-center mb-6",
  footerClassName = "flex items-center justify-between pt-4 border-t border-dark-border",
  
  // Actions
  onViewDetails,
  onStatusClick,
  onLoadClick,
  onFuelClick,
  onEfficiencyClick,
  
  // Custom render
  renderCustomHeader,
  renderCustomMetrics,
  renderCustomFooter,
  
  // Progress bar
  progressBarBgColor = "bg-gray-700",
  progressBarFillColor = "bg-primary",
  progressBarHeight = "h-3",
  
  // Status indicator
  showStatusIndicator = true,
  statusIndicatorColor = "bg-green-500",
  statusIndicatorSize = "w-2 h-2"
}) => {
  const getStatusColor = (status: string) => {
    const statusConfig = statusOptions[status];
    if (statusConfig) {
      return `${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`;
    }
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getEfficiencyTrendIcon = (trend: string) => {
    return efficiencyTrendOptions[trend]?.icon || "→";
  };

  const getEfficiencyTrendColor = (trend: string) => {
    return efficiencyTrendOptions[trend]?.color || "text-gray-600";
  };

  const getLoadColor = (load: number) => {
    if (load > loadThresholds.critical) return "text-red-600";
    if (load > loadThresholds.warning) return "text-yellow-600";
    return "text-green-600";
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < fuelThresholds.critical) return "text-red-600";
    if (fuel < fuelThresholds.warning) return "text-yellow-600";
    return "text-green-600";
  };

  const defaultHeaderIcon = (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const defaultLocationIcon = (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );

  const defaultLoadIcon = (
    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
        clipRule="evenodd"
      />
    </svg>
  );

  const defaultFuelIcon = (
    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
  );

  const defaultRunningHoursIcon = (
    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );

  const defaultViewDetailsIcon = (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  if (renderCustomHeader) {
    return (
      <div className={cardClassName}>
        {renderCustomHeader()}
        {renderCustomMetrics ? renderCustomMetrics() : (
          <div className={metricsClassName}>
            {/* Load */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {loadIcon || defaultLoadIcon}
                <span className="text-sm text-text-secondary">{loadLabel}</span>
              </div>
              <div className={`text-3xl font-bold ${getLoadColor(load)}`}>
                {load}%
              </div>
              <div className={`w-full ${progressBarBgColor} rounded-full ${progressBarHeight}`}>
                <div
                  className={`${progressBarFillColor} ${progressBarHeight} rounded-full transition-all duration-300`}
                  style={{ width: `${load}%` }}
                ></div>
              </div>
            </div>

            {/* Fuel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {fuelIcon || defaultFuelIcon}
                <span className="text-sm text-text-secondary">{fuelLabel}</span>
              </div>
              <div className={`text-3xl font-bold ${getFuelColor(fuel)}`}>
                {fuel}%
              </div>
              <div className={`w-full ${progressBarBgColor} rounded-full ${progressBarHeight}`}>
                <div
                  className={`${progressBarFillColor} ${progressBarHeight} rounded-full transition-all duration-300`}
                  style={{ width: `${fuel}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Running Hours Section */}
        <div className={runningHoursClassName}>
          {runningHoursIcon || defaultRunningHoursIcon}
          <span className="text-sm text-text-secondary">{runningHoursLabel}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-dark">{todayLabel}</span>
            <span className="text-sm font-medium">{runningHoursToday}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-neutral-dark">{totalLabel}</span>
            <span className="text-sm font-medium">{runningHoursTotal}</span>
          </div>
        </div>

        {/* Efficiency Section */}
        <div className={efficiencyClassName}>
          <span className="text-sm text-text-secondary">{efficiencyLabel}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{efficiency}</span>
            <span
              className={`text-lg ${getEfficiencyTrendColor(efficiencyTrend)}`}
            >
              {getEfficiencyTrendIcon(efficiencyTrend)}
            </span>
          </div>
        </div>

        {renderCustomFooter ? renderCustomFooter() : (
          <div className={footerClassName}>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-dark">
                {lastUpdateLabel} {lastUpdate}
              </span>
              {showStatusIndicator && (
                <div className={`${statusIndicatorSize} ${statusIndicatorColor} rounded-full`}></div>
              )}
            </div>
            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-background-secondary text-neutral-darker rounded-lg text-sm font-medium hover:bg-background-secondary/80 transition-colors duration-200 flex items-center gap-2"
            >
              {viewDetailsLabel}
              {viewDetailsIcon || defaultViewDetailsIcon}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cardClassName}>
      {/* Header Section */}
      <div className={headerClassName}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${headerIconBgColor} rounded-full flex items-center justify-center`}>
            {headerIcon || defaultHeaderIcon}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-normal">{name}</h2>
              <div
                className={`p-1 px-2 rounded-full text-xs font-semibold border cursor-pointer ${getStatusColor(
                  status
                )}`}
                onClick={onStatusClick}
              >
                {status.toUpperCase()}
              </div>
            </div>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              {locationIcon || defaultLocationIcon}
              {plant} - {building}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className={metricsClassName}>
        {/* Load */}
        <div className="space-y-3" onClick={onLoadClick}>
          <div className="flex items-center gap-2">
            {loadIcon || defaultLoadIcon}
            <span className="text-sm text-text-secondary">{loadLabel}</span>
          </div>
          <div className={`text-3xl font-bold ${getLoadColor(load)}`}>
            {load}%
          </div>
          <div className={`w-full ${progressBarBgColor} rounded-full ${progressBarHeight}`}>
            <div
              className={`${progressBarFillColor} ${progressBarHeight} rounded-full transition-all duration-300`}
              style={{ width: `${load}%` }}
            ></div>
          </div>
        </div>

        {/* Fuel */}
        <div className="space-y-3" onClick={onFuelClick}>
          <div className="flex items-center gap-2">
            {fuelIcon || defaultFuelIcon}
            <span className="text-sm text-text-secondary">{fuelLabel}</span>
          </div>
          <div className={`text-3xl font-bold ${getFuelColor(fuel)}`}>
            {fuel}%
          </div>
          <div className={`w-full ${progressBarBgColor} rounded-full ${progressBarHeight}`}>
            <div
              className={`${progressBarFillColor} ${progressBarHeight} rounded-full transition-all duration-300`}
              style={{ width: `${fuel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Running Hours Section */}
      <div className={runningHoursClassName}>
        {runningHoursIcon || defaultRunningHoursIcon}
        <span className="text-sm text-text-secondary">{runningHoursLabel}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-neutral-dark">{todayLabel}</span>
          <span className="text-sm font-medium">{runningHoursToday}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-neutral-dark">{totalLabel}</span>
          <span className="text-sm font-medium">{runningHoursTotal}</span>
        </div>
      </div>

      {/* Efficiency Section */}
      <div className={efficiencyClassName} onClick={onEfficiencyClick}>
        <span className="text-sm text-text-secondary">{efficiencyLabel}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{efficiency}</span>
          <span
            className={`text-lg ${getEfficiencyTrendColor(efficiencyTrend)}`}
          >
            {getEfficiencyTrendIcon(efficiencyTrend)}
          </span>
        </div>
      </div>

      {/* Footer Section */}
      <div className={footerClassName}>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-dark">
            {lastUpdateLabel} {lastUpdate}
          </span>
          {showStatusIndicator && (
            <div className={`${statusIndicatorSize} ${statusIndicatorColor} rounded-full`}></div>
          )}
        </div>
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-background-secondary text-neutral-darker rounded-lg text-sm font-medium hover:bg-background-secondary/80 transition-colors duration-200 flex items-center gap-2"
        >
          {viewDetailsLabel}
          {viewDetailsIcon || defaultViewDetailsIcon}
        </button>
      </div>
    </div>
  );
};

export default DGCard;
