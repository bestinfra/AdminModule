import React from 'react';
import Page from '@components/global/Page';
import { useNavigate } from 'react-router-dom';
import {
  createHeaderComponent} from '@components/global/PageComponents';
import Form from '@components/forms/Form';
import type { FormInputConfig } from '@components/forms/types';

const meterInputs: FormInputConfig[] = [
  { name: 'uid', type: 'text', label: 'UID', placeholder: 'UID', icon: '/icons/badge.svg', required: true },
  { name: 'serialNumber', type: 'text', label: 'Serial Number', placeholder: 'Serial Number', icon: '/icons/precision_manufacturing.svg', required: true },
  { name: 'location', type: 'text', label: 'Location', placeholder: 'Location', icon: '/icons/location_on.svg', required: true },
  { name: 'phaseType', type: 'select', label: 'Phase Type', placeholder: 'Phase Type', icon: '/icons/arrow_drop_down.svg', required: true, options: [
    { value: '', label: 'Phase Type' },
    { value: 'single', label: 'Single' },
    { value: 'three', label: 'Three' },
  ] },
  { name: 'meterType', type: 'select', label: 'Meter Type', placeholder: 'Meter Type', icon: '/icons/arrow_drop_down.svg', required: true, options: [
    { value: '', label: 'Meter Type' },
    { value: 'prepaid', label: 'Prepaid' },
    { value: 'postpaid', label: 'Postpaid' },
  ] },
  { name: 'paymentType', type: 'select', label: 'Payment Type', placeholder: 'Payment Type', icon: '/icons/arrow_drop_down.svg', required: true, options: [
    { value: '', label: 'Payment Type' },
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online' },
  ] },
  { name: 'connectedLoad', type: 'number', label: 'Connected Load (kW)', placeholder: 'Connected Load (kW)', icon: '/icons/bolt.svg', required: true },
  { name: 'installationDate', type: 'date', label: 'Installation Date', placeholder: 'Installation Date', icon: '/icons/calendar_today.svg', required: true },
  { name: 'status', type: 'select', label: 'Status', placeholder: 'Status', icon: '/icons/arrow_drop_down.svg', required: true, options: [
    { value: '', label: 'Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ] },
  { name: 'notes', type: 'textarea', label: 'Notes (optional)', placeholder: 'Notes (optional)', icon: '', required: false },
];

const AddMeter: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // TODO: Add save logic
    alert('Saved!');
  };

  const headerComponent = createHeaderComponent(
    'Add Meter',
    'Add a new meter to the system',
    ''
  );

  return (
    <Page
      layout="single-column"
      header={headerComponent}
      className=""
      sections={[{
        id: 'add-meter-form',
        component: (
          <Form
            inputs={meterInputs}
            onSubmit={handleSave}
            onCancel={handleCancel}
            submitLabel="Save"
            cancelLabel="Cancel"
            layout="grid"
            gridCols={3}
            showCancel
          />
        )
      }]}
    />
  );
};

export default AddMeter; 