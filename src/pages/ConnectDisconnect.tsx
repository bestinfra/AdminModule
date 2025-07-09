import React, { useState } from 'react';
import Button from '../components/global/Button';
import type { Column } from '../components/global/Table';
import Table from '../components/global/Table';
import Modal from '../components/global/Modal';
import LoadingSpinner from '../components/global/LoadingSpinner';
import meterConnectionAPI, { MeterConnectionAPI } from '../api/meterConnection';

interface MeterData {
  id: string;
  meterNo: string;
  consumerName: string;
  location: string;
  status: 'connected' | 'disconnected';
  lastReading: number;
  lastUpdate: string;
  phase: string;
  type: 'prepaid' | 'postpaid';
}

const meterData: MeterData[] = [
  { id: '1', meterNo: 'A9345717', consumerName: 'Testing', location: '1007, Block B, Asian Sun City', status: 'disconnected', lastReading: 145.17, lastUpdate: '2024-01-15', phase: 'Single Phase', type: 'prepaid' },
];

const columns: Column[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'meterNo', label: 'Meter No' },
  { key: 'consumerName', label: 'Consumer Name' },
  { key: 'location', label: 'Location' },
  { 
    key: 'status', 
    label: 'Connection Status',
    render: (value, row) => (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          value === 'connected'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            value === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        {value === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
      </span>
    )
  },
  { key: 'lastUpdate', label: 'Last Status Update' },
  { 
    key: 'type', 
    label: 'Meter Type',
    render: (value) => (
      <span className="capitalize font-medium text-gray-600 dark:text-gray-300">
        {value}
      </span>
    )
  },
];

