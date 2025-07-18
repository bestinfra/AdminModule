import React, { useState } from 'react';
import { Form } from '@components/Form';
import type { FormInputConfig } from '@components/Form';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';

type FormsProps = {
    basicFormInputs: FormInputConfig[];
    advancedFormInputs: FormInputConfig[];
    contactFormInputs: FormInputConfig[];
    headerComponent: React.ReactNode;
    actionsComponent?: React.ReactNode;
    sidebarComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    basicFormSectionTitle?: string;
    basicFormSectionSubtitle?: string;
    advancedFormSectionTitle?: string;
    advancedFormSectionSubtitle?: string;
    contactFormSectionTitle?: string;
    contactFormSectionSubtitle?: string;
    basicFormProps?: Partial<React.ComponentProps<typeof Form>>;
    advancedFormProps?: Partial<React.ComponentProps<typeof Form>>;
    contactFormProps?: Partial<React.ComponentProps<typeof Form>>;
    pageProps?: Partial<React.ComponentProps<typeof Page>>;
};

const Forms: React.FC<FormsProps> = ({
    basicFormInputs,
    advancedFormInputs,
    contactFormInputs,
    headerComponent,
    actionsComponent,
    sidebarComponent,
    footerComponent,
    basicFormSectionTitle = 'Basic Form Inputs',
    basicFormSectionSubtitle = 'Common form inputs with validation',
    advancedFormSectionTitle = 'Advanced Form Inputs',
    advancedFormSectionSubtitle = 'Complex inputs with file uploads, checkboxes, and multi-column layout',
    contactFormSectionTitle = 'Contact Form',
    contactFormSectionSubtitle = 'A complete contact form with all input types',
    basicFormProps = {},
    advancedFormProps = {},
    contactFormProps = {},
    pageProps = {},
}) => {
    const [formResults, setFormResults] = useState<Record<string, any>>({});

    const handleBasicFormSubmit = (data: Record<string, any>) => {
        setFormResults(prev => ({ ...prev, basic: data }));
    };

    const handleAdvancedFormSubmit = (data: Record<string, any>) => {
        setFormResults(prev => ({ ...prev, advanced: data }));
    };

    const handleContactFormSubmit = (data: Record<string, any>) => {
        setFormResults(prev => ({ ...prev, contact: data }));
    };

    const basicFormSection: Section = {
        id: 'basic-form',
        component: (
            <div>
                <h2 className="text-xl font-semibold text-text-primary dark:text-surface mb-2">
                    {basicFormSectionTitle}
                </h2>
                <p className="text-text-secondary dark:text-neutral-light mb-4">
                    {basicFormSectionSubtitle}
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
                    {...basicFormProps}
                />
                {formResults.basic && (
                    <div className="mt-4 p-4 bg-secondary-light rounded-lg">
                        <h3 className="font-semibold text-positive mb-2">Form Results:</h3>
                        <pre className="text-sm text-positive overflow-auto">
                            {JSON.stringify(formResults.basic, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        )
    };

    const advancedFormSection: Section = {
        id: 'advanced-form',
        component: (
            <div>
                <h2 className="text-xl font-semibold text-text-primary dark:text-surface mb-2">
                    {advancedFormSectionTitle}
                </h2>
                <p className="text-text-secondary dark:text-neutral-light mb-4">
                    {advancedFormSectionSubtitle}
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
                    {...advancedFormProps}
                />
                {formResults.advanced && (
                    <div className="mt-4 p-4 bg-primary-lightest rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Form Results:</h3>
                        <pre className="text-sm text-primary overflow-auto">
                            {JSON.stringify(formResults.advanced, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        )
    };

    const contactFormSection: Section = {
        id: 'contact-form',
        component: (
            <div>
                <h2 className="text-xl font-semibold text-text-primary dark:text-surface mb-2">
                    {contactFormSectionTitle}
                </h2>
                <p className="text-text-secondary dark:text-neutral-light mb-4">
                    {contactFormSectionSubtitle}
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
                    {...contactFormProps}
                />
                {formResults.contact && (
                    <div className="mt-4 p-4 bg-accent-light rounded-lg">
                        <h3 className="font-semibold text-accent mb-2">Form Results:</h3>
                        <pre className="text-sm text-accent overflow-auto">
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
            {...pageProps}
        />
    );
};

export default Forms;
