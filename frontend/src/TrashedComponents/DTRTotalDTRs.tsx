import Table from '@components/global/Table';
import PageHeader from '@components/global/PageHeader';

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
  <div className="flex flex-col gap-y-4">
    <PageHeader
      title="Total DTRs"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
    />
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No DTRs found" />
  </div>
);

export default DTRTotalDTRs; 