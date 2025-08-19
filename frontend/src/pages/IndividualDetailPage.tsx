import React, { useState, useEffect } from "react";
import PageC from "../components/global/PageC";

interface TableDataItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  department: string;
  joinDate: string;
  lastLogin: string;
}

const IndividualDetailPage: React.FC = () => {
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverallData();
  }, []);

  const fetchOverallData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/dummy-api');
      const result = await response.json();
      
      if (result.success) {
        setTableData(result.data);
      } else {
        console.error('Failed to fetch data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching overall data:', error);
      // Dummy data in catch block as requested
      setTableData([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0123',
          status: 'Active',
          role: 'Administrator',
          department: 'IT',
          joinDate: '2023-01-15',
          lastLogin: '2024-01-20 10:30:00'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1-555-0124',
          status: 'Active',
          role: 'Manager',
          department: 'Sales',
          joinDate: '2023-03-20',
          lastLogin: '2024-01-19 14:45:00'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+1-555-0125',
          status: 'Inactive',
          role: 'Developer',
          department: 'Engineering',
          joinDate: '2023-02-10',
          lastLogin: '2024-01-15 09:15:00'
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+1-555-0126',
          status: 'Active',
          role: 'Analyst',
          department: 'Finance',
          joinDate: '2023-04-05',
          lastLogin: '2024-01-20 16:20:00'
        },
        {
          id: 5,
          name: 'David Brown',
          email: 'david.brown@example.com',
          phone: '+1-555-0127',
          status: 'Active',
          role: 'Supervisor',
          department: 'Operations',
          joinDate: '2023-01-30',
          lastLogin: '2024-01-18 11:30:00'
        },
        {
          id: 6,
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '+1-555-0128',
          status: 'Active',
          role: 'Designer',
          department: 'Marketing',
          joinDate: '2023-05-12',
          lastLogin: '2024-01-21 08:45:00'
        },
        {
          id: 7,
          name: 'Robert Wilson',
          email: 'robert.wilson@example.com',
          phone: '+1-555-0129',
          status: 'Inactive',
          role: 'Intern',
          department: 'HR',
          joinDate: '2023-06-01',
          lastLogin: '2024-01-10 15:20:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const tableColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'lastLogin', label: 'Last Login' }
  ];

  const tableActions = [
    {
      label: 'View',
      onClick: (row: any) => console.log('View clicked for:', row.name),
      icon: 'eye.svg'
    },
    {
      label: 'Edit',
      onClick: (row: any) => console.log('Edit clicked for:', row.name),
      icon: 'edit.svg'
    },
    {
      label: 'Delete',
      onClick: (row: any) => console.log('Delete clicked for:', row.name),
      icon: 'delete.svg'
    }
  ];

  return (
    <PageC
      sections={[
        {
          layout: {
            type: "column",
            gap: "gap-6",
            className: "",
            rows: [
              {
                layout: "row",
                columns: [
                  {
                    name: "PageHeader",
                    props: {
                      title: "Individual Details",
                      onBackClick: () => window.history.back(),
                      backButtonText: "Back to Dashboard",
                      showMenu: true,
                      showDropdown: true,
                      menuItems: [
                        { id: "all", label: "All Tickets" },
                        { id: "high-priority", label: "High Priority" },
                      ],
                    },
                  },
                ],
              },
              {
                layout: "row",
                columns: [
                  {
                    name: "Table",
                    props: {
                      data: tableData,
                      columns: tableColumns,
                      actions: tableActions,
                      loading: loading,
                      sortable: true,
                      searchable: true,
                      pagination: true,
                      rowsPerPageOptions: [5, 10, 25, 50],
                      initialRowsPerPage: 10,
                      showActions: true,
                      emptyMessage: "No data available",
                      onRowClick: (row: any) => console.log('Row clicked:', row),
                      onEdit: (row: any) => console.log('Edit row:', row),
                      onDelete: (row: any) => console.log('Delete row:', row),
                      onView: (row: any) => console.log('View row:', row)
                    },
                  },
                ],
              },
            ],
          },
        },
      ]}
    />
  );
};

export default IndividualDetailPage;
