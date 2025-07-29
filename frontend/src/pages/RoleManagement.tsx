import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Page from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';
import Table from '@components/global/Table';
import Button from '@components/global/Button';

// Context

// Types
import type { Section } from '@components/global/Page';
import type { TableData, Column } from '@components/global/Table';

// API Client
const API_BASE_URL = 'http://localhost:4000/api';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

const apiClient = {
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
};

// Interfaces
interface Role extends TableData {
    id: number;
    name: string;
    description: string;
    permissions: any; // Changed to any to satisfy TableData constraint
    created_at: string;
    updated_at?: string;
}

interface NewRole {
    name: string;
    description: string;
    permissions: string;
}

// Error Display Component
const ErrorDisplay: React.FC<{ error: string; onClose: () => void }> = ({ error, onClose }) => (
    <div className="bg-danger-light border border-danger rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <svg className="w-5 h-5 text-danger mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-danger font-medium">{error}</span>
            </div>
            <button
                onClick={onClose}
                className="text-danger hover:text-danger-dark"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
);

const RoleManagement: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isAddingRole, setIsAddingRole] = useState(false);
    const [newRole, setNewRole] = useState<NewRole>({
        name: '',
        description: '',
        permissions: '',
    });

    // Dummy Data (fallback)
    const dummyRoles: Role[] = [
        {
            id: 1,
            name: 'Super Admin',
            description:
                'Full system access with all permissions including user management, system configuration, and data management.',
            permissions:
                'create, read, update, delete, manage_users, manage_roles, system_config',
            created_at: '2024-01-01T09:00:00Z',
            updated_at: '2024-01-15T10:30:00Z',
        },
        {
            id: 2,
            name: 'Admin',
            description:
                'Administrative access with user management and most system features except critical system configuration.',
            permissions: 'create, read, update, delete, manage_users',
            created_at: '2024-01-02T10:15:00Z',
            updated_at: '2024-01-14T15:45:00Z',
        },
        {
            id: 3,
            name: 'Moderator',
            description:
                'Moderate access with ability to manage content and basic user interactions.',
            permissions: 'create, read, update, moderate_content',
            created_at: '2024-01-03T14:30:00Z',
            updated_at: '2024-01-13T11:20:00Z',
        },
        {
            id: 4,
            name: 'Accountant',
            description:
                'Financial data access with permissions to view and manage billing, payments, and financial reports.',
            permissions: 'read, manage_billing, view_reports, manage_payments',
            created_at: '2024-01-04T11:45:00Z',
            updated_at: '2024-01-12T16:10:00Z',
        },
        {
            id: 5,
            name: 'Support Agent',
            description:
                'Customer support role with access to tickets, user queries, and basic system information.',
            permissions: 'read, manage_tickets, view_customer_data',
            created_at: '2024-01-05T13:20:00Z',
            updated_at: '2024-01-11T09:30:00Z',
        },
        {
            id: 6,
            name: 'User',
            description:
                'Basic user access with limited permissions for personal account management.',
            permissions: 'read, update_profile',
            created_at: '2024-01-06T15:10:00Z',
            updated_at: '2024-01-10T12:15:00Z',
        },
    ];

    // Effects
    useEffect(() => {
        fetchRoles();
    }, []);

    // API Functions
    const fetchRoles = async () => {
        try {
            setLoading(true);
            setError(null);

            try {
                const response: ApiResponse<Role[]> = await apiClient.get('/roles');
                if (response.success) {
                    setRoles(response.data || []);
                } else {
                    throw new Error(response.message || 'Failed to fetch roles');
                }
            } catch (apiError) {
                console.warn('API call failed, using dummy data:', apiError);
                // Fallback to dummy data if API is not available
                setRoles(dummyRoles);
            }
        } catch (err) {
            setError('Failed to fetch roles');
            console.error('Error fetching roles:', err);
            // Use dummy data as fallback
            setRoles(dummyRoles);
        } finally {
            setLoading(false);
        }
    };

    // Event Handlers
    const handleAddRole = () => {
        setIsAddingRole(true);
        setSelectedRole(null);
        setNewRole({ name: '', description: '', permissions: '' });
    };

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setNewRole({
            name: role.name,
            description: role.description,
            permissions: role.permissions || '',
        });
        setIsAddingRole(true);
    };

    const handleDeleteRole = async (role: Role) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                setLoading(true);

                try {
                    await apiClient.delete(`/roles/${role.id}`);
                    await fetchRoles();
                } catch (apiError) {
                    console.warn('API call failed, using local state update:', apiError);
                    // Fallback to local state update
                    setRoles((prevRoles) =>
                        prevRoles.filter((r) => r.id !== role.id)
                    );
                }
            } catch (err) {
                setError('Failed to delete role');
                console.error('Error deleting role:', err);
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

            try {
                if (selectedRole) {
                    await apiClient.put(`/roles/${selectedRole.id}`, newRole);
                } else {
                    await apiClient.post('/roles', newRole);
                }
                await fetchRoles();
            } catch (apiError) {
                console.warn('API call failed, using local state update:', apiError);
                // Fallback to local state update
                if (selectedRole) {
                    setRoles((prevRoles) =>
                        prevRoles.map((role) =>
                            role.id === selectedRole.id
                                ? {
                                      ...role,
                                      ...newRole,
                                      updated_at: new Date().toISOString(),
                                  }
                                : role
                        )
                    );
                } else {
                    const newRoleData: Role = {
                        id: Math.max(...roles.map((r) => r.id)) + 1,
                        ...newRole,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    setRoles((prevRoles) => [...prevRoles, newRoleData]);
                }
            }

            setIsAddingRole(false);
            setSelectedRole(null);
            setNewRole({ name: '', description: '', permissions: '' });
        } catch (err) {
            setError('Failed to save role');
            console.error('Error saving role:', err);
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
        setNewRole({ name: '', description: '', permissions: '' });
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

    // Table columns
    const columns: Column[] = [
        {
            key: 'name',
            label: 'Role Name',
            render: (value: string | number | boolean | null | undefined) =>
                (value as string) || '-',
        },
        {
            key: 'description',
            label: 'Description',
            render: (value: string | number | boolean | null | undefined) =>
                (value as string) || '-',
        },
        {
            key: 'created_at',
            label: 'Created Date',
            render: (value: string | number | boolean | null | undefined) =>
                value ? formatDate(value as string) : 'NA',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row: TableData) => {
                const role = row as Role;
                return (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            label="Manage Permissions"
                            variant="warning"
                            onClick={() => handleManagePermissions(role)}
                        />
                        <Button
                            label="Edit"
                            variant="warning"
                            onClick={() => handleEditRole(role)}
                        />
                        <Button
                            label="Delete"
                            variant="danger"
                            onClick={() => handleDeleteRole(role)}
                        />
                    </div>
                );
            },
        },
    ];

    // Role form component
    const RoleForm = () => (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <img
                        src="/icons/roles.svg"
                        alt="Role"
                        className="w-8 h-8"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                            {selectedRole ? 'Edit Role' : 'Add New Role'}
                        </h3>
                        <p className="text-text-secondary text-sm">
                            {selectedRole
                                ? 'Update role information'
                                : 'Create a new role'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSaveRole} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text-secondary">
                            Role Name *
                        </label>
                        <input
                            type="text"
                            value={newRole.name}
                            onChange={(e) =>
                                setNewRole({ ...newRole, name: e.target.value })
                            }
                            placeholder="Enter role name"
                            required
                            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-text-secondary">
                            Description
                        </label>
                        <textarea
                            value={newRole.description}
                            onChange={(e) =>
                                setNewRole({
                                    ...newRole,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Enter role description"
                            rows={4}
                            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-vertical"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            label="Cancel"
                            variant="outline"
                            onClick={handleCancelForm}
                            disabled={loading}
                        />
                        <Button
                            label={
                                loading
                                    ? 'Saving...'
                                    : selectedRole
                                    ? 'Update Role'
                                    : 'Create Role'
                            }
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );

    // Header component
    const headerComponent = (
        <PageHeader
            title="Roles Management"
            onBackClick={() => navigate('/')}
            backButtonText="Back"
            buttonsLabel="Add Role"
            variant="primary"
            onClick={handleAddRole}
        />
    );

    // Page sections
    const sections: Section[] = [
        {
            id: 'subtitle',
            component: (
                <div className="mb-6">
                    <p className="text-gray-600">Manage and configure system roles</p>
                </div>
            ),
        },
        {
            id: 'error',
            component: error ? (
                <ErrorDisplay
                    error={error}
                    onClose={() => setError(null)}
                />
            ) : null,
        },
        {
            id: 'content',
            component: (
                <div className="space-y-6">
                    {isAddingRole ? (
                        <RoleForm />
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm">
                            <Table
                                data={roles}
                                columns={columns}
                                loading={loading}
                                emptyMessage="No roles found"
                                searchable={true}
                                sortable={true}
                                text="Role"
                            />
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Page
            layout="single-column"
            sections={sections.filter((section) => section.component !== null)}
            header={headerComponent}
            className="p-4"
        />
    );
};

export default RoleManagement;
