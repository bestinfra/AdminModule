import Table from '@components/global/Table';
import PageHeader from '@components/global/PageHeader';

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
  <div className="flex flex-col gap-y-4">
    <PageHeader
      title="Total LT Feeders"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
    />
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No LT Feeders found" />
  </div>
);

export default DTRTotalLTFeeders; 