const ConnectDisconnect: React.FC = () => {
  const [meters, setMeters] = useState<MeterData[]>(meterData);
  const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'connect' | 'disconnect'>('connect');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);


  const addApiLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
  };

  const testApiConnectivity = async () => {
    setIsLoading(true);    
    try {      
      const testMeter = 'TEST_CONNECTIVITY';
      await meterConnectionAPI.getMeterStatus(testMeter);
      
      addApiLog('API connectivity test successful!');
      
    } catch (error) {
      console.error('API connectivity test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's a 404/403 error (meter not found) vs network error
      if (errorMessage.includes('404') || errorMessage.includes('403')) {
        addApiLog('Connectivity test successful - API server is reachable');
              } else if (error instanceof TypeError && errorMessage.includes('fetch')) {
          addApiLog('This looks like a network/CORS issue');
          addApiLog('Possible causes: 1) CORS not enabled 2) API server down 3) Network firewall');
        } else {
        addApiLog(`Connectivity test failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (meter: MeterData) => {
    setSelectedMeter(meter);
    setActionType('connect');
    setIsModalOpen(true);
  };

  const handleDisconnect = (meter: MeterData) => {
    setSelectedMeter(meter);
    setActionType('disconnect');
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedMeter || !reason.trim()) {
      setError('Please provide a reason for this action');
      return;
    }

    setActionLoading(true);
    setError(null);
    addApiLog(`Starting ${actionType} operation for meter ${selectedMeter.meterNo}`);

    try {
      let response;
      
      if (actionType === 'connect') {
        addApiLog(`Calling connectMeter API for ${selectedMeter.meterNo}`);
        response = await meterConnectionAPI.connectMeter(selectedMeter.meterNo, reason);
      } else {
        addApiLog(`Calling disconnectMeter API for ${selectedMeter.meterNo}`);
        response = await meterConnectionAPI.disconnectMeter(selectedMeter.meterNo, reason);
      }

      setLastApiResponse(response);
      addApiLog(`API call successful! Transaction ID: ${response.transactionId}`);
      console.log('API Response:', response);

      // Update the meter status in the local state
      const updatedMeters = meters.map(meter =>
        meter.id === selectedMeter.id
          ? { ...meter, status: (actionType === 'connect' ? 'connected' : 'disconnected') as 'connected' | 'disconnected' }
          : meter
      );

      setMeters(updatedMeters);
      setIsModalOpen(false);
      setSelectedMeter(null);
      setReason('');
      
      // Show success message
      alert(`Meter ${selectedMeter.meterNo} ${actionType}ed successfully!\nTransaction ID: ${response.transactionId}\nMessage: ${response.message}`);
      
    } catch (error) {
      console.error('Error performing action:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
      
      // Update the meter status in the local state
      const updatedMeters = meters.map(meter =>
        meter.meterNo === meterNo
          ? { ...meter, status: parsedStatus }
          : meter
      );
      
      setMeters(updatedMeters);
      
    } catch (error) {
      console.error('Error refreshing meter status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
          return { ...meter, status: 'disconnected' as const };
        }
      });
      
      const updatedMeters = await Promise.all(refreshPromises);
      setMeters(updatedMeters);
      
    } catch (error) {
      console.error('Error refreshing all meter statuses:', error);
      setError('Failed to refresh meter statuses');
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    {
      label: 'Refresh Status',
      icon: '/icons/refresh.svg',
      onClick: (row: any) => refreshMeterStatus(row.meterNo),
    },
    {
      label: 'Connect',
      icon: '/icons/connect.svg',
      onClick: (row: any) => handleConnect(row as MeterData),
      condition: (row: any) => row.status === 'disconnected',
    },
    {
      label: 'Disconnect',
      icon: '/icons/disconnect.svg',
      onClick: (row: any) => handleDisconnect(row as MeterData),
      condition: (row: any) => row.status === 'connected',
    },
  ];

  // Add sNo property to each row for serial number
  const tableData = meters.map((row, idx) => ({ ...row, sNo: idx + 1 }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Connect / Disconnect Meters</h1>
        <div className="flex items-center gap-3">
          <Button
            label={debugMode ? "Hide Debug" : "Show Debug"}
            variant="outline"
            onClick={() => setDebugMode(!debugMode)}
          />
          <Button
            label="Refresh Status"
            variant="secondary"
            onClick={refreshAllMeterStatuses}
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100">
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
                    <div key={index} className="mb-1">{log}</div>
                  ))
                )}
              </div>
              <button
                onClick={() => setApiLogs([])}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800">
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
                 onClick={() => refreshMeterStatus('A9345717')}
                 disabled={isLoading}
               />
               <Button
                 label="Test Connect"
                 variant="success"
                 onClick={() => {
                   const meter = meters.find(m => m.meterNo === 'A9345717');
                   if (meter) {
                     setSelectedMeter(meter);
                     setActionType('connect');
                     setReason('Debug test connection');
                     setIsModalOpen(true);
                   }
                 }}
                 disabled={isLoading}
               />
               <Button
                 label="Test Disconnect"
                 variant="danger"
                 onClick={() => {
                   const meter = meters.find(m => m.meterNo === 'A9345717');
                   if (meter) {
                     setSelectedMeter(meter);
                     setActionType('disconnect');
                     setReason('Debug test disconnection');
                     setIsModalOpen(true);
                   }
                 }}
                 disabled={isLoading}
               />

             </div>
            
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">🔍 Troubleshooting Tips</h5>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• If you see "Failed to fetch", it's likely a CORS or network issue</li>
                <li>• Check browser console (F12) for detailed error messages</li>
                <li>• Ensure API server is running at: https://arcticterntech.in:8443</li>
                <li>• Try "Test Connectivity" first to verify basic connection</li>
                <li>• Check your network firewall/proxy settings</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available for Control</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{meters.length}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <img src="/icons/meter-bolt.svg" alt="" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected Meters</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {meters.filter(m => m.status === 'connected').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <img src="/icons/connect.svg" alt="" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disconnected Meters</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {meters.filter(m => m.status === 'disconnected').length}
              </p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <img src="/icons/disconnect.svg" alt="" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <Table
        data={tableData}
        columns={columns}
        actions={actions}
        showActions
        searchable
        pagination
        emptyMessage="No meters found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!actionLoading) {
            setIsModalOpen(false);
            setError(null);
            setReason('');
          }
        }}
        title={`${actionType === 'connect' ? 'Connect Meter' : 'Disconnect Meter'}`}>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              {actionType === 'connect' ? 'Connecting Meter' : 'Disconnecting Meter'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Meter No:</span>
                <span className="ml-2 font-medium">{selectedMeter?.meterNo}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Consumer:</span>
                <span className="ml-2 font-medium">{selectedMeter?.consumerName}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                <span className="ml-2 font-medium">{selectedMeter?.location}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Current Status:</span>
                <span className={`ml-2 font-medium ${
                  selectedMeter?.status === 'connected' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
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
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for {actionType === 'connect' ? 'Connection' : 'Disconnection'} *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Enter reason for ${actionType === 'connect' ? 'connecting' : 'disconnecting'} this meter...`}
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
                setReason('');
              }}
              disabled={actionLoading}
            />
            <Button
              label={
                actionLoading 
                  ? `${actionType === 'connect' ? 'Connecting' : 'Disconnecting'}...` 
                  : `${actionType === 'connect' ? 'Connect' : 'Disconnect'} Meter`
              }
              variant={actionType === 'connect' ? 'primary' : 'danger'}
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