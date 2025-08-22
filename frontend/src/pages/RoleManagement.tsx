import { useState, useEffect, Suspense } from 'react';
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

export default function RoleManagement() {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errorMessages, setErrors] = useState<string[]>([]);
    const [serverPagination, setServerPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<any>(null);
    const [roleToEdit, setRoleToEdit] = useState<any>(null);
    const [formData, setFormData] = useState({
        roleName: '',
        description: ''
    });

    const addError = (errorMessage: string) => {
        setErrors(prev => {
            // Only add error if it's not already there
            if (!prev.includes(errorMessage)) {
                return [...prev, errorMessage];
            }
            return prev;
        });
    };

    const removeError = (indexToRemove: number) => {
        setErrors(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const clearErrors = () => {
        setErrors([]);
    };

    const retryAllAPIs = () => {
        clearErrors();
        fetchRoles();
    };

    const fetchRoles = async (page = 1, limit = 10, searchTerm = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            
            if (searchTerm && searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }
            
            const res = await fetch(`${BACKEND_URL}/roles?${params.toString()}`);
            
            // Check if response is ok before trying to parse JSON
            if (!res.ok) {
                addError(`Failed to fetch roles`);
                return;
            }
            
            const data = await res.json();
            if (data.success) {
                setRoles(data.data);
                setServerPagination({
                    currentPage: data.pagination?.currentPage || 1,
                    totalPages: data.pagination?.totalPages || 1,
                    totalCount: data.pagination?.totalCount || 0,
                    limit: data.pagination?.limit || limit,
                    hasNextPage: data.pagination?.hasNextPage || false,
                    hasPrevPage: data.pagination?.hasPrevPage || false,
                });
            } else {
                addError('Failed to fetch roles');
                return;
            }
        } catch (err: any) {
            addError('Failed to fetch roles');
            
            // Fallback to empty roles array if this is the initial load
            if (roles.length === 0) {
                setRoles([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchRoles();
    }, []);

    // Handle table pagination
    const handlePageChange = (page: number, limit: number) => {
        fetchRoles(page, limit);
    };

    // Handle table search
    const handleSearch = (searchTerm: string) => {
        // Reset to first page when searching
        fetchRoles(1, serverPagination.limit, searchTerm);
    };

    const handleDeleteClick = (row: any) => {
        setRoleToDelete(row);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!roleToDelete) return;
        
        setDeleting(true);
        try {
            const res = await fetch(`${BACKEND_URL}/roles/${roleToDelete.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    setRoles(roles.filter(role => role.id !== roleToDelete.id));
                    addError('Role deleted successfully!');
                } else {
                    const errorMessage = result.message || 'Failed to delete role';
                    addError(`Failed to delete role: ${errorMessage}`);
                }
            } else {
                addError(`Failed to delete role - HTTP error! status: ${res.status}`);
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error occurred';
            addError(`Failed to delete role: ${errorMessage}`);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
            setRoleToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setRoleToDelete(null);
    };

    const handleAddClick = () => {
        setFormData({
            roleName: '',
            description: ''
        });
        setShowAddModal(true);
    };

    const handleEditClick = (row: any) => {
        setRoleToEdit(row);
        setFormData({
            roleName: row.roleName || '',
            description: row.description || ''
        });
        setShowEditModal(true);
    };

    const handleSaveRole = async (data: Record<string, any>) => {
        setSaving(true);
        try {
            if (showEditModal && roleToEdit) {
                const res = await fetch(`${BACKEND_URL}/roles/${roleToEdit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: data.roleName,
                        description: data.description
                    })
                });
                if (res.ok) {
                    const result = await res.json();
                    if (result.success) {
                        await fetchRoles();
                        addError('Role updated successfully!');
                    } else {
                        const errorMessage = result.message || 'Failed to update role';
                        addError(`Failed to update role: ${errorMessage}`);
                    }
                } else {
                    addError(`Failed to update role - HTTP error! status: ${res.status}`);
                }
            } else {
                const res = await fetch(`${BACKEND_URL}/roles`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: data.roleName,
                        description: data.description
                    })
                });
                if (res.ok) {
                    const result = await res.json();
                    if (result.success) {
                        await fetchRoles();
                        addError('Role created successfully!');
                    } else {
                        const errorMessage = result.message || 'Failed to create role';
                        addError(`Failed to create role: ${errorMessage}`);
                    }
                } else {
                    addError(`Failed to create role - HTTP error! status: ${res.status}`);
                }
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error occurred';
            addError(`Failed to save role: ${errorMessage}`);
        } finally {
            setSaving(false);
            setShowAddModal(false);
            setShowEditModal(false);
            setRoleToEdit(null);
            setFormData({ roleName: '', description: '' });
        }
    };

    const handleCancelModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setRoleToEdit(null);
        setFormData({
            roleName: '',
            description: ''
        });
    };

    const handleManagePermissions = (row: any) => {
        navigate('/roles-permissions', { state: { role: row } });
    };

    // Form fields configuration for add role
    const addRoleFormFields = [
        {
            type: 'input' as const,
            label: 'Role Name',
            name: 'roleName',
            value: formData.roleName,
            placeholder: 'Enter role name',
            required: true,
            validation: {
                required: 'Role name is required'
            }
        },
        {
            type: 'textarea' as const,
            label: 'Description',
            name: 'description',
            value: formData.description,
            placeholder: 'Enter role description',
            required: false,
            span: { col: 1, row: 1 } // This makes the description field take full width
        }
    ];

    // Form fields configuration for edit role
    const editRoleFormFields = [
        {
            type: 'input' as const,
            label: 'Current Role',
            name: 'currentRole',
            value: roleToEdit?.roleName || '',
            placeholder: 'Current role name',
            required: true,
            onChange: (value: string) => setFormData(prev => ({ ...prev, roleName: value })),
            disabled: true
        },
        {
            type: 'dropdown' as const,
            label: 'Select New Role',
            name: 'roleName',
            value: formData.roleName,
            required: true,
            options: [
                { value: 'Admin', label: 'Admin' },
                { value: 'Moderator', label: 'Moderator' },
                { value: 'Accountant', label: 'Accountant' },
                { value: 'User', label: 'User' }
            ],
            onChange: (value: string) => setFormData(prev => ({ ...prev, roleName: value }))
        },
    ];

    // Table data for the Table component - Updated to match the image layout
    const tableData = roles.map((role) => ({
        id: role.id,
        fullName: role.users.length > 0 ? role.users[0].firstName + ' ' + role.users[0].lastName : 'N/A',
        roleName: role.name,
        client: 'GMR', // Default client as shown in the image
        users: role.users.length,
        permissions: role.permissions.map((p) => p.name).join(', '),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt || 'NA',
    }));

    // Table columns configuration - Updated to match the image
    const tableColumns = [
        { key: 'fullName', label: 'Full Name' },
        { key: 'roleName', label: 'Role Name' },
        { key: 'client', label: 'Client' },
    ];

    // Actions array for the table - With icons
    const tableActions = [
        {
            label: 'Manage Permissions',
            onClick: handleManagePermissions,
            icon: '/icons/settings.svg',
        },
        {
            label: 'Edit',
            onClick: handleEditClick,
            icon: '/icons/user-pen.svg',
        },
        {
            label: 'Delete',
            onClick: handleDeleteClick,
            icon: '/icons/delete.svg',
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section with Error Component
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'column',
                                    columns: [
                                        {
                                            name: 'Error',
                                            props: {
                                                visibleErrors: errorMessages,
                                                onRetry: retryAllAPIs,
                                                onClose: () => removeError(0), // Remove the top error
                                                showRetry: true,
                                                maxVisibleErrors: 3, // Show max 3 errors at once
                                            },
                                        },
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: 'Role Management',
                                                onBackClick: () =>
                                                    navigate('/users'),
                                                backButtonText:
                                                    'Back to UserManagment',
                                                buttonsLabel: 'Add Role',
                                                variant: 'primary',
                                                onClick: handleAddClick,
                                                showMenu: true,
                                                showDropdown: false,
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
                                                // onMenuItemClick: (
                                                //     itemId: string
                                                // ) => {
                                                //     // Removed console.log
                                                // },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Table Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'Table',
                                            props: {
                                                data: tableData,
                                                columns: tableColumns,
                                                loading: loading,
                                                emptyMessage: 'No roles found',
                                                searchable: true,
                                                pagination: true,
                                                showActions: true,
                                                actions: tableActions,
                                                onPageChange: handlePageChange,
                                                onSearch: handleSearch,
                                                serverPagination: serverPagination,
                                                onEdit: (row: any) => {
                                                    // Removed console.log
                                                    navigate(`/edit-role/${row.id}`, { state: { role: row } });
                                                },
                                                // onDelete: (row: any) => {
                                                //     // Removed console.log
                                                // },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Delete Confirmation Modal Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'Modal',
                                            props: {
                                                isOpen: showDeleteModal,
                                                onClose: handleCancelDelete,
                                                title: 'Delete Role',
                                                size: 'md',
                                                showConfirmButton: true,
                                                confirmButtonLabel: deleting ? 'Deleting...' : 'Delete Role',
                                                confirmButtonVariant: 'danger',
                                                onConfirm: handleConfirmDelete,
                                                disabled: deleting,
                                                message: `Are you sure you want to delete the role "${roleToDelete?.roleName}"?`,
                                                warningMessage: 'This action cannot be undone. All users assigned to this role will lose their permissions.',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Add Role Modal Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'Modal',
                                            props: {
                                                isOpen: showAddModal,
                                                onClose: handleCancelModal,
                                                title: 'Add New Role',
                                                size: 'lg',
                                                showCloseIcon: true,
                                                showForm: true,
                                                formFields: addRoleFormFields,
                                                onSave: (formData: Record<string, any>) => {
                                                    // Removed console.log
                                                    handleSaveRole(formData);
                                                },
                                                saveButtonLabel: saving ? 'Creating...' : 'Create Role',
                                                cancelButtonLabel: 'Cancel',
                                                cancelButtonVariant: 'secondary',
                                                confirmButtonVariant: 'primary',
                                                disabled: saving,
                                                formId: 'add-role-form',
                                                gridLayout: {
                                                    gridRows: 2,
                                                    gridColumns: 1,
                                                    gap: 'gap-4'
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                    // Edit Role Modal Section
                    {
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'Modal',
                                            props: {
                                                isOpen: showEditModal,
                                                onClose: handleCancelModal,
                                                title: 'Edit Role',
                                                size: 'lg',
                                                showForm: true,
                                                formFields: editRoleFormFields,
                                                onSave: (formData: Record<string, any>) => {
                                                    // Removed console.log
                                                    handleSaveRole(formData);
                                                },
                                                saveButtonLabel: saving ? 'Updating...' : 'Update Role',
                                                cancelButtonLabel: 'Cancel',
                                                disabled: saving,
                                                gridLayout: {
                                                    gridRows: 2,
                                                    gridColumns: 1,
                                                    gap: 'gap-4'
                                                },
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