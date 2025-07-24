import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import BACKEND_URL from '../config';

interface Role {
    id: number;
    name: string;
    users: Array<{
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        isActive: boolean;
    }>;
    permissions: Array<{ id: number; name: string; description: string }>;
    createdAt: string;
    updatedAt?: string;
}

interface NewRole {
    name: string;
    permissions?: string;
}

export default function RoleManagement() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [newRole, setNewRole] = useState<NewRole>({ name: '' });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${BACKEND_URL}/roles`);
            const data = await res.json();
            if (data.success) {
                setRoles(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch roles');
            }
        } catch (err) {
            setError('Failed to fetch roles');
            console.error('Error fetching roles:', err);
            // DEMO DATA FALLBACK
            if (roles.length === 0) {
                setRoles([
                    {
                        id: 1,
                        name: 'Admin',
                        users: [
                            {
                                id: 1,
                                username: 'admin',
                                firstName: 'Admin',
                                lastName: 'User',
                                email: 'admin@example.com',
                                isActive: true,
                            },
                        ],
                        permissions: [
                            {
                                id: 1,
                                name: 'manage_users',
                                description: 'Can manage users',
                            },
                            {
                                id: 2,
                                name: 'manage_roles',
                                description: 'Can manage roles',
                            },
                        ],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    {
                        id: 2,
                        name: 'User',
                        users: [
                            {
                                id: 2,
                                username: 'user',
                                firstName: 'Normal',
                                lastName: 'User',
                                email: 'user@example.com',
                                isActive: true,
                            },
                        ],
                        permissions: [
                            {
                                id: 3,
                                name: 'view_dashboard',
                                description: 'Can view dashboard',
                            },
                        ],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Event Handlers
    const handleAddRole = () => {
        setIsAddingRole(true);
        setSelectedRole(null);
        setNewRole({ name: '' });
    };

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setNewRole({
            name: role.name,
            permissions: role.permissions.map((p) => p.name).join(', '),
        });
        setIsAddingRole(true);
    };

    const handleDeleteRole = async (role: Role) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                setLoading(true);

                const res = await fetch(`${BACKEND_URL}/roles/${role.id}`, {
                    method: 'DELETE',
                });
                const data = await res.json();

                if (data.success) {
                    setRoles((prevRoles) =>
                        prevRoles.filter((r) => r.id !== role.id)
                    );
                } else {
                    throw new Error(data.message || 'Failed to delete role');
                }
            } catch (err) {
                setError('Failed to delete role');
                console.error('Error deleting role:', err);
                // DEMO DATA FALLBACK
                setRoles((prevRoles) =>
                    prevRoles.filter((r) => r.id !== role.id)
                );
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSaveRole = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const method = selectedRole ? 'PUT' : 'POST';
            const url = selectedRole
                ? `${BACKEND_URL}/roles/${selectedRole.id}`
                : `${BACKEND_URL}/roles`;

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRole),
            });
            const data = await res.json();

            if (data.success) {
                if (selectedRole) {
                    setRoles((prevRoles) =>
                        prevRoles.map((role) =>
                            role.id === selectedRole.id ? data.data : role
                        )
                    );
                } else {
                    setRoles((prevRoles) => [...prevRoles, data.data]);
                }
                setIsAddingRole(false);
                setSelectedRole(null);
                setNewRole({ name: '' });
            } else {
                throw new Error(data.message || 'Failed to save role');
            }
        } catch (err) {
            setError('Failed to save role');
            console.error('Error saving role:', err);
            // DEMO DATA FALLBACK
            if (selectedRole) {
                setRoles((prevRoles) =>
                    prevRoles.map((role) =>
                        role.id === selectedRole.id
                            ? {
                                  ...role,
                                  name: newRole.name,
                                  updatedAt: new Date().toISOString(),
                              }
                            : role
                    )
                );
            } else {
                setRoles((prevRoles) => [
                    ...prevRoles,
                    {
                        id: Math.max(0, ...prevRoles.map((r) => r.id)) + 1,
                        name: newRole.name,
                        users: [],
                        permissions: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ]);
            }
            setIsAddingRole(false);
            setSelectedRole(null);
            setNewRole({ name: '' });
        } finally {
            setLoading(false);
        }
    };

    const handleManagePermissions = (role: Role) => {
        navigate('/admin/permissions', { state: { role } });
    };

    const handleCancelForm = () => {
        setIsAddingRole(false);
        setSelectedRole(null);
        setNewRole({ name: '' });
    };

    // Utility Functions
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'NA';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };
    console.log(formatDate);

    // Table data for the Table component
    const tableData = roles.map((role) => ({
        id: role.id,
        name: role.name,
        users: role.users.length,
        permissions: role.permissions.map((p) => p.name).join(', '),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt || 'NA',
    }));

    // Table columns configuration
    const tableColumns = [
        { key: 'name', label: 'Role Name' },
        { key: 'users', label: 'Users' },
        { key: 'permissions', label: 'Permissions' },
        //{ key: 'createdAt', label: 'Created Date' }
    ];

    // Custom action handlers for the table
    const handleTableEdit = (row: any) => {
        const role = roles.find((r) => r.id === row.id);
        if (role) {
            handleEditRole(role);
        }
    };

    const handleTableDelete = (row: any) => {
        const role = roles.find((r) => r.id === row.id);
        if (role) {
            handleDeleteRole(role);
        }
    };

    const handleTableManagePermissions = (row: any) => {
        const role = roles.find((r) => r.id === row.id);
        if (role) {
            handleManagePermissions(role);
        }
    };

    // Actions array for the table
    const tableActions = [
        {
            label: 'Manage Permissions',
            onClick: handleTableManagePermissions,
            icon: '/icons/settings.svg',
        },
        {
            label: 'Edit',
            onClick: handleTableEdit,
            icon: '/icons/user-pen.svg',
        },
        {
            label: 'Delete',
            onClick: handleTableDelete,
            icon: '/icons/delete.svg',
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: 'Role Management',
                                                onBackClick: () =>
                                                    navigate('/'),
                                                backButtonText:
                                                    'Back to Dashboard',
                                                buttonsLabel: 'Add Role',
                                                variant: 'primary',
                                                onClick: handleAddRole,
                                                showMenu: true,
                                                showDropdown: true,
                                                menuItems: [
                                                    {
                                                        id: 'all',
                                                        label: 'All Roles',
                                                    },
                                                    {
                                                        id: 'admin',
                                                        label: 'Administrative Roles',
                                                    },
                                                    {
                                                        id: 'user',
                                                        label: 'User Roles',
                                                    },
                                                    {
                                                        id: 'support',
                                                        label: 'Support Roles',
                                                    },
                                                    {
                                                        id: 'financial',
                                                        label: 'Financial Roles',
                                                    },
                                                    {
                                                        id: 'system',
                                                        label: 'System Roles',
                                                    },
                                                ],
                                                onMenuItemClick: (
                                                    itemId: string
                                                ) => {
                                                    console.log(
                                                        `Filter by: ${itemId}`
                                                    );
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Error Section (if any)
                    ...(error
                        ? [
                              {
                                  layout: {
                                      type: 'column' as const,
                                      gap: 'gap-6',
                                      rows: [
                                          {
                                              layout: 'row' as const,
                                              columns: [
                                                  {
                                                      name: 'Card',
                                                      props: {
                                                          className:
                                                              'p-4 bg-red-50 border border-red-200',
                                                          children: (
                                                              <div className="flex items-center justify-between">
                                                                  <p className="text-red-600">
                                                                      {error}
                                                                  </p>
                                                                  <button
                                                                      onClick={() =>
                                                                          setError(
                                                                              null
                                                                          )
                                                                      }
                                                                      className="text-red-400 hover:text-red-600">
                                                                      ×
                                                                  </button>
                                                              </div>
                                                          ),
                                                      },
                                                  },
                                              ],
                                          },
                                      ],
                                  },
                              },
                          ]
                        : []),
                    // Main Content Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: isAddingRole
                                                ? 'Card'
                                                : 'Table',
                                            props: isAddingRole
                                                ? {
                                                      className: 'p-6',
                                                      children: (
                                                          <div className="max-w-2xl mx-auto">
                                                              <div className="flex items-center gap-3 mb-6">
                                                                  <img
                                                                      src="/icons/roles.svg"
                                                                      alt="Role"
                                                                      className="w-8 h-8"
                                                                  />
                                                                  <div>
                                                                      <h3 className="text-lg font-semibold text-text-primary">
                                                                          {selectedRole
                                                                              ? 'Edit Role'
                                                                              : 'Add New Role'}
                                                                      </h3>
                                                                      <p className="text-text-secondary text-sm">
                                                                          {selectedRole
                                                                              ? 'Update role information'
                                                                              : 'Create a new role'}
                                                                      </p>
                                                                  </div>
                                                              </div>

                                                              <form
                                                                  onSubmit={
                                                                      handleSaveRole
                                                                  }
                                                                  className="space-y-6">
                                                                  <div className="space-y-2">
                                                                      <label className="block text-sm font-semibold text-text-secondary">
                                                                          Role
                                                                          Name *
                                                                      </label>
                                                                      <input
                                                                          type="text"
                                                                          value={
                                                                              newRole.name
                                                                          }
                                                                          onChange={(
                                                                              e
                                                                          ) =>
                                                                              setNewRole(
                                                                                  {
                                                                                      ...newRole,
                                                                                      name: e
                                                                                          .target
                                                                                          .value,
                                                                                  }
                                                                              )
                                                                          }
                                                                          placeholder="Enter role name"
                                                                          required
                                                                          className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                                                      />
                                                                  </div>
                                                                  <div className="flex justify-end gap-3 pt-4 border-t">
                                                                      <button
                                                                          type="button"
                                                                          onClick={
                                                                              handleCancelForm
                                                                          }
                                                                          disabled={
                                                                              loading
                                                                          }
                                                                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                                                                          Cancel
                                                                      </button>
                                                                      <button
                                                                          type="submit"
                                                                          disabled={
                                                                              loading
                                                                          }
                                                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                                                          {loading
                                                                              ? 'Saving...'
                                                                              : selectedRole
                                                                              ? 'Update Role'
                                                                              : 'Create Role'}
                                                                      </button>
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      ),
                                                  }
                                                : {
                                                      data: tableData,
                                                      columns: tableColumns,
                                                      loading: loading,
                                                      emptyMessage:
                                                          'No roles found',
                                                      searchable: true,
                                                      sortable: true,
                                                      text: 'Role',
                                                      actions: tableActions,
                                                  },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </Suspense>
    );
}
