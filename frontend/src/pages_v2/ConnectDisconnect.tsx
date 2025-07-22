import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Page from '@components/global/PageC';
import Button from '@components/global/Button';
import Modal from '@components/global/Modal';
import LoadingSpinner from '@components/global/LoadingSpinner';
import meterConnectionAPI, { MeterConnectionAPI } from '@api/meterConnection';
import Button from '@/components/global/Button';
import Modal from '@/components/global/Modal';
import LoadingSpinner from '@/components/global/LoadingSpinner';

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
  { id: '11', meterNo: 'G5678901', uid: 'BI25GMRA011', consumerName: 'Robert Wilson', location: '34, Sunshine Apartments', status: 'connected', communicationStatus: 'communicating', lastReading: 445.67, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 15:20:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '12', meterNo: 'H2345678', uid: 'BI25GMRA012', consumerName: 'Jennifer Lee', location: '67, Green Meadows', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 223.45, lastUpdate: '2024-01-13', lastCommunication: '2024-01-13 12:30:00', phase: 'Three Phase', type: 'postpaid' },
  { id: '13', meterNo: 'I8901234', uid: 'BI25GMRA013', consumerName: 'Michael Chen', location: '89, Riverside Drive', status: 'connected', communicationStatus: 'communicating', lastReading: 789.12, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 17:45:00', phase: 'Single Phase', type: 'prepaid' },
  { id: '14', meterNo: 'J4567890', uid: 'BI25GMRA014', consumerName: 'Amanda Taylor', location: '123, Oak Street', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 156.78, lastUpdate: '2024-01-14', lastCommunication: '2024-01-14 09:15:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '15', meterNo: 'K1234567', uid: 'BI25GMRA015', consumerName: 'Christopher Brown', location: '456, Pine Avenue', status: 'connected', communicationStatus: 'communicating', lastReading: 567.89, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 14:30:00', phase: 'Three Phase', type: 'prepaid' },
  { id: '16', meterNo: 'L7890123', uid: 'BI25GMRA016', consumerName: 'Jessica Garcia', location: '789, Maple Lane', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 334.56, lastUpdate: '2024-01-12', lastCommunication: '2024-01-12 11:20:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '17', meterNo: 'M3456789', uid: 'BI25GMRA017', consumerName: 'Daniel Martinez', location: '321, Cedar Road', status: 'connected', communicationStatus: 'communicating', lastReading: 678.90, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 16:10:00', phase: 'Three Phase', type: 'prepaid' },
  { id: '18', meterNo: 'N9012345', uid: 'BI25GMRA018', consumerName: 'Ashley Rodriguez', location: '654, Birch Street', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 445.67, lastUpdate: '2024-01-11', lastCommunication: '2024-01-11 13:45:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '19', meterNo: 'O5678901', uid: 'BI25GMRA019', consumerName: 'Matthew Thompson', location: '987, Elm Court', status: 'connected', communicationStatus: 'communicating', lastReading: 789.01, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 18:20:00', phase: 'Three Phase', type: 'prepaid' },
  { id: '20', meterNo: 'P2345678', uid: 'BI25GMRA020', consumerName: 'Nicole White', location: '147, Willow Way', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 223.45, lastUpdate: '2024-01-10', lastCommunication: '2024-01-10 10:30:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '21', meterNo: 'Q8901234', uid: 'BI25GMRA021', consumerName: 'Kevin Johnson', location: '258, Spruce Drive', status: 'connected', communicationStatus: 'communicating', lastReading: 456.78, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 19:15:00', phase: 'Three Phase', type: 'prepaid' },
  { id: '22', meterNo: 'R4567890', uid: 'BI25GMRA022', consumerName: 'Stephanie Davis', location: '369, Aspen Lane', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 345.67, lastUpdate: '2024-01-09', lastCommunication: '2024-01-09 14:20:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '23', meterNo: 'S1234567', uid: 'BI25GMRA023', consumerName: 'Ryan Miller', location: '741, Poplar Road', status: 'connected', communicationStatus: 'communicating', lastReading: 567.89, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 20:30:00', phase: 'Three Phase', type: 'prepaid' },
  { id: '24', meterNo: 'T7890123', uid: 'BI25GMRA024', consumerName: 'Lauren Anderson', location: '852, Sycamore Street', status: 'disconnected', communicationStatus: 'non-communicating', lastReading: 234.56, lastUpdate: '2024-01-08', lastCommunication: '2024-01-08 16:45:00', phase: 'Single Phase', type: 'postpaid' },
  { id: '25', meterNo: 'U3456789', uid: 'BI25GMRA025', consumerName: 'Brandon Wilson', location: '963, Magnolia Court', status: 'connected', communicationStatus: 'communicating', lastReading: 678.90, lastUpdate: '2024-01-16', lastCommunication: '2024-01-16 21:10:00', phase: 'Three Phase', type: 'prepaid' },
];

