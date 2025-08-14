import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import Page from '@/components/global/PageC';
import type { FormInputConfig } from '@/components/Form/types';

export default function AddTicket() {
    const navigate = useNavigate();

    const priorityOptions = [
        { value: '', label: 'Select Priority' },
        { value: 'Low', label: 'Low Priority' },
        { value: 'Medium', label: 'Medium Priority' },
        { value: 'High', label: 'High Priority' },
        { value: 'Critical', label: 'Critical Priority' },
    ];

    const categoryOptions = [
        { value: '', label: 'Select Category' },
        { value: 'General', label: 'General Inquiry' },
        { value: 'Billing', label: 'Billing Issue' },
        { value: 'Technical', label: 'Technical Problem' },
        { value: 'Service', label: 'Service Request' },
        { value: 'Account', label: 'Account Management' },
        { value: 'Payment', label: 'Payment Issue' },
        { value: 'Meter', label: 'Meter Reading' },
        { value: 'Connection', label: 'Connection/Disconnection' },
    ];

    // Form inputs configuration matching the image layout
    const formInputs: FormInputConfig[] = [
        // Row 1: 3 inputs
        {
            name: 'DTRID',
            type: 'text',
            label: 'DTR ID',
            placeholder: 'Enter DTR ID',
            required: true,
            row: 1,
            col: 1,
        },
        {
            name: 'Feeder Number',
            type: 'text',
            label: 'Feeder Number',
            placeholder: 'Enter Feeder Number',
            required: true,
            row: 1,
            col: 2,
        },
        {
            name: 'Location',
            type: 'text',
            label: 'Location',
            placeholder: 'Enter Location',
            required: true,
            row: 1,
            col: 3,
        },
        // Row 2: 2 inputs + 1 dropdown
        {
            name: 'Priority',
            type: 'dropdown',
            label: 'Priority',
            options: priorityOptions,
            required: true,
            row: 2,
            col: 1,
        },
        {
            name: 'category',
            type: 'dropdown',
            label: 'Category',
            options: categoryOptions,
            required: true,
            row: 2,
            col: 2,
        },
        {
            name: 'subject',
            type: 'text',
            label: 'Subject',
            placeholder: 'Enter Ticket Subject',
            required: true,
            row: 2,
            col: 3,
        },
        // // Row 3: Full dropdown
        // {
        //     name: 'category',
        //     type: 'dropdown',
        //     label: 'Category',
        //     options: categoryOptions,
        //     required: true,
        //     row: 3,
        //     col: 1,
        //     colSpan: 3,
        // },
        // // Row 4: Full text input
        // {
        //     name: 'subject',
        //     type: 'text',
        //     label: 'Subject',
        //     placeholder: 'Enter Ticket Subject',
        //     required: true,

        //     row: 4,
        //     col: 1,
        //     colSpan: 3,
        // },
        // Row 5: Full textarea
        {
            name: 'description',
            type: 'textareafield',
            label: 'Description',
            placeholder: 'Enter detailed description of the issue',
            required: true,
            
            row: 5,
            col: 1,
            colSpan: 3,
        },
        // Row 6: File upload
        {
            name: 'attachments',
            type: 'file',
            label: 'Attachments',
            required: false,
            row: 6,
            col: 1,
            colSpan: 3,
        },
    ];

    const handleFormSubmit = async (formData: Record<string, any>) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Ticket created:', formData);

            // Navigate back after 2 seconds
            setTimeout(() => {
                navigate('/tickets');
            }, 2000);
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    const handleFormCancel = () => {
        navigate('/tickets');
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
                                                title: 'Create New Ticket',
                                                onBackClick: () =>
                                                    navigate('/tickets'),
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
                                                submitLabel: 'Submit',
                                                cancelLabel: 'Cancel',
                                                showFormActions: true,
                                                submitAction: () => {
                                                    // This will be handled by the form's internal submit
                                                },
                                                cancelAction: handleFormCancel,
                                                gridLayout: {
                                                    gridRows: 6,
                                                    gridColumns: 3,
                                                    gap: 'gap-4',
                                                    className: 'w-full',
                                                },
                                                formBackground:
                                                    'bg-white dark:bg-gray-800 border border-primary-border dark:border-gray-700 p-4 rounded-2xl ',
                                                className: 'w-full',
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
