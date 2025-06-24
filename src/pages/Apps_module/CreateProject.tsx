import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/global/Button';
import Dropdown from '../../components/global/Dropdown';

const generateProjectId = () => {
  return `red-provider-${Math.floor(Math.random() * 1000000)}-b2`;
};

const CreateProject: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [location, setLocation] = useState('No organization');
  const navigate = useNavigate();

  useEffect(() => {
    setProjectId(generateProjectId());
  }, []);

  const dummyOptions = [
    { value: 'energy_meter', label: 'Energy Meter' },
    { value: 'water_meter', label: 'Water Meter' },
    { value: 'gas_meter', label: 'Gas Meter' },
    { value: 'smart_meter', label: 'Smart Meter' },
    // { value: 'prepaid_meter', label: 'Prepaid Meter' },
    // { value: 'digital_meter', label: 'Digital Meter' },
    // { value: 'analog_meter', label: 'Analog Meter' },
  ];
  

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/apps/applications');
  };

  const handleCancel = () => {
    navigate('/apps/applications');
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Create New Project</h1>

        <form onSubmit={handleCreate} className="space-y-8">

          {/* Project Name */}
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter project name"
            />
          </div>

          {/* Project ID */}
          {projectName.length != 0 ? (<div>
            <label className="block text-lg font-medium text-gray-800 mb-2">Project ID</label>
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <span className="text-blue-800 font-mono text-sm">{projectId}</span>
              <span className="text-xs text-gray-500">Auto-generated • Cannot be changed later</span>
            </div>
          </div>):(<></>)}
          

          {/* Buttons */}
          <div className="flex justify-end gap-4">
                <Button
                  label="Cancel"
                  onClick={handleCancel}
                  variant="primarysmall"
                />
                <Button
                  label="Create"
                  onClick={() => {
                    sessionStorage.setItem('selectedProject', JSON.stringify(projectName));
                    navigate('/apps/applications');
                  }}
                  variant="primary"
                />
          </div>
        </form>
      </div>

      <div className="p-6 space-y-10 max-w-md mx-auto">
      {/* <h1 className="text-xl font-bold">Dropdown Example</h1> */}

      {/* Single Select Dropdown */}
      <div>
        {/* <label className="block mb-1 font-medium">Select One Item</label> */}
        <Dropdown
          id="single-select"
          name="singleSelect"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value as string)}
          options={dummyOptions}
          placeholder="Choose one"
          groupBy="category"
          searchable={false}
          className="w-60"
        />
      </div>

      {/* Multi Select Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Select Multiple Items</label>
        <Dropdown
          id="multi-select"
          name="multiSelect"
          value={selectedMultiOptions}
          onChange={(e) => setSelectedMultiOptions(e.target.value as string[])}
          options={dummyOptions}
          isMultiSelect
          placeholder="Choose multiple"
          groupBy="category"
        />
        <p className="mt-2 text-sm text-gray-600">
          Selected: {selectedMultiOptions.join(', ') || 'None'}
        </p>
      </div>
    </div>

    </div>
  );
};

export default CreateProject;
