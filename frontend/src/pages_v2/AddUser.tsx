import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { FormInputConfig } from '@/components/Form/types';

const roles = ['Admin', 'Manager', 'User'];
const parentRoles = ['None', 'Super Admin', 'Admin', 'Manager'];

export default function AddUser() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form inputs configuration
    const formInputs: FormInputConfig[] = [
        {
            name: 'fullName',
            type: 'text',
            placeholder: 'Enter full name',
            required: true,
            row: 1,
            col: 1,
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Enter email address',
            required: true,
            row: 1,
            col: 2,
        },
        {
            name: 'phone',
            type: 'tel',
            placeholder: 'Enter phone number',
            required: true,
            row: 2,
            col: 1,
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Enter password',
            required: true,
            row: 2,
            col: 2,
        },
        {
            name: 'role',
            type: 'dropdown',
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
        },
        {
            name: 'parentRole',
            type: 'dropdown',
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
        },
    ];

    const handleFormSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            console.log('Saving user data:', formData);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            console.log('User created successfully');
            navigate('/users');
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormCancel = () => {
        navigate('/users');
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section
                    {
                        layout: {
                            type: 'row' as const,
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    columns: [
                                        {
                                            name: 'PageHeader',
                                            props: {
                                                title: 'Create User',
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
                            gap: 'gap-6',
                            rows: [
                                {
                                    layout: 'grid' as const,
                                    gridColumns: 1,
                                    gap: 'gap-6',
                                    columns: [
                                        {
                                            name: 'Form',
                                            props: {
                                                inputs: formInputs,
                                                onSubmit: handleFormSubmit,
                                                submitLabel: isSubmitting ? 'Saving...' : 'Save',
                                                cancelLabel: 'Cancel',
                                                showFormActions: true,
                                                submitAction: () => {
                                                    // This will be handled by the form's internal submit
                                                },
                                                cancelAction: handleFormCancel,
                                                gridLayout: {
                                                    gridRows: 3,
                                                    gridColumns: 2,
                                                    gap: 'gap-6',
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