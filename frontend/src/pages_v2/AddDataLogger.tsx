import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
import type { FormInputConfig } from '@/components/Form/types';

export default function AddDataLogger() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form inputs configuration - 6 fields in 2 rows and 3 columns
    const formInputs: FormInputConfig[] = [
        {
            name: 'dcuModemSlNo',
            type: 'text',
            placeholder: 'DCU/Modem Serial Number',
            required: true,
            row: 1,
            col: 1,
        },
        {
            name: 'hardwareVersion',
            type: 'text',
            placeholder: 'Hardware Version',
            required: true,
            row: 1,
            col: 2,
        },
        {
            name: 'firmwareVersion',
            type: 'text',
            placeholder: 'Firmware Version',
            required: true,
            row: 1,
            col: 3,
        },
        {
            name: 'mobile',
            type: 'tel',
            placeholder: 'Mobile Number',
            required: true,
            row: 2,
            col: 1,
        },
        {
            name: 'installationDate',
            type: 'date',
            placeholder: 'Installation Date',
            required: true,
            row: 2,
            col: 2,
        },
        {
            name: 'status',
            type: 'dropdown',
            placeholder: 'Select Status',
            options: [
                { value: '', label: 'Select Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'maintenance', label: 'Maintenance' },
            ],
            required: true,
            row: 2,
            col: 3,
        },
    ];

    const handleFormSubmit = async (formData: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            console.log('Saving data logger:', formData);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            console.log('Data Logger created successfully');
            navigate('/data-loggers');
        } catch (error) {
            console.error('Error creating data logger:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormCancel = () => {
        navigate('/data-loggers');
    };

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
                                                title: 'Data Loggers List',
                                                onBackClick: () => navigate('/data-loggers'),
                                                backButtonText: 'Back to Data Loggers List',
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
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Form',
                                            props: {
                                                inputs: formInputs,
                                                onSubmit: handleFormSubmit,
                                                submitLabel: isSubmitting ? 'Saving...' : 'Save',
                                                cancelLabel: 'Cancel',
                                                showFormActions: true,
                                                formContainerClasses: 'bg-transparent',
                                                submitAction: () => {
                                                    // This will be handled by the form's internal submit
                                                },
                                                cancelAction: handleFormCancel,
                                                gridLayout: {
                                                    gridRows: 2,
                                                    gridColumns: 3,
                                                    gap: 'gap-4',
                                                    className: 'w-full',
                                                },
                                                formBackground: 'bg-transparent',
                                                className: 'w-full',
                                                showLabels: false,
                                                showBorders: false,
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