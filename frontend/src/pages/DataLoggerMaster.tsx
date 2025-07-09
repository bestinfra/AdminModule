import React from 'react';
import Table from '../components/global/Table';
import Button from '../components/global/Button';       

const columns = [
  { key: 'slNo', label: 'Sl No' },
  { key: 'dcuModemSlNo', label: 'DCU / Modem Sl No' },
  { key: 'hardwareVersion', label: 'Hardware Version' },
  { key: 'firmwareVersion', label: 'Firmware Version' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'installationDate', label: 'Installation Date' },
];

const data = [
  {
    slNo: 'NA',
    dcuModemSlNo: 'RFDCU_DCU101',
    hardwareVersion: 'NA',
    firmwareVersion: 'NA',
    mobile: 'NA',
    installationDate: 'NA',
  },
];

const actions = [
  {
    label: 'View',
    icon: '/icons/eye.svg',
    onClick: () => {},
  },
  {
    label: 'Edit',
    icon: '/icons/edit.svg',
    onClick: () => {},
  },
];

const DataLoggerMaster: React.FC = () => {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold">Data Loggers List</div>
        <Button label="Add Data Logger" variant="primary" onClick={() => alert('Add Data Logger')} />
      </div>
      <Table columns={columns} data={data} actions={actions} pagination={true} searchable={true} />
    </div>
  );
};

export default DataLoggerMaster; 