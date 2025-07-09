import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/global/Card';
import Table from '../components/global/Table';
import Dropdown from '../components/global/Dropdown';
import Button from '../components/global/Button';

const meterCards = [
  {
    title: 'Total Meters',
    value: 3,
    icon: '/icons/meter.svg',
    subtitle1: '3 Active',
    subtitle2: '0 In-Active',
  },
  {
    title: 'Meter Makes',
    value: 17,
    icon: '/icons/meter-make.svg',
    subtitle1: '1 Used Meter Makes',
    subtitle2: '',
  },
  {
    title: 'Mapped Meters',
    value: 3,
    icon: '/icons/mapped-meter.svg',
    subtitle1: '78 Unmapped',
    subtitle2: '0 Replaced',
  },
  {
    title: 'Connection Type',
    value: 'Prepaid',
    icon: '/icons/connection-type.svg',
    subtitle1: '3 Prepaid',
    subtitle2: '0 Postpaid',
  },
];

const columns = [
  { key: 'slNo', label: 'Sl No' },
  { key: 'meterSlNo', label: 'Meter SI No' },
  { key: 'modemSlNo', label: 'Modem SI No' },
  { key: 'meterType', label: 'Meter Type' },
  { key: 'meterMake', label: 'Meter Make' },
  { key: 'consumerName', label: 'Consumer Name' },
  { key: 'location', label: 'Location' },
  { key: 'installationDate', label: 'Installation Date' },
];

const data = [
  {
    slNo: 1,
    meterSlNo: 'A9345417',
    modemSlNo: 'RFDCU_DCU101',
    meterType: 'Prepaid',
    meterMake: 'LnT DLMS',
    consumerName: 'Neo Travels',
    location: 'NA',
    installationDate: 'NA',
  },
  {
    slNo: 2,
    meterSlNo: 'A9211433',
    modemSlNo: 'RFDCU_DCU101',
    meterType: 'Prepaid',
    meterMake: 'LnT DLMS',
    consumerName: 'Mobikins',
    location: 'NA',
    installationDate: 'NA',
  },
  {
    slNo: 3,
    meterSlNo: 'A9211434',
    modemSlNo: 'RFDCU_DCU101',
    meterType: 'Prepaid',
    meterMake: 'LnT DLMS',
    consumerName: 'Airborne General Store',
    location: 'NA',
    installationDate: 'NA',
  },
];

const statusOptions = [
  { value: '', label: 'Filter By Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'In-Active' },
];
const typeOptions = [
  { value: '', label: 'Filter By Meter Types' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'postpaid', label: 'Postpaid' },
];
const mappingOptions = [
  { value: '', label: 'Filter By Mapping' },
  { value: 'mapped', label: 'Mapped' },
  { value: 'unmapped', label: 'Unmapped' },
];

const MetersList: React.FC = () => {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [mapping, setMapping] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const actions = [
    {
      label: 'View',
      icon: '/icons/eye.svg',
      onClick: (row: any) => navigate(`/meter-details/${row.meterSlNo}`),
    },
  ];

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold">Meters List</div>
        <Button
          label="Add Meter"
          variant="primary"
          onClick={() => {}}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {meterCards.map((card, idx) => (
          <Card key={idx} {...card} />
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Dropdown
          name="status"
          value={status}
          onChange={e => setStatus(e.target.value as string)}
          options={statusOptions}
          className="w-full md:w-1/4"
        />
        <Dropdown
          name="type"
          value={type}
          onChange={e => setType(e.target.value as string)}
          options={typeOptions}
          className="w-full md:w-1/4"
        />
        <Dropdown
          name="mapping"
          value={mapping}
          onChange={e => setMapping(e.target.value as string)}
          options={mappingOptions}
          className="w-full md:w-1/4"
        />
      </div>
      <div className="mb-4 flex items-center">
        {/* <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-full px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="-ml-8">
          <img src="/icons/search.svg" alt="search" className="w-5 h-5" />
        </span> */}
      </div>
      <Table columns={columns} data={data} actions={actions} pagination={true} searchable={false} showActions={true} />
    </div>
  );
};

export default MetersList; 