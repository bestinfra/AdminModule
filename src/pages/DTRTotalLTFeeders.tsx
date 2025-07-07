import React from 'react';
import Table from '../components/global/Table';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'feederName', label: 'Feeder Name' },
  { key: 'uid', label: 'UID' },
  { key: 'status', label: 'Status' },
  { key: 'location', label: 'Location' },
];

const data = [
  { sNo: 1, feederName: 'LT Feeder-01', uid: 'UID101', status: 'Active', location: 'Hyderabad' },
  { sNo: 2, feederName: 'LT Feeder-02', uid: 'UID102', status: 'Inactive', location: 'Warangal' },
];

const DTRTotalLTFeeders = () => (
  <div className="p-6 flex flex-col gap-y-4">
    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Dashboard</button>
    <h2 className="text-2xl font-bold">Total LT Feeders</h2>
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No LT Feeders found" />
  </div>
);

export default DTRTotalLTFeeders; 