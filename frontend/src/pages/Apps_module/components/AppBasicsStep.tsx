import React, { useEffect, useRef } from 'react';
import FormInput from '../../../components/forms/FormInput';
import Dropdown from '../../../components/global/Dropdown';
import Button from '../../../components/global/Button';
import type { FormInputValue } from '../../../components/forms/types';

interface AppBasicsStepProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
  onArrayChange: (name: string, value: any) => void;
  onNext: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AppBasicsStep: React.FC<AppBasicsStepProps> = ({ formData, errors, onInputChange, onArrayChange, onNext }) => {

    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    // Auto-generate subdomain from app name
    useEffect(() => {
        if (formData.appName) {
            const generated = formData.appName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            if (!formData.subdomain) {
                onInputChange({ target: { name: 'subdomain', value: generated } });
            }
        }
    }, [formData.appName]);

    const handleFormInputChange = (name: string, value: FormInputValue) => {
        onInputChange({ target: { name, value } } as any);
    };

    const handleFormInputBlur = () => {
        // Handle blur if needed
    };

    const categoryOptions = [
        { value: 'electricity', label: 'Electricity' },
        { value: 'dg', label: 'DG (Diesel Generator)' },
        { value: 'solar', label: 'Solar' },
        { value: 'gas', label: 'Gas' },
        { value: 'water', label: 'Water' },
    ];

    const tariffPlanOptions = [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'agricultural', label: 'Agricultural' },
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'postpaid', label: 'Postpaid' },
    ];

    const countryOptions = [
        { value: 'india', label: 'India' },
        { value: 'uae', label: 'United Arab Emirates' },
        { value: 'usa', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'canada', label: 'Canada' },
        { value: 'australia', label: 'Australia' },
    ];

    const stateOptions: Record<string, { value: string; label: string }[]> = {
        india: [
            { value: 'maharashtra', label: 'Maharashtra' },
            { value: 'karnataka', label: 'Karnataka' },
            { value: 'tamil-nadu', label: 'Tamil Nadu' },
            { value: 'delhi', label: 'Delhi' },
            { value: 'gujarat', label: 'Gujarat' },
        ],
        uae: [
            { value: 'dubai', label: 'Dubai' },
            { value: 'abu-dhabi', label: 'Abu Dhabi' },
            { value: 'sharjah', label: 'Sharjah' },
            { value: 'ajman', label: 'Ajman' },
        ],
    };

    const cityOptions: Record<string, { value: string; label: string }[]> = {
        'maharashtra': [
            { value: 'mumbai', label: 'Mumbai' },
            { value: 'pune', label: 'Pune' },
            { value: 'nagpur', label: 'Nagpur' },
        ],
        'dubai': [
            { value: 'dubai-city', label: 'Dubai City' },
            { value: 'jebel-ali', label: 'Jebel Ali' },
        ],
    };

    // Unified Dropdown handler
    const handleDropdownChange = (e: { target: { name: string; value: string | string[] } }) => {
        // Multi-select fields
        if (e.target.name === 'categories' || e.target.name === 'tariffPlans') {
            onArrayChange(e.target.name, e.target.value);
        } else if (e.target.name === 'country') {
            onInputChange(e);
            onInputChange({ target: { name: 'state', value: '' } });
            onInputChange({ target: { name: 'city', value: '' } });
        } else if (e.target.name === 'state') {
            onInputChange(e);
            onInputChange({ target: { name: 'city', value: '' } });
        } else {
            onInputChange(e);
        }
    };

    return (
        <div className='    '>
            {/* <h2 className="text-main dark:text-white mb-1">App Creation Form</h2>
            <h3 className="text-gray-600 dark:text-gray-300 mb-6">Configure your application settings and basic information</h3> */}
            <form className="space-y-6" onSubmit={onNext} action="#" method="post" noValidate>
                <FormInput
                    input={{
                        name: 'appName',
                        type: 'text',
                        label: 'App Name',
                        placeholder: 'Enter your app name',
                        required: true
                    }}
                    value={formData.appName}
                    error={errors.appName}
                    showError={!!errors.appName}
                    disabled={false}
                    onInputChange={handleFormInputChange}
                    onInputBlur={handleFormInputBlur}
                    fileInputRefs={fileInputRefs}
                />
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Dropdown
                            name="country"
                            value={formData.country}
                            onChange={handleDropdownChange}
                            options={countryOptions}
                            placeholder="Select country"
                            error={errors.country}
                        />
                    </div>
                    <div className="flex-1">
                        <Dropdown
                            name="state"
                            value={formData.state}
                            onChange={handleDropdownChange}
                            options={stateOptions[formData.country] || []}
                            placeholder="Select state"
                            disabled={!formData.country}
                            error={errors.state}
                        />
                    </div>
                </div>
                <Dropdown
                    name="city"
                    value={formData.city}
                    onChange={handleDropdownChange}
                    options={cityOptions[formData.state] || []}
                    placeholder="Select city"
                    disabled={!formData.state}
                    error={errors.city}
                />
                <div>
                    {/* <h2 className="block  text-main dark:text-white mb-1">Categories</h2>
                    <h3 className="text-md text-gray-500 mb-2">Select at least one category that applies to your app</h3> */}
                    <Dropdown
                        name="categories"
                        value={formData.categories}
                        onChange={handleDropdownChange}
                        options={categoryOptions}
                        placeholder="Select categories"
                        isMultiSelect={true}
                        error={errors.categories}
                    />
                </div>
                <FormInput
                    input={{
                        name: 'subdomain',
                        type: 'text',
                        label: 'Subdomain',
                        placeholder: 'Enter subdomain',
                        required: true
                    }}
                    value={formData.subdomain}
                    error={errors.subdomain}
                    showError={!!errors.subdomain}
                    disabled={false}
                    onInputChange={handleFormInputChange}
                    onInputBlur={handleFormInputBlur}
                    fileInputRefs={fileInputRefs}
                />
                {/* <p className="text-xs text-gray-500 mt-1">This will be your app's URL: {subdomainPreview ? `${subdomainPreview}.yourdomain.com` : 'yourdomain.com'}<br/>Only lowercase letters, numbers, and hyphens are allowed</p> */}
                <div>
                    {/* <h2 className="block text-lg font-medium text-main dark:text-white mb-1">Tariff Plans</h2>
                    <p className="text-md text-gray-500 mb-2">Select the tariff plans your app will support</p> */}
                    <Dropdown
                        name="tariffPlans"
                        value={formData.tariffPlans}
                        onChange={handleDropdownChange}
                        options={tariffPlanOptions}
                        placeholder="Select tariff plans"
                        isMultiSelect={true}
                        error={errors.tariffPlans}
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-main dark:text-white">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={onInputChange}
                            className="w-4 h-4 accent-primary border-gray-300 dark:border-dark-border"
                        />
                        I accept the Terms & Conditions and Privacy Policy <span className="text-error">*</span>
                    </label>
                    {errors.termsAccepted && <span className="text-error text-xs mt-1 block">{errors.termsAccepted}</span>}
                    <p className="text-xs text-gray-500 mt-2">By checking this box, you agree to our terms of service and privacy policy.</p>
                </div>
                <div className="flex justify-end">
                    <Button label="Next" type="submit" variant="primary" />
                </div>
            </form>
        </div>
    );
};

export default AppBasicsStep; 