import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@components/global/Button';
import Table from '@components/global/Table';
import Modal from '@components/global/Modal';
import LoadingSpinner from '@components/global/LoadingSpinner';
import PageHeader from '@components/global/PageHeader';
import Card from '@components/global/Card';
import meterConnectionAPI, { MeterConnectionAPI } from '../api/meterConnection';
interface MeterData {
  id: string;
  meterNo: string;
  uid: string;
  consumerName: string; 
  location: string;
  status: 'connected' | 'disconnected';
  communicationStatus: 'communicating' | 'non-communicating';
  lastReading: number;
  lastUpdate: string;
  lastCommunication: string;
  phase: string;
  type: "prepaid" | "postpaid";
}

const meterData: MeterData[] = [
  { id: '1', meterNo: 'A9211433', uid: 'BI25GMRA004', consumerName: 'Mobikins', location: 'Tech Park, GMR', status: 'connected', communicationStatus: 'communicating', lastReading: 1271.76, lastUpdate: '2025-07-06', lastCommunication: '2025-07-06 16:12:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '2', meterNo: 'A9345417', uid: 'BI25GMRA002', consumerName: 'Neo Travels', location: 'Airport Road, GMR', status: 'connected', communicationStatus: 'communicating', lastReading: 10157.62, lastUpdate: '2025-07-06', lastCommunication: '2025-07-06 16:47:00', phase: 'Three Phase', type: 'postpaid' },
  { id: '3', meterNo: 'A9345418', uid: 'BI25GMRA003', consumerName: 'Dormitory', location: 'Campus Area, GMR', status: 'connected', communicationStatus: 'communicating', lastReading: 1108.34, lastUpdate: '2025-07-06', lastCommunication: '2025-07-06 12:19:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '4', meterNo: 'A9211434', uid: 'BI25GMRA001', consumerName: 'Airborne General Store', location: 'GHASL, GMR', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 145.17, lastUpdate: '2025-07-05', lastCommunication: '2025-07-05 10:30:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '5', meterNo: 'A9345717', uid: 'BI25GMRA005', consumerName: 'John Smith', location: '1007, Block B, Asian Sun City', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 145.17, lastUpdate: '2024-01-15', lastCommunication: '2024-01-15 14:30:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '6', meterNo: 'B1234567', uid: 'BI25GMRA006', consumerName: 'Sarah Johnson', location: '205, Tower A, Downtown Plaza', status: 'connected', communicationStatus: 'communicating', lastReading: 89.45, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 09:15:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '7', meterNo: 'C7890123', uid: 'BI25GMRA007', consumerName: 'Mike Wilson', location: '15, Green Valley Society', status: 'connected', communicationStatus: 'communicating', lastReading: 234.78, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 11:45:00', phase: 'Three Phase', type: 'prepaid' },
  { id: '8', meterNo: 'D4567890', uid: 'BI25GMRA008', consumerName: 'Emily Davis', location: '78, Lake View Apartments', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 67.23, lastUpdate: '2024-01-14', lastCommunication: '2024-01-14 16:20:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '9', meterNo: 'E2345678', uid: 'BI25GMRA009', consumerName: 'David Brown', location: '45, Riverside Colony', status: 'connected', communicationStatus: 'communicating', lastReading: 156.89, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 13:30:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '10', meterNo: 'F8901234', uid: 'BI25GMRA010', consumerName: 'Lisa Anderson', location: '12, Hill Top Residency', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 98.34, lastUpdate: '2024-01-13', lastCommunication: '2024-01-13 08:45:00', phase: 'Three Phase', type: 'postpaid' },
  
];



const ConnectDisconnect: React.FC = () => {
  const params = useParams<{ filter?: string }>();
  const navigate = useNavigate();
  const [meters, setMeters] = useState<MeterData[]>(meterData);
  const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"connect" | "disconnect">(
    "connect"
  );
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [debugMode] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [communicationFilter, setCommunicationFilter] = useState<'all' | 'communicating' | 'non-communicating'>('all');

  // Handle route parameters for initial filtering
  useEffect(() => {
    const filterParam = params.filter;
    console.log('Route filter parameter:', filterParam);
    
    if (filterParam === 'communicating' || filterParam === 'non-communicating') {
      console.log('Setting filter to:', filterParam);
      setCommunicationFilter(filterParam);
    } else {
      console.log('No filter or invalid filter, setting to all');
      setCommunicationFilter('all');
    }
  }, [params.filter]);


  const [bulkActionType, setBulkActionType] = useState<
    "connect" | "disconnect" | null
  >(null);

  const addApiLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs((prev) => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  const testApiConnectivity = async () => {
    setIsLoading(true);
    try {
      const testMeter = "TEST_CONNECTIVITY";
      await meterConnectionAPI.getMeterStatus(testMeter);

      addApiLog("API connectivity test successful!");
    } catch (error) {
      console.error("API connectivity test failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Check if it's a 404/403 error (meter not found) vs network error
      if (errorMessage.includes("404") || errorMessage.includes("403")) {
        addApiLog("Connectivity test successful - API server is reachable");
      } else if (error instanceof TypeError && errorMessage.includes("fetch")) {
        addApiLog("This looks like a network/CORS issue");
        addApiLog(
          "Possible causes: 1) CORS not enabled 2) API server down 3) Network firewall"
        );
      } else {
        addApiLog(`Connectivity test failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (meter: MeterData) => {
    setSelectedMeter(meter);
    setActionType("connect");
    setIsModalOpen(true);
  };

  const handleDisconnect = (meter: MeterData) => {
    setSelectedMeter(meter);
    setActionType("disconnect");
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedMeter || !reason.trim()) {
      setError("Please provide a reason for this action");
      return;
    }

    setActionLoading(true);
    setError(null);
    addApiLog(
      `Starting ${actionType} operation for meter ${selectedMeter.meterNo}`
    );

    try {
      let response;

      if (actionType === "connect") {
        addApiLog(`Calling connectMeter API for ${selectedMeter.meterNo}`);
        response = await meterConnectionAPI.connectMeter(
          selectedMeter.meterNo,
          reason
        );
      } else {
        addApiLog(`Calling disconnectMeter API for ${selectedMeter.meterNo}`);
        response = await meterConnectionAPI.disconnectMeter(
          selectedMeter.meterNo,
          reason
        );
      }

      setLastApiResponse(response);
      addApiLog(
        `API call successful! Transaction ID: ${response.transactionId}`
      );
      console.log("API Response:", response);

      // Update the meter status in the local state
      const updatedMeters = meters.map((meter) =>
        meter.id === selectedMeter.id
          ? {
              ...meter,
              status: (actionType === "connect"
                ? "connected"
                : "disconnected") as "connected" | "disconnected",
            }
          : meter
      );

      setMeters(updatedMeters);
      setIsModalOpen(false);
      setSelectedMeter(null);
      setReason("");

      // Show success message
      alert(
        `Meter ${selectedMeter.meterNo} ${actionType}ed successfully!\nTransaction ID: ${response.transactionId}\nMessage: ${response.message}`
      );
    } catch (error) {
      console.error("Error performing action:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addApiLog(`API call failed: ${errorMessage}`);
      setError(`Failed to ${actionType} meter: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  const refreshMeterStatus = async (meterNo: string) => {
    addApiLog(`Refreshing status for meter ${meterNo}`);
    try {
      const statusResponse = await meterConnectionAPI.getMeterStatus(meterNo);
      const parsedStatus = MeterConnectionAPI.parseConnectionStatus(
        statusResponse.isConnected
      );

      setLastApiResponse(statusResponse);
      addApiLog(
        `Status refresh successful for ${meterNo}: ${parsedStatus} (API: ${statusResponse.isConnected})`
      );

      // Update the meter status in the local state
      const updatedMeters = meters.map((meter) =>
        meter.meterNo === meterNo ? { ...meter, status: parsedStatus } : meter
      );

      setMeters(updatedMeters);
    } catch (error) {
      console.error("Error refreshing meter status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      addApiLog(`Status refresh failed for ${meterNo}: ${errorMessage}`);
      setError(
        `Failed to refresh status for meter ${meterNo}: ${errorMessage}`
      );
    }
  };

  const refreshAllMeterStatuses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const refreshPromises = meters.map(async (meter) => {
        try {
          const statusResponse = await meterConnectionAPI.getMeterStatus(
            meter.meterNo
          );
          const parsedStatus = MeterConnectionAPI.parseConnectionStatus(
            statusResponse.isConnected
          );
          return { ...meter, status: parsedStatus };
        } catch (error) {
          console.error(`Error refreshing meter ${meter.meterNo}:`, error);
          return { ...meter, status: "disconnected" as const };
        }
      });

      const updatedMeters = await Promise.all(refreshPromises);
      setMeters(updatedMeters);
    } catch (error) {
      console.error("Error refreshing all meter statuses:", error);
      setError("Failed to refresh meter statuses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: "connect" | "disconnect") => {
    if (selectedMeters.length === 0) return;

    setActionLoading(true);
    setError(null);

    try {
      const selectedMeterData = meters.filter((m) =>
        selectedMeters.includes(m.id)
      );
      const actionPromises = selectedMeterData.map(async (meter) => {
        try {
          if (action === "connect") {
            await meterConnectionAPI.connectMeter(
              meter.meterNo,
              "Bulk connect operation"
            );
          } else {
            await meterConnectionAPI.disconnectMeter(
              meter.meterNo,
              "Bulk disconnect operation"
            );
          }
          return {
            ...meter,
            status: (action === "connect" ? "connected" : "disconnected") as
              | "connected"
              | "disconnected",
          };
        } catch (error) {
          console.error(
            `Error in bulk ${action} for meter ${meter.meterNo}:`,
            error
          );
          return meter;
        }
      });

      const updatedMeters = await Promise.all(actionPromises);
      setMeters((prev) =>
        prev.map((meter) => {
          const updated = updatedMeters.find((um) => um.id === meter.id);
          return updated || meter;
        })
      );

      setSelectedMeters([]);
      setBulkActionType(null);
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
      setError(`Failed to ${action} selected meters`);
    } finally {
      setActionLoading(false);
    }
  };

  // Reset selection state when component mounts or when navigating back
  React.useEffect(() => {
    setSelectedMeters([]);
    setBulkActionType(null);
  }, []);

  // Update bulk action type based on selected meters
  React.useEffect(() => {
    if (selectedMeters.length === 0) {
      setBulkActionType(null);
      return;
    }

    const selectedMeterData = meters.filter((m) =>
      selectedMeters.includes(m.id)
    );
    const allDisconnected = selectedMeterData.every(
      (m) => m.status === "disconnected"
    );
    const allConnected = selectedMeterData.every(
      (m) => m.status === "connected"
    );

    if (allDisconnected) {
      setBulkActionType("connect");
    } else if (allConnected) {
      setBulkActionType("disconnect");
    } else {
      setBulkActionType(null);
    }
  }, [selectedMeters, meters]);

  const actions = [
    {
      label: 'View Consumer',
      icon: '/icons/eye.svg',
      onClick: (row: any) => {
        navigate(`/consumers/${row.uid}`);
      },
    },
    {
      label: "Refresh Status",
      icon: "/icons/refresh.svg",
      onClick: (row: any) => refreshMeterStatus(row.meterNo),
    },
    {
      label: "Connect",
      icon: "/icons/connect.svg",
      onClick: (row: any) => handleConnect(row as MeterData),
      condition: (row: any) => row.status === "disconnected",
    },
    {
      label: "Disconnect",
      icon: "/icons/disconnect.svg",
      onClick: (row: any) => handleDisconnect(row as MeterData),
      condition: (row: any) => row.status === "connected",
    },
  ];

  // Filter meters based on communication status
  const filteredMeters = meters.filter(meter => {
    console.log(`Checking meter ${meter.consumerName}: status=${meter.communicationStatus}, filter=${communicationFilter}`);
    if (communicationFilter === 'all') return true;
    const matches = meter.communicationStatus === communicationFilter;
    console.log(`Meter ${meter.consumerName} matches filter: ${matches}`);
    return matches;
  });

  console.log('Current filter:', communicationFilter);
  console.log('Total meters:', meters.length);
  console.log('Filtered meters:', filteredMeters.length);
  console.log('Filtered meter names:', filteredMeters.map(m => m.consumerName));

  // Add sNo property to each row for serial number
  const tableData = filteredMeters.map((row, idx) => ({ ...row, sNo: idx + 1 }));

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Connect / Disconnect Meters"
          onBackClick={() => window.history.back()}
          backButtonText="Back to Dashboard"
          buttonsLabel="Refresh All"
          variant="primary"
          onClick={refreshAllMeterStatuses}
          showMenu={true}
          showDropdown={true}
          menuItems={[
            { id: "export-csv", label: "Export CSV" },
            { id: "recent-activity", label: "Recent Activity" },
          ]}
          onMenuItemClick={(itemId) => {
            console.log(`Filter by: ${itemId}`);
            if (itemId === "export-csv") {
              console.log("Export CSV action");
            } else if (itemId === "recent-activity") {
              // Navigate to TicketsFilteredView page to show history
              window.location.href = "/tickets-filtered?filter=all";
            }
            // TODO: Implement filtering logic based on selection
          }}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Refreshing connection statuses...</span>
        </div>
      )}

      {debugMode && (
        <div className="mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">🔧 Debug Panel</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">API Logs</h4>
              <div className="bg-black text-green-400 p-3 rounded-md font-mono text-sm h-32 overflow-y-auto">
                {apiLogs.length === 0 ? (
                  <div className="text-gray-500">No API calls yet...</div>
                ) : (
                  apiLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setApiLogs([])}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Logs
              </button>
            </div>

            <div>
              <h4 className="font-medium mb-2">Last API Response</h4>
              <div className="bg-black text-yellow-400 p-3 rounded-md font-mono text-sm h-32 overflow-y-auto">
                {lastApiResponse ? (
                  <pre>{JSON.stringify(lastApiResponse, null, 2)}</pre>
                ) : (
                  <div className="text-gray-500">No API response yet...</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-3">API Tests</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <Button
                label="Test Connectivity"
                variant="outline"
                onClick={testApiConnectivity}
                disabled={isLoading}
              />
              <Button
                label="Test Get Status"
                variant="outline"
                onClick={() => refreshMeterStatus("A9345717")}
                disabled={isLoading}
              />
              <Button
                label="Test Connect"
                variant="success"
                onClick={() => {
                  const meter = meters.find((m) => m.meterNo === "A9345717");
                  if (meter) {
                    setSelectedMeter(meter);
                    setActionType("connect");
                    setReason("Debug test connection");
                    setIsModalOpen(true);
                  }
                }}
                disabled={isLoading}
              />
              <Button
                label="Test Disconnect"
                variant="danger"
                onClick={() => {
                  const meter = meters.find((m) => m.meterNo === "A9345717");
                  if (meter) {
                    setSelectedMeter(meter);
                    setActionType("disconnect");
                    setReason("Debug test disconnection");
                    setIsModalOpen(true);
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                🔍 Troubleshooting Tips
              </h5>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>
                  • If you see "Failed to fetch", it's likely a CORS or network
                  issue
                </li>
                <li>
                  • Check browser console (F12) for detailed error messages
                </li>
                <li>
                  • Ensure API server is running at:
                  https://arcticterntech.in:8443
                </li>
                <li>
                  • Try "Test Connectivity" first to verify basic connection
                </li>
                <li>• Check your network firewall/proxy settings</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Overview Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card
            title="Total Meters"
            value={meters.length}
            icon="/icons/meter-bolt.svg"
            loading={isLoading}
            onValueClick={() => refreshAllMeterStatuses()}
            subtitle1="Active meters in system"
          />

          <Card
            title="Communicating"
            value={meters.filter(m => m.communicationStatus === 'communicating').length}
            icon="/icons/connect.svg"
            loading={isLoading}
            onValueClick={() => navigate('/connect-disconnect/communicating')}
            
            subtitle1={`${
              meters.filter(
                (m) => m.type === "prepaid" && m.status === "connected"
              ).length
            } Connected`}
            subtitle2={`${
              meters.filter(
                (m) => m.type === "prepaid" && m.status === "disconnected"
              ).length
            } Disconnected`}
          />

          <Card
            title="Non-Communicating"
            value={meters.filter(m => m.communicationStatus === 'non-communicating').length}
            icon="/icons/disconnect.svg"
            loading={isLoading}
            onValueClick={() => navigate('/connect-disconnect/non-communicating')}
            
            subtitle1={`${
              meters.filter(
                (m) => m.type === "postpaid" && m.status === "connected"
              ).length
            } Connected`}
            subtitle2={`${
              meters.filter(
                (m) => m.type === "postpaid" && m.status === "disconnected"
              ).length
            } Disconnected`}
          />

          <Card
            title="Connection Status"
            value={`${meters.filter(m => m.status === 'connected').length}/${meters.length}`}
            icon="/icons/meter-bolt.svg"
            loading={isLoading}
            onValueClick={() => {
              console.log('Showing connection status details');
              console.log("Showing auto disconnect details");
            }}
            subtitle1={`${meters.filter(m => m.status === 'connected').length} Connected`}
            subtitle2={`${meters.filter(m => m.status === 'disconnected').length} Disconnected`}
          />
        </div>
      </div>

      {/* Quick Actions Section - Only show when meters are selected */}
      {selectedMeters.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last updated:
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {bulkActionType === "connect" && (
              <div className="bg-white flex flex-col gap-4 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bulk Connect Meters
                </h3>
                <div className="flex items-center justify-between">
                  <Button
                    label="Connect Selected"
                    variant="primary"
                    onClick={() => handleBulkAction("connect")}
                    disabled={actionLoading}
                  />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                    {selectedMeters.length} Selected
                  </span>
                </div>
              </div>
            )}
            {bulkActionType === "disconnect" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg ">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <Button
                      label="Disconnect Selected"
                      variant="danger"
                      onClick={() => handleBulkAction("disconnect")}
                      disabled={actionLoading}
                    />
                  </div>
                  <span className="text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-full">
                    {selectedMeters.length} Selected
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                  Real-time
                </span>
              </div>
              <Button
                label="Refresh All"
                variant="primary"
                onClick={refreshAllMeterStatuses}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
      {/* Meter Table */}
      <div className="mb-8">
       
        <Table
        data={tableData}
        actions={actions}
        showActions
        searchable
        pagination
        selectable={true}
        selectedRows={selectedMeters}
        onSelectionChange={setSelectedMeters}
        emptyMessage="No meters found"
        showHeader={true}
        headerTitle="Meter Connection Status"
        dateRange="Jan 2024 - Dec 2024"
      />
        <div className="mb-6"></div>
      
      </div>
      <Modal
        size="lg"
        isOpen={isModalOpen}
        onClose={() => {
          if (!actionLoading) {
            setIsModalOpen(false);
            setError(null);
            setReason("");
          }
        }}
        title={`${
          actionType === "connect" ? "Connect Meter" : "Disconnect Meter"
        }`}

      >
        <div className="flex flex-col gap-8">
          <div className="">
          
            <div className="grid grid-cols-2 gap-2 text-sm space-x-4">
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Meter No:
                </span>
                <span className="ml-2 font-medium">
                  {selectedMeter?.meterNo}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Consumer:
                </span>
                <span className="ml-2 font-medium">
                  {selectedMeter?.consumerName}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Location:
                </span>
                <span className="ml-2 font-medium">
                  {selectedMeter?.location}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`ml-2 font-medium ${
                    selectedMeter?.status === "connected"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedMeter?.status}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="reason"
              className="block text-lg font-medium text-grey dark:text-gray-300 mb-2"
            >
              Reason for{" "}
              {actionType === "connect" ? "Connection" : "Disconnection"} 
            </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Enter reason for ${
                  actionType === "connect" ? "connecting" : "disconnecting"
                } this meter...`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                rows={3}
                disabled={actionLoading}
                required
              />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setError(null);
                setReason("");
              }}
              disabled={actionLoading}
            />
            <Button
              label={
                actionLoading
                  ? `${
                      actionType === "connect" ? "Connecting" : "Disconnecting"
                    }...`
                  : `${
                      actionType === "connect" ? "Connect" : "Disconnect"
                    } Meter`
              }
              variant={actionType === "connect" ? "primary" : "danger"}
              onClick={confirmAction}
              disabled={actionLoading || !reason.trim()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConnectDisconnect;
