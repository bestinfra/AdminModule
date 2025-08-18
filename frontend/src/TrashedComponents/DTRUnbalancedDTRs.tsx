import Table from '@components/global/Table';
import PageHeader from '@components/global/PageHeader';

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

const DTRUnbalancedDTRs = () => {


  return (
    <div className="flex flex-col gap-y-4">
      <PageHeader
        title="Unbalanced DTRs"
        onBackClick={() => window.history.back()}
        backButtonText="Back to Dashboard"
        buttonsLabel="Export Report"
        variant="primary"
        onClick={() => console.log('Exporting unbalanced DTRs report...')}
        showMenu={true}
        showDropdown={true}
        menuItems={[
          { id: 'all', label: 'All DTRs' },
          { id: 'high-unbalance', label: 'High Unbalance (>15%)' },
          { id: 'medium-unbalance', label: 'Medium Unbalance (10-15%)' },
          { id: 'low-unbalance', label: 'Low Unbalance (<10%)' },
          { id: 'resolved', label: 'Resolved' },
          { id: 'pending', label: 'Pending' }
        ]}
        onMenuItemClick={(itemId) => {
          console.log(`Filter by: ${itemId}`);
          // TODO: Implement filtering logic based on selection
        }}
      />
      <Table columns={columns} data={data} searchable pagination initialRowsPerPage={10} emptyMessage="No Unbalanced DTRs found" />
    </div>
  );
};

export default DTRUnbalancedDTRs; 