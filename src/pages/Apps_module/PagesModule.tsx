import React, { useState } from 'react';
import { FiEye, FiEdit3, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import Table from '../../components/global/Table';
import Button from '../../components/global/Button';
import Input from '../../components/forms/Input';

// Define the column types
interface Column {
  key: string;
  label: string;
  render?: (value: string | number | boolean | null | undefined, row: any) => React.ReactNode;
}

// Define the project data type - extending TableData interface
interface Project {
  [key: string]: string | undefined;
  id: string;
  pageName: string;
  status: string;
  description: string;
}

// Define action type - matching Table component's Action interface
interface Action {
  label: string;
  onClick: (row: any) => void;
  icon: string;
}

// Define summary item type
interface SummaryItem {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

const columns: Column[] = [
  { key: 'pageName', label: 'Page Name' },
  {
    key: 'status',
    label: 'Status',
    render: (value: string | number | boolean | null | undefined) => {
      const status = String(value).toLowerCase();
      const getStatusClasses = (status: string) => {
        switch (status) {
          case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
          case 'ongoing':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'planned':
            return 'bg-blue-100 text-blue-800 border-blue-200';
          default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
        }
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(status)}`}>
          {String(value)}
        </span>
      );
    }
  },
  { key: 'description', label: 'Description' },
];

const data: Project[] = [
  {
    id: '1',
    pageName: 'Dashboard page',
    status: 'Active',
    description: 'Overview of key metrics and quick links.'
  },
  {
    id: '2',
    pageName: 'Consumers',
    status: 'Active',
    description: 'Manage and view consumer details.'
  },
  {
    id: '3',
    pageName: 'Prepaid Transactions',
    status: 'Active',
    description: 'Track and manage prepaid transaction records.'
  },
  {
    id: '4',
    pageName: 'Postpaid Bills',
    status: 'Active',
    description: 'View and manage postpaid billing information.'
  },
  {
    id: '5',
    pageName: 'Tickets',
    status: 'Active',
    description: 'Support and issue tracking for users.'
  },
  {
    id: '6',
    pageName: 'Data Logger Master',
    status: 'Active',
    description: 'Configure and monitor data loggers.'
  },
  {
    id: '7',
    pageName: 'Meter List',
    status: 'Active',
    description: 'List and manage all meters in the system.'
  },
];

const PagesModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleEdit = (row: any): void => {
    console.log('Edit project:', row);
  };

  const handleDelete = (row: any): void => {
    console.log('Delete project:', row);
  };

  const handleView = (row: any): void => {
    console.log('View project:', row);
  };

  const handleCreateProject = (): void => {
    console.log('Create new project');
  };

  const actions: Action[] = [
    {
      label: 'View',
      onClick: handleView,
      icon: '/icons/eye.svg'
    },
    {
      label: 'Edit',
      onClick: handleEdit,
      icon: '/icons/pencil.svg'
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      icon: '/icons/delete.svg'
    }
  ];

  const summary: SummaryItem[] = [
    { 
      label: 'Total Projects', 
      value: data.length, 
      color: '#163b7c',
      icon: <FiPlus size={20} />
    },
    { 
      label: 'Completed', 
      value: data.filter(d => d.status === 'Completed').length, 
      color: '#55b56c' 
    },
    { 
      label: 'Ongoing', 
      value: data.filter(d => d.status === 'Ongoing').length, 
      color: '#ffc107' 
    },
    { 
      label: 'Planned', 
      value: data.filter(d => d.status === 'Planned').length, 
      color: '#007bff' 
    },
  ];

  const filteredData = data.filter(project => {
    const matchesSearch = project.pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description ? project.description.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    const matchesFilter = selectedFilter === 'all' || project.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Pages</h1>
          <p className="text-gray-600">Manage your pages</p>
        </div>
        <Button
          label="Create Pages"
          onClick={handleCreateProject}
          variant="primary"
        />
      </div>


      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            placeholder="Search Pages..."
            onSearch={setSearchTerm}
            className="w-full"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table
          data={filteredData}
          columns={columns}
          sortable={true}
          searchable={false}
          pagination={true}
          rowsPerPageOptions={[5, 10, 20]}
          emptyMessage="No projects found"
          loading={false}
          initialRowsPerPage={10}
          text="Project"
          actions={actions}
          showActions={true}
        />
      </div>
    </div>
  );
};

export default PagesModule;
