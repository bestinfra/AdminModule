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
            const fullUrl = `https://www.${generated}`;
            // Always update subdomain when app name changes
            onInputChange({ target: { name: 'subdomain', value: fullUrl } });
        }
    }, [formData.appName, onInputChange]);

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
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <FormInput
                            input={{
                                name: 'appName',
                                type: 'text',
                                label: 'App Name',
                                placeholder: 'Enter App Name',
                                required: true,
                            }}
                            value={formData.appName}
                            error={errors.appName}
                            showError={!!errors.appName}
                            disabled={false}
                            onInputChange={handleFormInputChange}
                            onInputBlur={handleFormInputBlur}
                            fileInputRefs={fileInputRefs}
                        />
                    </div>
                    <div className="flex-1">

                        <div className="relative flex items-center h-auto">
                            <input
                                id="subdomain"
                                name="subdomain"
                                type="text"
                                className={`input w-full pr-36 ${errors.subdomain ? 'border-red-500' : ''} rounded-r-3xl`}
                                placeholder="Enter Subdomain"
                                value={formData.subdomain}
                                onChange={e => handleFormInputChange('subdomain', e.target.value)}
                                required
                                autoComplete="off"
                                aria-invalid={!!errors.subdomain}
                                aria-describedby={errors.subdomain ? 'subdomain-error' : undefined}
                            />
                            {formData.subdomain && (
                                <a
                                    href={`${formData.subdomain}.bestinfra.org`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute right-36 top-1/2 -translate-y-1/2 text-blue-600 hover:underline flex items-center z-10 text-sm"
                                >
                                 
                                </a>
                            )}
                            <span
                                className="absolute right-0 top-0 flex items-center pl-2 pr-4 min-w-[120px] text-[0.95em] text-gray-500 pointer-events-none select-none bg-gray-100 dark:bg-gray-800 border-l border-gray-200 rounded-r-3xl h-full"
                            >
                                .bestinfra.org
                            </span>
                        </div>
                        {errors.subdomain && <div id="subdomain-error" className="text-xs text-red-500 mt-1">{errors.subdomain}</div>}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Dropdown
                            name="country"
                            value={formData.country}
                            onChange={handleDropdownChange}
                            options={countryOptions}
                            placeholder="Select Country"
                            error={errors.country}
                        />
                    </div>
                    <div className="flex-1">
                        <Dropdown
                            name="state"
                            value={formData.state}
                            onChange={handleDropdownChange}
                            options={stateOptions[formData.country] || []}
                            placeholder="Select State"
                            disabled={!formData.country}
                            error={errors.state}
                        />
                    </div>
                    <div className="flex-1">
                        <Dropdown
                            name="city"
                            value={formData.city}
                            onChange={handleDropdownChange}
                            options={cityOptions[formData.state] || []}
                            placeholder="Select City"
                            disabled={!formData.state}
                            error={errors.city}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Dropdown
                            name="categories"
                            value={formData.categories}
                            onChange={handleDropdownChange}
                            options={categoryOptions}
                            placeholder="Select Categories"
                            isMultiSelect={true}
                            error={errors.categories}
                        />
                    </div>
                    <div className="flex-1">
                        <Dropdown
                            name="tariffPlans"
                            value={formData.tariffPlans}
                            onChange={handleDropdownChange}
                            options={tariffPlanOptions}
                            placeholder="Select Tariff Plans"
                            isMultiSelect={true}
                            error={errors.tariffPlans}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button label="Next" type="submit" variant="primary" />
                </div>
            </form>
        </div>
    );
};

export default AppBasicsStep; 