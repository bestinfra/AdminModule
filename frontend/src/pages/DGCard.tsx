import React from "react";

interface DGCardProps {
  id: string;
  name: string;
  plant: string;
  building: string;
  status: "running" | "stopped" | "fault" | string;
  // Smart meter electrical parameters
  activePower: number; // kW
  powerFactor: number; // 0.0 to 1.0
  frequency: number; // Hz
  voltageUnbalance: number; // %
  energyToday: number; // kWh
  loadFactor: number; // %
  alerts: { count: number; type: "warning" | "critical" | "info" };
  lastUpdate: string;
  onViewDetails: () => void;
}

const DGCard: React.FC<DGCardProps> = ({
  // id,
  name,
  plant,
  building,
  status,
  activePower,
  powerFactor,
  frequency,
  voltageUnbalance,
  energyToday,
  loadFactor,
  alerts,
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

  const getLoadFactorColor = (loadFactor: number) => {
    if (loadFactor >= 80) return "text-red-600";
    if (loadFactor >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const getPowerFactorColor = (powerFactor: number) => {
    if (powerFactor >= 0.95) return "text-green-600";
    if (powerFactor >= 0.85) return "text-yellow-600";
    return "text-red-600";
  };

  const getVoltageUnbalanceColor = (voltageUnbalance: number) => {
    if (voltageUnbalance <= 1.0) return "text-green-600";
    if (voltageUnbalance <= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 text-gray-900">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-gray-900">{name}</h2>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  status
                )}`}
              >
                {status.toUpperCase()}
              </div>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-2">
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

      {/* Key Metrics Section - Two Columns */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Active Power */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-600">Active Power</span>
          </div>
          <div className={`text-3xl font-bold ${getLoadFactorColor(loadFactor)}`}>
            {activePower} kW
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${loadFactor}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">Load Factor: {loadFactor}%</div>
        </div>

        {/* Power Factor */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-sm text-gray-600">Power Factor</span>
          </div>
          <div className={`text-3xl font-bold ${getPowerFactorColor(powerFactor)}`}>
            {powerFactor}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${powerFactor * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">Target: 0.95+</div>
        </div>
      </div>

      {/* Electrical Parameters Section */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm text-gray-600">Electrical Parameters</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Frequency:</span>
          <span className="text-sm font-medium text-gray-900">{frequency} Hz</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">V Unbalance:</span>
          <span className={`text-sm font-medium ${getVoltageUnbalanceColor(voltageUnbalance)}`}>
            {voltageUnbalance}%
          </span>
        </div>
      </div>

      {/* Energy Generation Section */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-gray-600">Energy Generated Today</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-900">{energyToday} kWh</span>
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Active Alerts Section */}
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm text-gray-600">Active Alerts</span>
      </div>
      <div className="mb-6">
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getAlertColor(
            alerts.type
          )}`}
        >
          {alerts.count} {alerts.type === "critical" ? "Critical" : alerts.type === "warning" ? "Warning" : "Info"}
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            Last update: {lastUpdate}
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
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
