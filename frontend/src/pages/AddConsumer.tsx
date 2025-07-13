import React, { useState } from 'react';
import Page from '../components/global/Page';
import { useNavigate } from 'react-router-dom';
import {
  createHeaderComponent,
  createActionsComponent
} from '../components/global/PageComponents';

const AddConsumer: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    uid: '',
    name: '',
    address: '',
    phaseType: '',
    consumerType: '',
    paymentType: '',
    connectedLoad: '',
    registrationDate: '',
    status: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add save logic
    alert('Saved!');
  };

  // Fix: Separate handler for Save button
  const handleSaveButton = () => {
    document.getElementById('add-consumer-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const headerComponent = createHeaderComponent(
    'Add Consumer',
    'Add a new consumer to the system',
    ''
  );

  const actionsComponent = createActionsComponent([
    { label: 'Cancel', onClick: handleCancel, variant: 'secondary' },
    { label: 'Save', onClick: handleSaveButton, variant: 'primary' }
  ]);

  const sections = [
    {
      id: 'add-consumer-form',
      component: (
        <form id="add-consumer-form" onSubmit={handleSave} style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="uid"
                    value={form.uid}
                    onChange={handleChange}
                    placeholder="UID"
                    required
                  />
                  <span className="input-icon material-icons">badge</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <select
                    name="phaseType"
                    value={form.phaseType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Phase Type</option>
                    <option value="single">Single</option>
                    <option value="three">Three</option>
                  </select>
                  <span className="input-icon material-icons">arrow_drop_down</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="number"
                    name="connectedLoad"
                    value={form.connectedLoad}
                    onChange={handleChange}
                    placeholder="Connected Load (kW)"
                    required
                  />
                  <span className="input-icon material-icons">bolt</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                  <span className="input-icon material-icons">person</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <select
                    name="consumerType"
                    value={form.consumerType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Consumer Type</option>
                    <option value="domestic">Domestic</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <span className="input-icon material-icons">arrow_drop_down</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="date"
                    name="registrationDate"
                    value={form.registrationDate}
                    onChange={handleChange}
                    placeholder="Registration Date"
                    required
                  />
                  <span className="input-icon material-icons">calendar_today</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                  />
                  <span className="input-icon material-icons">location_on</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <select
                    name="paymentType"
                    value={form.paymentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Payment Type</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </select>
                  <span className="input-icon material-icons">arrow_drop_down</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="input-icon material-icons">arrow_drop_down</span>
                </div>
              </div>
            </div>
          </div>
          <div className="input-group">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes (optional)"
              style={{ width: '100%', minHeight: 80, border: 'none', background: 'transparent', outline: 'none', fontSize: 16 }}
            />
          </div>
        </form>
      )
    }
  ];

  return (
    <Page
      layout="single-column"
      header={headerComponent}
      actions={actionsComponent}
      className=""
      sections={sections}
    />
  );
};

export default AddConsumer; 