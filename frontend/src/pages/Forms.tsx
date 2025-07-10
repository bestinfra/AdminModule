import React, { useState } from 'react';
import Form from '../components/forms/Form';
import type { FormInputConfig } from '../components/forms/types';
import Page from '../components/global/Page';
import type { Section } from '../components/global/Page';
import { 
    createHeaderComponent, 
    createActionsComponent, 
    createSidebarStatsComponent,
    createFooterComponent
} from '../components/global/PageComponents';

const Forms: React.FC = () => {
    const [formResults, setFormResults] = useState<Record<string, any>>({});

    // Basic form inputs
    const basicFormInputs: FormInputConfig[] = [
        {
            name: 'firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
            validation: {
                minLength: 2,
                maxLength: 50
            }
        },
        {
            name: 'lastName',
            type: 'text',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            required: true,
            validation: {
                minLength: 2,
                maxLength: 50
            }
        },
        {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true,
            validation: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            }
        },
        {
            name: 'phone',
            type: 'text',
            label: 'Phone Number',
            placeholder: 'Enter your phone number',
            required: false,
            validation: {
                pattern: /^[\+]?[1-9][\d]{0,15}$/
            }
        },
        {
            name: 'age',
            type: 'number',
            label: 'Age',
            placeholder: 'Enter your age',
            required: false,
            validation: {
                min: 0,
                max: 120
            }
        },
        {
            name: 'birthDate',
            type: 'date',
            label: 'Birth Date',
            required: false
        }
    ];

    // Advanced form inputs
    const advancedFormInputs: FormInputConfig[] = [
        {
            name: 'department',
            type: 'select',
            label: 'Department',
            required: true,
            options: [
                { value: 'it', label: 'Information Technology' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'finance', label: 'Finance' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
                { value: 'operations', label: 'Operations' }
            ]
        },
        {
            name: 'role',
            type: 'select',
            label: 'Role',
            required: true,
            options: [
                { value: 'admin', label: 'Administrator' },
                { value: 'manager', label: 'Manager' },
                { value: 'employee', label: 'Employee' },
                { value: 'intern', label: 'Intern' }
            ]
        },
        {
            name: 'bio',
            type: 'textarea',
            label: 'Bio',
            placeholder: 'Tell us about yourself...',
            required: false,
            validation: {
                maxLength: 500
            },
            colSpan: 2
        },
        {
            name: 'avatar',
            type: 'file',
            label: 'Profile Picture',
            required: false,
            colSpan: 2
        },
        {
            name: 'newsletter',
            type: 'checkbox',
            label: 'Subscribe to Newsletter',
            required: false,
            description: 'Receive updates about new features and announcements'
        },
        {
            name: 'terms',
            type: 'checkbox',
            label: 'I agree to the Terms and Conditions',
            required: true,
            description: 'You must agree to continue'
        }
    ];

    // Contact form inputs
    const contactFormInputs: FormInputConfig[] = [
        {
            name: 'name',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
            validation: {
                minLength: 3,
                maxLength: 100
            }
        },
        {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email address',
            required: true
        },
        {
            name: 'subject',
            type: 'text',
            label: 'Subject',
            placeholder: 'What is this about?',
            required: true,
            validation: {
                minLength: 5,
                maxLength: 200
            }
        },
        {
            name: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Enter your message here...',
            required: true,
            validation: {
                minLength: 10,
                maxLength: 1000
            },
            colSpan: 2
        },
        {
            name: 'priority',
            type: 'select',
            label: 'Priority',
            required: true,
            options: [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
            ]
        },
        {
            name: 'attachment',
            type: 'file',
            label: 'Attachment',
            required: false,
            description: 'Upload any relevant files (max 10MB)'
        }
    ];

    const handleBasicFormSubmit = (data: Record<string, any>) => {
        setFormResults(prev => ({ ...prev, basic: data }));
    };

    const handleAdvancedFormSubmit = (data: Record<string, any>) => {
        setFormResults(prev => ({ ...prev, advanced: data }));
    };

    const handleContactFormSubmit = (data: Record<string, any>) => {
        setFormResults(prev => ({ ...prev, contact: data }));
    };

    // Header component
    const headerComponent = createHeaderComponent(
        'Form Components Showcase',
        'Explore all available form input types and configurations',
        '3 form types available'
    );

    // Actions component
    const actionsComponent = createActionsComponent([
        { label: 'Export Forms', onClick: () => console.log('Exporting forms...'), variant: 'outline' },
        { label: 'Documentation', onClick: () => console.log('Opening documentation...'), variant: 'outline' },
        { label: 'Settings', onClick: () => console.log('Opening settings...'), variant: 'outline' }
    ]);

    // Sidebar stats component
    const sidebarComponent = createSidebarStatsComponent([
        {
            title: 'Form Types',
            value: '3',
            subtitle1: 'Basic, Advanced, Contact',
            subtitle2: 'All input types covered',
            comparisonValue: 0
        },
        {
            title: 'Input Types',
            value: '12',
            subtitle1: 'Different input types',
            subtitle2: 'Text, email, file, etc.',
            comparisonValue: 0
        },
        {
            title: 'Validation Rules',
            value: '8',
            subtitle1: 'Active validations',
            subtitle2: 'Pattern, length, range',
            comparisonValue: 0
        }
    ]);

    // Footer component
    const footerComponent = createFooterComponent({
        id: 'Forms Showcase ID: FORMS-001',
        version: '2.1.0',
        supportLink: '#'
    });

    // Basic Form Section
    const basicFormSection: Section = {
        id: 'basic-form',
        component: (
            <div>
                <h2 className="text-xl font-semibold text-[var(--color-main)] dark:text-[var(--color-surface)] mb-2">
                    Basic Form Inputs
                </h2>
                <p className="text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mb-4">
                    Common form inputs with validation
                </p>
                <Form
                    inputs={basicFormInputs}
                    onSubmit={handleBasicFormSubmit}
                    submitLabel="Submit Basic Form"
                    cancelLabel="Reset"
                    showCancel={true}
                    layout="grid"
                    gridCols={3}
                    variant="default"
                    title="Basic Information"
                    subtitle="Please fill in your basic details"
                />
                {formResults.basic && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Form Results:</h3>
                        <pre className="text-sm text-green-700 dark:text-green-300 overflow-auto">
                            {JSON.stringify(formResults.basic, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        )
    };

    // Advanced Form Section
    const advancedFormSection: Section = {
        id: 'advanced-form',
        component: (
            <div>
                <h2 className="text-xl font-semibold text-[var(--color-main)] dark:text-[var(--color-surface)] mb-2">
                    Advanced Form Inputs
                </h2>
                <p className="text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mb-4">
                    Complex inputs with file uploads, checkboxes, and multi-column layout
                </p>
                <Form
                    inputs={advancedFormInputs}
                    onSubmit={handleAdvancedFormSubmit}
                    submitLabel="Submit Advanced Form"
                    cancelLabel="Reset"
                    showCancel={true}
                    layout="grid"
                    gridCols={3}
                    variant="default"
                    title="Advanced Profile"
                    subtitle="Complete your profile information"
                />
                {formResults.advanced && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Form Results:</h3>
                        <pre className="text-sm text-blue-700 dark:text-blue-300 overflow-auto">
                            {JSON.stringify(formResults.advanced, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        )
    };

    // Contact Form Section
    const contactFormSection: Section = {
        id: 'contact-form',
        component: (
            <div>
                <h2 className="text-xl font-semibold text-[var(--color-main)] dark:text-[var(--color-surface)] mb-2">
                    Contact Form
                </h2>
                <p className="text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mb-4">
                    A complete contact form with all input types
                </p>
                <Form
                    inputs={contactFormInputs}
                    onSubmit={handleContactFormSubmit}
                    submitLabel="Send Message"
                    cancelLabel="Clear"
                    showCancel={true}
                    layout="grid"
                    gridCols={2}
                    variant="default"
                    title="Contact Us"
                    subtitle="We'd love to hear from you"
                />
                {formResults.contact && (
                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Form Results:</h3>
                        <pre className="text-sm text-purple-700 dark:text-purple-300 overflow-auto">
                            {JSON.stringify(formResults.contact, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        )
    };

    return (
        <Page
            layout="single-column"
            sections={[basicFormSection, advancedFormSection, contactFormSection]}
            header={headerComponent}
            actions={actionsComponent}
            sidebar={sidebarComponent}
            footer={footerComponent}
            sidebarPosition="right"
            className="space-y-12"
        />
    );
};

export default Forms; 