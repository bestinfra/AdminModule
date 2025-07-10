
import Table from '../components/global/Table';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'incidentId', label: 'Incident ID' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

const data = [
  { sNo: 1, dtrName: 'DTR-01', incidentId: 'INC001', status: 'Resolved', date: '2025-07-01' },
  { sNo: 2, dtrName: 'DTR-02', incidentId: 'INC002', status: 'Active', date: '2025-07-02' },
];

const DTRTotalFuseBlown = () => (
  <div className="p-6 flex flex-col gap-y-4">
    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Dashboard</button>
    <h2 className="text-2xl font-bold">Total Fuse Blown</h2>
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No Fuse Blown incidents found" />
  </div>
);

export default DTRTotalFuseBlown; 