
import Table from '../components/global/Table';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'feederName', label: 'Feeder Name' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'load', label: 'Load (kVA)' },
  { key: 'status', label: 'Status' },
];

const data = [
  { sNo: 1, feederName: 'Feeder-01', dtrName: 'DTR-01', load: 25.5, status: 'Overloaded' },
  { sNo: 2, feederName: 'Feeder-02', dtrName: 'DTR-02', load: 27.1, status: 'Overloaded' },
];

const DTROverloadedFeeders = () => (
  <div className="p-6 flex flex-col gap-y-4">
    <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">&larr; Back to Dashboard</button>
    <h2 className="text-2xl font-bold">Overloaded Feeders</h2>
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No Overloaded Feeders found" />
  </div>
);

export default DTROverloadedFeeders; 