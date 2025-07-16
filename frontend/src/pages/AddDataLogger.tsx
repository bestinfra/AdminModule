import React, { useState } from 'react';
import Page from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';

const AddDataLogger: React.FC = () => {
  const [form, setForm] = useState({
    dcuModemSlNo: '',
    hardwareVersion: '',
    firmwareVersion: '',
    mobile: '',
    installationDate: '',
    status: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add save logic
    alert('Saved!');
  };

  // Fix: Separate handler for Save button
  const handleSaveButton = () => {
    // Optionally trigger form submit if needed
    document.getElementById('add-data-logger-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const headerComponent = (
    <PageHeader
      title="Add Data Logger"
      onBackClick={() => window.history.back()}
      backButtonText="Back to Data Loggers"
      buttonsLabel="Save"
      variant="primary"
      onClick={handleSaveButton}
    />
  );

  const sections = [
    {
      id: 'add-data-logger-form',
      component: (
        <form id="add-data-logger-form" onSubmit={handleSave} style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="dcuModemSlNo"
                    value={form.dcuModemSlNo}
                    onChange={handleChange}
                    placeholder="DCU/Modem Serial Number"
                    required
                  />
                  <span className="input-icon material-icons">badge</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                  />
                  <span className="input-icon material-icons">call</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="hardwareVersion"
                    value={form.hardwareVersion}
                    onChange={handleChange}
                    placeholder="Hardware Version"
                    required
                  />
                  <span className="input-icon material-icons">memory</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="date"
                    name="installationDate"
                    value={form.installationDate}
                    onChange={handleChange}
                    placeholder="Installation Date"
                    required
                  />
                  <span className="input-icon material-icons">calendar_today</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="input-group">
                <div className="input-icon-group">
                  <input
                    type="text"
                    name="firmwareVersion"
                    value={form.firmwareVersion}
                    onChange={handleChange}
                    placeholder="Firmware Version"
                    required
                  />
                  <span className="input-icon material-icons">settings</span>
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
        </form>
      )
    }
  ];

  return (
    <Page
      layout="single-column"
      header={headerComponent}
      className="p-2"
      sections={sections}
    />
  );
};

export default AddDataLogger; 