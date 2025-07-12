
import Table from '../components/global/Table';
import PageHeader from '../components/global/PageHeader';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'feederName', label: 'Feeder Name' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'load', label: 'Load (kVA)' },
  { key: 'status', label: 'Status' },
];

const data = [
  { sNo: 1, feederName: 'Feeder-03', dtrName: 'DTR-03', load: 5.2, status: 'Underloaded' },
  { sNo: 2, feederName: 'Feeder-04', dtrName: 'DTR-04', load: 4.8, status: 'Underloaded' },
];

const DTRUnderloadedFeeders = () => (
  <div className="flex flex-col gap-y-4">
    <PageHeader
      title="Underloaded Feeders"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
    />
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No Underloaded Feeders found" />
  </div>
);

export default DTRUnderloadedFeeders; 