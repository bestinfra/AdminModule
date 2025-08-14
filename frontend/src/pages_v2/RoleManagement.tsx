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
                throw new Error(data.message || 'Failed to fetch roles');
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
            // DEMO DATA FALLBACK - Updated to match the image content
            if (roles.length === 0) {
                setRoles([
                    {
                        id: 1,
                        name: 'admin',
                        users: [
                            {
                                id: 1,
                                username: 'gmr',
                                firstName: 'GMR',
                                lastName: '',
                                email: 'gmr@example.com',
                                isActive: true,
                            },
                        ],
                        permissions: [
                            { id: 1, name: 'manage_users', description: 'Can manage users' },
                            { id: 2, name: 'manage_roles', description: 'Can manage roles' },
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
                                username: 'lecs',
                                firstName: 'LECS',
                                lastName: '',
                                email: 'lecs@example.com',
                                isActive: true,
                            },
                        ],
                        permissions: [
                            { id: 3, name: 'view_dashboard', description: 'Can view dashboard' },
                        ],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    {
                        id: 3,
                        name: 'Accountant',
                        users: [
                            {
                                id: 3,
                                username: 'airborne',
                                firstName: 'AIRBORNE',
                                lastName: '',
                                email: 'airborne@example.com',
                                isActive: true,
                            },
                        ],
                        permissions: [
                            { id: 4, name: 'view_reports', description: 'Can view reports' },
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
        
        try {
            console.log('Deleting role:', roleToDelete.id);
            // Here you would make the actual API call to delete the role
            // const res = await fetch(`${BACKEND_URL}/roles/${roleToDelete.id}`, {
            //     method: 'DELETE',
            // });
            // if (res.ok) {
            //     // Remove from local state
            //     setRoles(roles.filter(role => role.id !== roleToDelete.id));
            // }
            
            // For demo purposes, just remove from local state
            setRoles(roles.filter(role => role.id !== roleToDelete.id));
        } catch (error) {
            console.error('Error deleting role:', error);
        } finally {
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

    const handleSaveRole = async (data: any) => {
        try {
            if (showEditModal && roleToEdit) {
                // Update existing role
                console.log('Updating role:', roleToEdit.id, data);
                // Here you would make the actual API call to update the role
                // const res = await fetch(`${BACKEND_URL}/roles/${roleToEdit.id}`, {
                //     method: 'PUT',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                
                // For demo purposes, update local state
                setRoles(roles.map(role => 
                    role.id === roleToEdit.id 
                        ? { ...role, name: data.roleName, description: data.description }
                        : role
                ));
            } else {
                // Create new role
                console.log('Creating new role:', data);
                // Here you would make the actual API call to create the role
                // const res = await fetch(`${BACKEND_URL}/roles`, {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                
                // For demo purposes, add to local state
                const newRole = {
                    id: Math.max(...roles.map(r => r.id)) + 1,
                    name: data.roleName,
                    users: [],
                    permissions: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setRoles([...roles, newRole]);
            }
        } catch (error) {
            console.error('Error saving role:', error);
        } finally {
            setShowAddModal(false);
            setShowEditModal(false);
            setRoleToEdit(null);
            setFormData({
                roleName: '',
                description: ''
            });
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
            onChange: (value: string) => setFormData(prev => ({ ...prev, roleName: value }))
        },
        {
            type: 'textarea' as const,
            label: 'Description',
            name: 'description',
            value: formData.description,
            placeholder: 'Enter role description',
            required: false,
            onChange: (value: string) => setFormData(prev => ({ ...prev, description: value }))
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
                    // Page Header Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'row',
                                    columns: [
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
                                                    console.log('Edit clicked for:', row);
                                                    navigate(`/edit-role/${row.id}`, { state: { role: row } });
                                                },
                                                onDelete: (row: any) => {
                                                    console.log('Delete clicked for:', row);
                                                },
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
                                                confirmButtonLabel: 'Delete Role',
                                                confirmButtonVariant: 'danger',
                                                onConfirm: handleConfirmDelete,
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
                                                showForm: true,
                                                formFields: addRoleFormFields,
                                                onSave: handleSaveRole,
                                                saveButtonLabel: 'Create Role',
                                                cancelButtonLabel: 'Cancel',
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
                                                onSave: handleSaveRole,
                                                saveButtonLabel: 'Update Role',
                                                cancelButtonLabel: 'Cancel',
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
