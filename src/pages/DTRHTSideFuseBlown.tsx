
import Table from '../components/global/Table';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'incidentId', label: 'Incident ID' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

const data = [
  { sNo: 1, dtrName: 'DTR-11', incidentId: 'HT001', status: 'Resolved', date: '2025-07-07' },
  { sNo: 2, dtrName: 'DTR-12', incidentId: 'HT002', status: 'Active', date: '2025-07-08' },
];

const DTRHTSideFuseBlown = () => (
  <div className="p-6 flex flex-col gap-y-4">
    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Dashboard</button>
    <h2 className="text-2xl font-bold">HT Side Fuse Blown</h2>
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No HT Side Fuse Blown incidents found" />
  </div>
);

export default DTRHTSideFuseBlown; 