const ConnectDisconnect: React.FC = () => {
  const params = useParams<{ filter?: string }>();
  const navigate = useNavigate();
  const [meters, setMeters] = useState<MeterData[]>(meterData);
  const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"connect" | "disconnect">("connect");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [debugMode] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [selectedMeters, setSelectedMeters] = useState<string[]>([]);
  const [communicationFilter, setCommunicationFilter] = useState<'all' | 'communicating' | 'non-communicating'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('Daily');

  const timeRangeLabels = {
    'Daily': 'All',
    'Monthly': 'Online', 
    'Yearly': 'Offline'
  };

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    console.log('Time range changed to:', range);
  };

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

  const [bulkActionType, setBulkActionType] = useState<"connect" | "disconnect" | null>(null);

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
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("404") || errorMessage.includes("403")) {
        addApiLog("Connectivity test successful - API server is reachable");
      } else if (error instanceof TypeError && errorMessage.includes("fetch")) {
        addApiLog("This looks like a network/CORS issue");
        addApiLog("Possible causes: 1) CORS not enabled 2) API server down 3) Network firewall");
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
    addApiLog(`Starting ${actionType} operation for meter ${selectedMeter.meterNo}`);

    try {
      let response;

      if (actionType === "connect") {
        addApiLog(`Calling connectMeter API for ${selectedMeter.meterNo}`);
        response = await meterConnectionAPI.connectMeter(selectedMeter.meterNo, reason);
      } else {
        addApiLog(`Calling disconnectMeter API for ${selectedMeter.meterNo}`);
        response = await meterConnectionAPI.disconnectMeter(selectedMeter.meterNo, reason);
      }

      setLastApiResponse(response);
      addApiLog(`API call successful! Transaction ID: ${response.transactionId}`);
      console.log("API Response:", response);

      const updatedMeters = meters.map((meter) =>
        meter.id === selectedMeter.id
          ? {
              ...meter,
              status: (actionType === "connect" ? "connected" : "disconnected") as "connected" | "disconnected",
            }
          : meter
      );

      setMeters(updatedMeters);
      setIsModalOpen(false);
      setSelectedMeter(null);
      setReason("");

      alert(`Meter ${selectedMeter.meterNo} ${actionType}ed successfully!\nTransaction ID: ${response.transactionId}\nMessage: ${response.message}`);
    } catch (error) {
      console.error("Error performing action:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
      const parsedStatus = MeterConnectionAPI.parseConnectionStatus(statusResponse.isConnected);

      setLastApiResponse(statusResponse);
      addApiLog(`Status refresh successful for ${meterNo}: ${parsedStatus} (API: ${statusResponse.isConnected})`);

      const updatedMeters = meters.map((meter) =>
        meter.meterNo === meterNo ? { ...meter, status: parsedStatus } : meter
      );

      setMeters(updatedMeters);
    } catch (error) {
      console.error("Error refreshing meter status:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addApiLog(`Status refresh failed for ${meterNo}: ${errorMessage}`);
      setError(`Failed to refresh status for meter ${meterNo}: ${errorMessage}`);
    }
  };

  const refreshAllMeterStatuses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const refreshPromises = meters.map(async (meter) => {
        try {
          const statusResponse = await meterConnectionAPI.getMeterStatus(meter.meterNo);
          const parsedStatus = MeterConnectionAPI.parseConnectionStatus(statusResponse.isConnected);
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
      const selectedMeterData = meters.filter((m) => selectedMeters.includes(m.id));
      const actionPromises = selectedMeterData.map(async (meter) => {
        try {
          if (action === "connect") {
            await meterConnectionAPI.connectMeter(meter.meterNo, "Bulk connect operation");
          } else {
            await meterConnectionAPI.disconnectMeter(meter.meterNo, "Bulk disconnect operation");
          }
          return {
            ...meter,
            status: (action === "connect" ? "connected" : "disconnected") as "connected" | "disconnected",
          };
        } catch (error) {
          console.error(`Error in bulk ${action} for meter ${meter.meterNo}:`, error);
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

  const actions = [
    {
      label: 'View Consumer',
      icon: '/icons/eye.svg',
      onClick: (row: any) => {
        navigate(`/consumers/${row.uid}`);
      },
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

  // Filter meters based on communication status and time range
  const filteredMeters = meters.filter(meter => {
    let communicationMatches = true;
    if (communicationFilter !== 'all') {
      communicationMatches = meter.communicationStatus === communicationFilter;
    }
    
    let timeRangeMatches = true;
    if (selectedTimeRange === 'Monthly') {
      timeRangeMatches = meter.communicationStatus === 'communicating';
    } else if (selectedTimeRange === 'Yearly') {
      timeRangeMatches = meter.communicationStatus === 'non-communicating';
    }
    
    const matches = communicationMatches && timeRangeMatches;
    console.log(`Meter ${meter.consumerName}: communication=${communicationMatches}, timeRange=${timeRangeMatches}, final=${matches}`);
    return matches;
  });

  console.log('Current communication filter:', communicationFilter);
  console.log('Current time range filter:', selectedTimeRange);
  console.log('Total meters:', meters.length);
  console.log('Filtered meters:', filteredMeters.length);
  console.log('Filtered meter names:', filteredMeters.map(m => m.consumerName));

  // Add sNo property to each row for serial number
  const tableData = filteredMeters.map((row, idx) => ({ ...row, sNo: idx + 1 }));

  // Update bulk action type based on selected meters
  React.useEffect(() => {
    if (selectedMeters.length === 0) {
      setBulkActionType(null);
      return;
    }

    const selectedMeterData = filteredMeters.filter((m) => selectedMeters.includes(m.id));
    
    if (selectedMeterData.length === 0) {
      setBulkActionType(null);
      return;
    }

    const allOnline = selectedMeterData.every((m) => m.communicationStatus === "communicating");
    const allOffline = selectedMeterData.every((m) => m.communicationStatus === "non-communicating");

    if (allOffline) {
      setBulkActionType("connect");
    } else if (allOnline) {
      setBulkActionType("disconnect");
    } else {
      setBulkActionType(null);
    }
  }, [selectedMeters, filteredMeters]);

  // Define columns for the meter data
  const columns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'meterNo', label: 'Meter No' },
    { key: 'uid', label: 'UID' },
    { key: 'consumerName', label: 'Consumer Name' },
    { key: 'location', label: 'Location' },
    { 
      key: 'communicationStatus', 
      label: 'Communication',
      render: (value: string | number | boolean | null | undefined) => {
        const isCommunicating = value === 'communicating';
        return (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isCommunicating 
                ? 'bg-secondary animate-pulse' 
                : 'bg-danger'
            }`}></div>
            <span className={`text-sm font-medium ${
              isCommunicating 
                ? 'text-positive' 
                : 'text-danger'
            }`}>
              {isCommunicating ? 'Online' : 'Offline'}
            </span>
          </div>
        );
      }
    },
    { key: 'lastUpdate', label: 'Last Update' },
    { key: 'lastCommunication', label: 'Last Communication' },
    { key: 'type', label: 'Type' },
  ];

  // Prepare overview cards data
  const overviewCards = [
    {
      title: "Total Meters",
      value: meters.length.toString(),
      icon: "/icons/meter-bolt.svg",
      loading: isLoading,
      onValueClick: () => refreshAllMeterStatuses(),
      subtitle1: "Active meters in system"
    },
    {
      title: "Pre Paid",
      value: meters.filter(m => m.communicationStatus === 'communicating').length.toString(),
      icon: "/icons/connect.svg",
      loading: isLoading,
      onValueClick: () => navigate('/connect-disconnect/communicating'),
      subtitle1: `${meters.filter((m) => m.type === "prepaid" && m.status === "connected").length} Connected`,
      subtitle2: `${meters.filter((m) => m.type === "prepaid" && m.status === "disconnected").length} Disconnected`
    },
    {
      title: "Post Paid",
      value: meters.filter(m => m.communicationStatus === 'non-communicating').length.toString(),
      icon: "/icons/disconnect.svg",
      loading: isLoading,
      onValueClick: () => navigate('/connect-disconnect/non-communicating'),
      subtitle1: `${meters.filter((m) => m.type === "postpaid" && m.status === "connected").length} Connected`,
      subtitle2: `${meters.filter((m) => m.type === "postpaid" && m.status === "disconnected").length} Disconnected`
    },
    {
      title: "Auto Triggered Disconnects",
      value: meters.filter(m => m.status === 'connected').length.toString(),
      icon: "/icons/meter-bolt.svg",
      loading: isLoading,
      onValueClick: () => {
        console.log('Showing connection status details');
        console.log("Showing auto disconnect details");
      },
      subtitle1: `${meters.filter(m => m.status === 'connected').length} Connected`,
      subtitle2: `${meters.filter(m => m.status === 'disconnected').length} Disconnected`
    }
  ];

  // Prepare quick actions data
  const quickActionsData = [
    ...(bulkActionType === "connect" ? [{
      title: "Bulk Connect Meters",
      action: () => handleBulkAction("connect"),
      disabled: actionLoading,
      selectedCount: selectedMeters.length,
      variant: "primary" as const
    }] : []),
    ...(bulkActionType === "disconnect" ? [{
      title: "Bulk Disconnect Meters",
      action: () => handleBulkAction("disconnect"),
      disabled: actionLoading,
      selectedCount: selectedMeters.length,
      variant: "danger" as const
    }] : []),
    {
      title: "Refresh All Meters",
      action: refreshAllMeterStatuses,
      disabled: isLoading,
      variant: "primary" as const
    }
  ];

  return (
    <div className="">
      <Page
        sections={[
          // Page Header Section
          {
            layout: {
              type: 'row',
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row',
                  columns: [
                    {
                      name: 'PageHeader',
                      props: {
                        title: "Connect / Disconnect Meters",
                        onBackClick: () => window.history.back(),
                        backButtonText: "Back to Dashboard",
                        buttonsLabel: "Refresh All",
                        variant: "primary",
                        onClick: refreshAllMeterStatuses,
                        showMenu: true,
                        showDropdown: true,
                        menuItems: [
                          { id: "export-csv", label: "Export CSV" },
                          { id: "recent-activity", label: "Recent Activity" },
                        ],
                        onMenuItemClick: (itemId: string) => {
                          console.log(`Filter by: ${itemId}`);
                          if (itemId === "export-csv") {
                            console.log("Export CSV action");
                          } else if (itemId === "recent-activity") {
                            window.location.href = "/tickets-filtered?filter=all";
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          },
          // Error Message Section
          ...(error ? [{
            layout: {
              type: 'row' as const,
              gap: 'gap-4',
              rows: [
                {
                  layout: 'row' as const,
                  columns: [
                    {
                      name: 'div',
                      props: {
                        className: "mb-4 p-4 bg-danger-light text-danger rounded-lg",
                        children: (
                          <div className="flex items-center justify-between">
                            <div>
                              <span>{error}</span>
                            </div>
                            <button
                              onClick={() => setError(null)}
                              className="text-danger hover:text-danger-alt"
                            >
                              ×
                            </button>
                          </div>
                        )
                      }
                    }
                  ]
                }
              ]
            }
          }] : []),
          // Loading Section
          ...(isLoading ? [{
            layout: {
              type: 'row' as const,
              gap: 'gap-4',
              rows: [
                {
                  layout: 'row' as const,
                  columns: [
                    {
                      name: 'div',
                      props: {
                        className: "mb-4 flex items-center justify-center",
                        children: (
                          <>
                            <LoadingSpinner />
                            <span className="ml-2">Refreshing connection statuses...</span>
                          </>
                        )
                      }
                    }
                  ]
                }
              ]
            }
          }] : []),
          // Debug Panel Section
          ...(debugMode ? [{
            layout: {
              type: 'row' as const,
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row' as const,
                  columns: [
                    {
                      name: 'div',
                      props: {
                        className: "mb-6 bg-primary-lightest dark:bg-primary-dark-light rounded-lg p-4",
                        children: (
                          <div>
                            <h3 className="text-lg font-semibold mb-4">🔧 Debug Panel</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">API Logs</h4>
                                <div className="bg-black text-secondary p-3 rounded-md font-mono text-sm h-32 overflow-y-auto">
                                  {apiLogs.length === 0 ? (
                                    <div className="text-neutral">No API calls yet...</div>
                                  ) : (
                                    apiLogs.map((log, index) => (
                                      <div key={index} className="mb-1">{log}</div>
                                    ))
                                  )}
                                </div>
                                <button
                                  onClick={() => setApiLogs([])}
                                  className="mt-2 text-sm text-primary hover:text-primary-dark"
                                >
                                  Clear Logs
                                </button>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Last API Response</h4>
                                <div className="bg-black text-warning p-3 rounded-md font-mono text-sm h-32 overflow-y-auto">
                                  {lastApiResponse ? (
                                    <pre>{JSON.stringify(lastApiResponse, null, 2)}</pre>
                                  ) : (
                                    <div className="text-neutral">No API response yet...</div>
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
                              <div className="mt-4 p-3 bg-warning-alt rounded-md">
                                <h5 className="font-medium text-warning mb-2">🔍 Troubleshooting Tips</h5>
                                <ul className="text-sm text-warning space-y-1">
                                  <li>• If you see "Failed to fetch", it's likely a CORS or network issue</li>
                                  <li>• Check browser console (F12) for detailed error messages</li>
                                  <li>• Ensure API server is running at: https://arcticterntech.in:8443</li>
                                  <li>• Try "Test Connectivity" first to verify basic connection</li>
                                  <li>• Check your network firewall/proxy settings</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    }
                  ]
                }
              ]
            }
          }] : []),
          // Overview Cards Section
          {
            layout: {
              type: 'grid' as const,
              columns: 4,
              gap: 'gap-4',
              rows: [
                {
                  layout: 'grid' as const,
                  gridColumns: 4,
                  gap: 'gap-4',
                  columns: overviewCards.map(card => ({
                    name: 'Card',
                    props: card
                  }))
                }
              ]
            }
          },
          // Quick Actions Section
          ...(selectedMeters.length > 0 ? [{
            layout: {
              type: 'row' as const,
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row' as const,
                  columns: [
                    {
                      name: 'div',
                      props: {
                        className: "mb-8",
                        children: (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-neutral-darker dark:text-white">
                                Quick Actions
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral dark:text-neutral-light">
                                  Last updated:
                                </span>
                                <span className="text-xs font-medium text-neutral dark:text-neutral-light">
                                  {new Date().toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                              {quickActionsData.map((action, index) => (
                                <div key={index} className="bg-white flex flex-col gap-4 dark:bg-primary-dark-light rounded-xl p-4 border border-neutral-light dark:border-dark-border shadow-lg">
                                  <h3 className="text-lg font-semibold text-neutral-darker dark:text-white">
                                    {action.title}
                                  </h3>
                                  <div className="flex flex-col items-center gap-3">
                                    <Button
                                      label={action.title.replace('Bulk ', '').replace(' Meters', ' Selected')}
                                      variant={action.variant}
                                      onClick={action.action}
                                      disabled={action.disabled}
                                      className="w-full max-w-xs"
                                    />
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      action.variant === 'danger' 
                                        ? 'text-danger dark:text-danger bg-danger-light dark:bg-danger-light'
                                        : 'text-accent dark:text-accent bg-accent-light dark:bg-accent-light'
                                    }`}>
                                      {action.selectedCount ? `${action.selectedCount} Selected` : 'Real-time'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    }
                  ]
                }
              ]
            }
          }] : []),
          // Meter Table Section
          {
            layout: {
              type: 'row' as const,
              gap: 'gap-6',
              rows: [
                {
                  layout: 'row' as const,
                  columns: [
                    {
                      name: 'Table',
                      props: {
                        data: tableData,
                        columns: columns,
                        actions: actions,
                        showActions: true,
                        searchable: true,
                        pagination: true,
                        rowsPerPageOptions: [5, 10, 15, 25],
                        initialRowsPerPage: 10,
                        selectable: true,
                        selectedRows: selectedMeters,
                        onSelectionChange: (selectedIds: string[]) => {
                          const currentPageIds = tableData.map(row => row.id);
                          const allCurrentPageSelected = currentPageIds.every(id => selectedIds.includes(id));
                          
                          if (allCurrentPageSelected && selectedIds.length === currentPageIds.length) {
                            const allFilteredIds = filteredMeters.map(meter => meter.id);
                            setSelectedMeters(allFilteredIds);
                          } else {
                            setSelectedMeters(selectedIds);
                          }
                        },
                        emptyMessage: "No meters found",
                        showHeader: true,
                        headerTitle: "Meter Connection Status",
                        dateRange: "Jan 2024 - Dec 2024",
                        selectedTimeRange: selectedTimeRange,
                        onTimeRangeChange: handleTimeRangeChange,
                        timeRangeLabels: timeRangeLabels
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]}
      />

      {/* Modal Component - Outside PageC structure */}
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
        title={`${actionType === "connect" ? "Connect Meter" : "Disconnect Meter"}`}
      >
        <div className="flex flex-col gap-8">
          <div className="">
            <div className="grid grid-cols-2 gap-2 text-sm space-x-4">
              <div>
                <span className="text-neutral dark:text-neutral-light">Meter No:</span>
                <span className="ml-2 font-medium">{selectedMeter?.meterNo}</span>
              </div>
              <div>
                <span className="text-neutral dark:text-neutral-light">Consumer:</span>
                <span className="ml-2 font-medium">{selectedMeter?.consumerName}</span>
              </div>
              <div>
                <span className="text-neutral dark:text-neutral-light">Location:</span>
                <span className="ml-2 font-medium">{selectedMeter?.location}</span>
              </div>
              <div>
                <span className="text-neutral dark:text-neutral-light">Status:</span>
                <span className={`ml-2 font-medium ${
                  selectedMeter?.status === "connected" ? "text-secondary" : "text-danger"
                }`}>
                  {selectedMeter?.status}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-danger-light text-danger rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reason" className="block text-lg font-medium text-neutral dark:text-neutral-light mb-2">
              Reason for {actionType === "connect" ? "Connection" : "Disconnection"}
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Enter reason for ${actionType === "connect" ? "connecting" : "disconnecting"} this meter...`}
              className="w-full px-3 py-2 border border-neutral-light dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:bg-primary-dark-light dark:text-white"
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
              label={actionLoading
                ? `${actionType === "connect" ? "Connecting" : "Disconnecting"}...`
                : `${actionType === "connect" ? "Connect" : "Disconnect"} Meter`
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
