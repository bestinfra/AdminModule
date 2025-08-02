import { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { FormInputConfig } from '@/components/Form/types';
import BACKEND_URL from '../config';

export default function EditRole() {
    const navigate = useNavigate();
    const { roleId } = useParams<{ roleId: string }>();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [initialFormData, setInitialFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchRoleData();
    }, [roleId]);

    const fetchRoleData = async () => {
        try {
            setLoading(true);
            
            // Check if we have role data from navigation state
            if (location.state?.role) {
                const roleData = location.state.role;
                setInitialFormData({
                    name: roleData.roleName || roleData.name || '',
                    description: roleData.description || ''
                });
                return;
            }

            // Fetch from API if no state data
            if (roleId) {
                const res = await fetch(`${BACKEND_URL}/roles/${roleId}`);
                const data = await res.json();
                if (data.success) {
                    setInitialFormData({
                        name: data.data.name || '',
                        description: data.data.description || ''
                    });
                } else {
                    throw new Error(data.message || 'Failed to fetch role');
                }
            }
        } catch (err) {
            console.error('Error fetching role:', err);
            // Fallback to demo data
            const demoRole = {
                id: parseInt(roleId || '1'),
                name: 'GMR',
                description: 'Administrative role for GMR operations',
                users: [
                    {
                        id: 1,
                        username: 'gmr',
                        firstName: 'GMR',
                        lastName: '',
                        email: 'gmr@example.com',
                        isActive: true,
                    }
                ],
                permissions: [
                    { id: 1, name: 'manage_users', description: 'Can manage users' },
                    { id: 2, name: 'manage_roles', description: 'Can manage roles' },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setInitialFormData({
                name: demoRole.name,
                description: demoRole.description || ''
            });
        } finally {
            setLoading(false);
        }
    };

    // Form inputs configuration
    const formInputs: FormInputConfig[] = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Enter role name',
            required: true,
            row: 1,
            col: 1,
            colSpan: 1,
            defaultValue: initialFormData.name,
            className: 'w-full px-3 py-2  rounded-md',
        },
        {
            name: 'description',
            type: 'textareafield',
            label: 'Description',
            placeholder: 'Enter role description',
            required: false,
            row: 2,
            col: 1,
            colSpan: 1,
            defaultValue: initialFormData.description,
            className: 'w-full px-3 py-2 rounded-md',
        },
    ];

    const handleFormSubmit = async (formData: Record<string, any>) => {
        setSaving(true);
        try {
            const res = await fetch(`${BACKEND_URL}/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await res.json();
            if (data.success) {
                console.log('Role updated successfully');
                navigate('/role-management');
            } else {
                throw new Error(data.message || 'Failed to update role');
            }
        } catch (err) {
            console.error('Error updating role:', err);
            // For demo purposes, just navigate back
            navigate('/role-management');
        } finally {
            setSaving(false);
        }
    };

    const handleFormCancel = () => {
        navigate('/role-management');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <Page
            sections={[
                // Page Header Section with Add Role button
                {
                    layout: {
                        type: 'row' as const,
                        gap: 'gap-4',
                        rows: [
                            {
                                layout: 'row' as const,
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: 'Edit Role',
                                            onBackClick: () => navigate('/role-management'),
                                            backButtonText: 'Back to Role Management',
                                            showMenu: false,
                                            showDropdown: false,
                                            actions: [
                                                {
                                                    label: 'Add Role',
                                                    variant: 'primary',
                                                    onClick: () => {
                                                        // This will trigger form submission
                                                        const form = document.querySelector('form');
                                                        if (form) {
                                                            form.dispatchEvent(new Event('submit', { bubbles: true }));
                                                        }
                                                    },
                                                    className: 'bg-green-600 hover:bg-green-700 text-white',
                                                    disabled: saving,
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                // Form Section
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        gap: 'gap-4',
                        rows: [
                            {
                                layout: 'grid' as const,
                                gridColumns: 1,
                                gap: 'gap-3',
                                columns: [
                                    {
                                         name: 'Form',
                                         props: {
                                             inputs: formInputs,
                                             onSubmit: handleFormSubmit,
                                             submitLabel: saving ? 'Saving...' : 'Update Role',
                                             cancelLabel: 'Cancel',
                                             showFormActions: true,
                                             submitAction: () => {
                                                 // This will be handled by the form's internal submit
                                             },
                                             cancelAction: handleFormCancel,
                                             gridLayout: {
                                                 gridRows: 2,
                                                 gridColumns: 1,
                                                 gap: 'gap-1',
                                                 className: 'w-full',
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