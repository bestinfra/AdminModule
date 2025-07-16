import Table from '@components/global/Table';
import PageHeader from '@components/global/PageHeader';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'feederName', label: 'Feeder Name' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'status', label: 'Status' },
  { key: 'lastFailure', label: 'Last Failure' },
];

const data = [
  { sNo: 1, feederName: 'Feeder-05', dtrName: 'DTR-09', status: 'Power Failure', lastFailure: '2025-07-05 10:00' },
  { sNo: 2, feederName: 'Feeder-06', dtrName: 'DTR-10', status: 'Power Failure', lastFailure: '2025-07-06 12:30' },
];

const DTRPowerFailureFeeders = () => (
  <div className="flex flex-col gap-y-4">
    <PageHeader
      title="Power Failure Feeders"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
    />
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No Power Failure Feeders found" />
  </div>
);

export default DTRPowerFailureFeeders; 