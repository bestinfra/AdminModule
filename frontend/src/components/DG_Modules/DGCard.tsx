import React from "react";

interface DGCardProps {
  id: string;
  name: string;
  plant: string;
  building: string;
  status: "running" | "stopped" | "fault";
  load: number;
  fuel: number;
  runningHoursToday: string;
  runningHoursTotal: string;
  efficiency: string;
  efficiencyTrend: "up" | "down" | "stable";
  lastUpdate: string;
  onViewDetails: () => void;
}

const DGCard: React.FC<DGCardProps> = ({
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
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 border-green-300";
      case "stopped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "fault":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getEfficiencyTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "→";
      default:
        return "→";
    }
  };

  const getEfficiencyTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getLoadColor = (load: number) => {
    if (load > 80) return "text-red-600";
    if (load > 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 30) return "text-red-600";
    if (fuel < 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="text-main rounded-3xl p-4 shadow-md border border-primary-border">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-normal">{name}</h2>
              <div
                className={`p-1 px-2   rounded-full text-xs  font-semibold border ${getStatusColor(
                  status
                )}`}
              >
                {status.toUpperCase()}
              </div>
            </div>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {plant} - {building}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Load */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-text-secondary">Load</span>
          </div>
          <div className={`text-3xl font-bold ${getLoadColor(load)}`}>
            {load}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${load}%` }}
            ></div>
          </div>
        </div>

        {/* Fuel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-sm text-text-secondary">Fuel</span>
          </div>
          <div className={`text-3xl font-bold ${getFuelColor(fuel)}`}>
            {fuel}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${fuel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Running Hours Section */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm text-text-secondary">Running Hours</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-neutral-dark">Today:</span>
          <span className="text-sm font-medium">{runningHoursToday}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-neutral-dark">Total:</span>
          <span className="text-sm font-medium">{runningHoursTotal}</span>
        </div>
      </div>

      {/* Efficiency Section */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-text-secondary">Efficiency</span>
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
      <div className="flex items-center justify-between pt-4 border-t border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-dark">
            Last update: {lastUpdate}
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-background-secondary text-neutral-darker rounded-lg text-sm font-medium hover:bg-background-secondary/80 transition-colors duration-200 flex items-center gap-2"
        >
          View Details
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DGCard;
