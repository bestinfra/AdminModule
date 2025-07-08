
import Table from '../components/global/Table';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'uid', label: 'UID' },
  { key: 'status', label: 'Status' },
  { key: 'unbalancePercent', label: 'Unbalance (%)' },
];

const data = [
  { sNo: 1, dtrName: 'DTR-07', uid: 'UID201', status: 'Unbalanced', unbalancePercent: 12.5 },
  { sNo: 2, dtrName: 'DTR-08', uid: 'UID202', status: 'Unbalanced', unbalancePercent: 15.3 },
];

const DTRUnbalancedDTRs = () => (
  <div className="p-6 flex flex-col gap-y-4">
    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Dashboard</button>
    <h2 className="text-2xl font-bold">Unbalanced DTRs</h2>
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No Unbalanced DTRs found" />
  </div>
);

export default DTRUnbalancedDTRs; 