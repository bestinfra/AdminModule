import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { FormInputConfig } from '@components/Form/types';

export default function AddRole() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form inputs configuration - only 2 fields as shown in the image
    const formInputs: FormInputConfig[] = [
        {
            name: 'roleName',
            type: 'text',
            placeholder: 'Enter role name',
            required: true,
            row: 1,
            col: 1,
            colSpan: 1,
            className: 'w-full px-3 py-2 rounded-md',
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
            className: 'w-full px-3 py-2 rounded-md',
        },
    ];

    const handleFormSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            console.log('Saving role data:', formData);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            console.log('Role created successfully');
            navigate('/role-management');
        } catch (error) {
            console.error('Error creating role:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormCancel = () => {
        navigate('/role-management');
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page
                sections={[
                    // Page Header Section with Add Role button
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
                                                title: 'Add Role',
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
                                                        disabled: isSubmitting,
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
                            gap: 'gap-6',
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
                                                 submitLabel: isSubmitting ? 'Saving...' : 'Create Role',
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
                                                //  formBackground: 'bg-white',
                                                //  className: 'max-w-2xl mx-auto w-full p-6 space-y-6',
                                                //  padding: 'p-6',
                                                //  actionsClassName: 'flex justify-center gap-4 pt-4',
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