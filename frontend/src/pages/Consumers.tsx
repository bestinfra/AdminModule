import React, { useState } from 'react';
import Button from '../components/global/Button';
import type { Column } from '../components/global/Table';
import Table from '../components/global/Table';
import Dropdown from '../components/global/Dropdown';

const consumersData = [
  { uid: 'BI25GMRA001', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
  { uid: 'BI25GMRA002', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
  { uid: 'BI25GMRA003', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
  { uid: 'BI25GMRA004', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
  { uid: 'BI25GMRA005', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
//   { uid: 'BI25GMRA006', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
//   { uid: 'BI25GMRA007', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
//   { uid: 'BI25GMRA008', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
//   { uid: 'BI25GMRA009', name: 'Airborne General Store', meter: 'A9211434', reading: 145.17 },
//   { uid: 'BI25GMRA0010', name: 'Neo Travels', meter: 'A9345417', reading: 10157.62 },
//   { uid: 'BI25GMRA0011', name: 'Dormitory', meter: 'A9345418', reading: 1108.34 },
//   { uid: 'BI25GMRA0012', name: 'Mobikins', meter: 'A9211433', reading: 1271.76 },
];

const columns: Column[] = [
  { key: 'sNo', label: 'S.No' },
  { key: 'uid', label: 'UID' },
  { key: 'name', label: 'Consumer Name' },
  { key: 'meter', label: 'Meter SI No' },
  { key: 'reading', label: 'Current Reading' },
];

const actions = [
  {
    label: 'View',
    icon: '/icons/eye.svg',
    onClick: (row: any) => {
      // handle view action
      alert(`View consumer: ${row.uid}`);
    },
  },
];

const menuOptions = [
  { value: 'occupied', label: 'Occupied' },
  { value: 'vacant', label: 'Vacant' },
];

const Consumers: React.FC = () => {
  const [menuValue, setMenuValue] = useState('');

  // Add sNo property to each row for serial number
  const tableData = consumersData.map((row, idx) => ({ ...row, sNo: idx + 1 }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Consumers</h1>
        <div className="flex items-center gap-3">
          <Button label="Add Consumer" variant="primary" onClick={() => alert('Add Consumer')} />
          <div className="relative">
            <Dropdown
              name="consumer-menu"
              value={menuValue}
              onChange={e => setMenuValue(typeof e.target.value === 'string' ? e.target.value : Array.isArray(e.target.value) ? e.target.value[0] : '')}
              options={menuOptions}
              placeholder={''}
              searchable={false}
              className="w-10 h-10 min-w-0 min-h-0 p-0 border-none shadow-none bg-transparent flex items-center justify-center dropdown-below-trigger"
              leftIcon="/icons/menu-dots.svg"
            />
            <style>{`
              .dropdown-below-trigger .absolute.z-10 {
                left: 50% !important;
                top: 110% !important;
                right: auto !important;
                transform: translateX(-50%) !important;
                min-width: 140px;
              }
            `}</style>
          </div>
        </div>
      </div>
      <Table
        data={tableData}
        columns={columns}
        actions={actions}
        showActions
        searchable={false}
        pagination
        emptyMessage="No consumers found"
      />
    </div>
  );
};

export default Consumers; 