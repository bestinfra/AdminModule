import { useState, Suspense, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { FormInputConfig } from '@components/Form/types';

const roles = ['Admin', 'Manager', 'User'];
const parentRoles = ['None', 'Super Admin', 'Admin', 'Manager'];

export default function EditUser() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                // Try to get user data from navigation state first
                if (location.state?.user) {
                    setUserData(location.state.user);
                } else if (userId) {
                    // Fetch from API if not in navigation state
                    const response = await fetch(`/api/users/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Fallback demo data
                setUserData({
                    fullName: 'John Doe',
                    email: 'john.doe@email.com',
                    phone: '+1-555-0101',
                    role: 'admin',
                    parentRole: 'super_admin',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, location.state]);

    // Form inputs configuration
    const formInputs: FormInputConfig[] = [
        {
            name: 'fullName',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter full name',
            required: true,
            row: 1,
            col: 1,
            defaultValue: userData?.fullName || '',
        },
        {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter email address',
            required: true,
            row: 1,
            col: 2,
            defaultValue: userData?.email || '',
        },
        {
            name: 'phone',
            type: 'tel',
            label: 'Phone Number',
            placeholder: 'Enter phone number',
            required: true,
            row: 2,
            col: 1,
            defaultValue: userData?.phone || '',
        },
        {
            name: 'password',
            type: 'password',
            label: 'New Password',
            placeholder: 'Enter new password (leave blank to keep current)',
            required: false,
            row: 2,
            col: 2,
        },
        {
            name: 'role',
            type: 'dropdown',
            label: 'User Role',
            placeholder: 'Select User Role',
            options: [
                { value: '', label: 'Select Role' },
                ...roles.map((role) => ({
                    value: role.toLowerCase(),
                    label: role,
                })),
            ],
            required: true,
            row: 3,
            col: 1,
            defaultValue: userData?.role || '',
        },
        {
            name: 'parentRole',
            type: 'dropdown',
            label: 'Parent Role',
            placeholder: 'Select Parent Role',
            options: [
                { value: '', label: 'Select Parent Role' },
                ...parentRoles.map((role) => ({
                    value: role.toLowerCase().replace(' ', '_'),
                    label: role,
                })),
            ],
            required: false,
            row: 3,
            col: 2,
            defaultValue: userData?.parentRole || '',
        },
    ];

    const handleFormSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            console.log('Updating user data:', formData);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            console.log('User updated successfully');
            navigate('/users');
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormCancel = () => {
        navigate('/users');
    };

    if (loading) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading user data...</div>
                </div>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section
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
                                                title: 'Edit User',
                                                onBackClick: () => navigate('/users'),
                                                backButtonText: 'Back to Users',
                                                showMenu: false,
                                                showDropdown: false,
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
                                                 submitLabel: isSubmitting ? 'Updating...' : 'Update User',
                                                 cancelLabel: 'Cancel',
                                                 showFormActions: true,
                                                 submitAction: () => {
                                                     // This will be handled by the form's internal submit
                                                 },
                                                 cancelAction: handleFormCancel,
                                                 gridLayout: {
                                                     gridRows: 3,
                                                     gridColumns: 2,
                                                     gap: 'gap-3',
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