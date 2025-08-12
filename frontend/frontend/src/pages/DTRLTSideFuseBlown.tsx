import Table from '@components/global/Table';
import PageHeader from '@components/global/PageHeader';

const columns = [
  { key: 'sNo', label: 'S.No' },
  { key: 'dtrName', label: 'DTR Name' },
  { key: 'incidentId', label: 'Incident ID' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

const data = [
  { sNo: 1, dtrName: 'DTR-05', incidentId: 'LT001', status: 'Resolved', date: '2025-07-03' },
  { sNo: 2, dtrName: 'DTR-06', incidentId: 'LT002', status: 'Active', date: '2025-07-04' },
];

const DTRLTSideFuseBlown = () => (
  <div className="flex flex-col gap-y-4">
    <PageHeader
      title="LT Side Fuse Blown"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Dashboard"
    />
    <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No LT Side Fuse Blown incidents found" />
  </div>
);

export default DTRLTSideFuseBlown; 