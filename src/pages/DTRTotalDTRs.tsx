
import Table from '../components/global/Table';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'unitName', label: 'Unit Name' },
  { key: 'uid', label: 'UID' },
  { key: 'status', label: 'Status' },
  { key: 'location', label: 'Location' },
];

const data = [
  { sNo: 1, unitName: 'DTR-01', uid: 'UID001', status: 'Active', location: 'Hyderabad' },
  { sNo: 2, unitName: 'DTR-02', uid: 'UID002', status: 'Inactive', location: 'Warangal' },
];

const DTRTotalDTRs = () => (
  <div className="p-6 flex flex-col gap-y-4">
    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Dashboard</button>
    <h2 className="text-2xl font-bold">Total DTRs</h2>
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No DTRs found" />
  </div>
);

export default DTRTotalDTRs; 