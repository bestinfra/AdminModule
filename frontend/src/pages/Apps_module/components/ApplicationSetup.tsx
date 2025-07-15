import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore: If axios types are missing, install with: npm install axios @types/axios
import axios from 'axios';
import FormInput from '../../../components/forms/FormInput';
import Dropdown from '../../../components/global/Dropdown';
import Button from '../../../components/global/Button';
import type { FormInputValue } from '../../../components/forms/types';

interface ApplicationSetupProps {
    formData: any;
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
    onArrayChange: (name: string, value: any) => void;
    onNext: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ApplicationSetup: React.FC<ApplicationSetupProps> = ({ formData, errors, onInputChange, onArrayChange, onNext }) => {

    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    // Dynamic location data states
    const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);
    const [stateOptions, setStateOptions] = useState<{ value: string; label: string }[]>([]);
    const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);

    // Fetch countries on mount
    useEffect(() => {
        axios.get('https://countriesnow.space/api/v0.1/countries/positions')
            .then((res: any) => {
                if (res.data && res.data.data) {
                    setCountryOptions(res.data.data.map((c: any) => ({ value: c.name, label: c.name })));
                }
            })
            .catch(() => setCountryOptions([]));
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (formData.country) {
            axios.post('https://countriesnow.space/api/v0.1/countries/states', {
                country: formData.country
            })
                .then((res: any) => {
                    if (res.data && res.data.data && res.data.data.states) {
                        setStateOptions(res.data.data.states.map((s: any) => ({ value: s.name, label: s.name })));
                    } else {
                        setStateOptions([]);
                    }
                })
                .catch(() => setStateOptions([]));
        } else {
            setStateOptions([]);
        }
        setCityOptions([]);
    }, [formData.country]);

    // Fetch cities when state changes
    useEffect(() => {
        if (formData.country && formData.state) {
            axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
                country: formData.country,
                state: formData.state
            })
                .then((res: any) => {
                    if (res.data && res.data.data) {
                        setCityOptions(res.data.data.map((city: string) => ({ value: city, label: city })));
                    } else {
                        setCityOptions([]);
                    }
                })
                .catch(() => setCityOptions([]));
        } else {
            setCityOptions([]);
        }
    }, [formData.country, formData.state]);

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

    const applicationCategoryOptions = [
        { value: 'smart-metering', label: 'Smart Metering' },
        { value: 'solar-epc', label: 'Solar EPC' },
        { value: 'substation-td', label: 'Substation & T&D' },
        { value: 'billing-amr', label: 'Billing & AMR' },
        { value: 'mdms-integration', label: 'MDMS Integration' },
        { value: 'energy-audit', label: 'Energy Audit' },
        { value: 'infrastructure-om', label: 'Infrastructure O&M' },
        { value: 'ev-charging', label: 'EV Charging' },
        { value: 'data-logger', label: 'Data Logger' },
    ];

    const projectTypeOptions = [
        { value: 'pilot', label: 'Pilot' },
        { value: 'full-scale-rollout', label: 'Full-Scale Rollout' },
        { value: 'demo', label: 'Demo' },
        { value: 'research-prototype', label: 'Research/Prototype' },
        { value: 'migration-upgrade', label: 'Migration/Upgrade' },
        { value: 'amc-only', label: 'AMC Only' },
    ];

    const clientTypeOptions = [
        { value: 'discom', label: 'DISCOM' },
        { value: 'state-government', label: 'State Government' },
        { value: 'central-government', label: 'Central Government' },
        { value: 'private-industry', label: 'Private Industry' },
        { value: 'utility-board', label: 'Utility Board' },
        { value: 'smart-city-authority', label: 'Smart City Authority' },
    ];

    const ownershipTypeOptions = [
        { value: 'state-owned', label: 'State-Owned' },
        { value: 'central-government', label: 'Central Government' },
        { value: 'ppp', label: 'Public-Private Partnership (PPP)' },
        { value: 'private-utility', label: 'Private Utility' },
    ];

    const tariffPlanOptions = [
        { value: 'domestic-lt', label: 'Domestic – LT' },
        { value: 'commercial-lt', label: 'Commercial – LT' },
        { value: 'industrial-ht', label: 'Industrial – HT' },
        { value: 'agricultural', label: 'Agricultural' },
        { value: 'net-metering', label: 'Net Metering' },
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'tod', label: 'Time-of-Day (ToD)' },
        { value: 'custom-tariff', label: 'Custom Tariff' },
    ];

    const billingModeOptions = [
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'postpaid', label: 'Postpaid' },
        { value: 'hybrid', label: 'Hybrid' },
    ];

    const meteringTypeOptions = [
        { value: 'single-phase', label: 'Single Phase' },
        { value: 'three-phase', label: 'Three Phase' },
        { value: 'lt-ct', label: 'LT CT' },
        { value: 'ht-ct-pt', label: 'HT CT/PT' },
        { value: 'net-meter', label: 'Net Meter' },
        { value: 'smart-meter', label: 'Smart Meter' },
        { value: 'solar-bidirectional', label: 'Solar Bidirectional' },
        { value: 'amr-ami-enabled', label: 'AMR/AMI-Enabled' },
    ];

    // Unified Dropdown handler
    const handleDropdownChange = (e: { target: { name: string; value: string | string[] } }) => {
        // Multi-select fields
        if (e.target.name === 'applicationCategory' || e.target.name === 'tariffPlans' ||
            e.target.name === 'meteringType') {
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
        <div className="mx-auto">
            <div className="bg-white rounded-xl border border-primary-border p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="col-span-1 lg:col-span-3 p-4 flex flex-col gap-4">
                    <div className="">
                        <h2 className="text-base font-semibold text-primary">Application Setup</h2>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={onNext} action="#" method="post" noValidate>
                        {/* Basic Information Section */}
                        <div className="">


                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'appName',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Enter your application name',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
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

                                <div>
                                    <FormInput
                                        input={{
                                            name: 'subdomain',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Enter subdomain',
                                            required: true,
                                        }}
                                        value={formData.subdomain}
                                        error={errors.subdomain}
                                        showError={!!errors.subdomain}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information Section */}
                        <div className="">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Dropdown
                                        name="country"
                                        value={formData.country}
                                        onChange={handleDropdownChange}
                                        options={countryOptions}
                                        placeholder="Select Country"
                                        error={errors.country}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="state"
                                        value={formData.state}
                                        onChange={handleDropdownChange}
                                        options={stateOptions}
                                        placeholder="Select State"
                                        disabled={!formData.country}
                                        error={errors.state}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="city"
                                        value={formData.city}
                                        onChange={handleDropdownChange}
                                        options={cityOptions}
                                        placeholder="Select City"
                                        disabled={!formData.state}
                                        error={errors.city}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Configuration Section */}
                        <div className="">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        name="applicationCategory"
                                        value={formData.applicationCategory}
                                        onChange={handleDropdownChange}
                                        options={applicationCategoryOptions}
                                        placeholder="Select Application Category"
                                        isMultiSelect={true}
                                        error={errors.applicationCategory}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleDropdownChange}
                                        options={projectTypeOptions}
                                        placeholder="Select Project Type"
                                        error={errors.projectType}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Client & Ownership Information Section */}
                        <div className="">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        name="clientType"
                                        value={formData.clientType}
                                        onChange={handleDropdownChange}
                                        options={clientTypeOptions}
                                        placeholder="Select Client Type"
                                        error={errors.clientType}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="ownershipType"
                                        value={formData.ownershipType}
                                        onChange={handleDropdownChange}
                                        options={ownershipTypeOptions}
                                        placeholder="Select Ownership Type"
                                        error={errors.ownershipType}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing & Metering Configuration Section */}
                        <div className="">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
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
                                <div>
                                    <Dropdown
                                        name="billingMode"
                                        value={formData.billingMode}
                                        onChange={handleDropdownChange}
                                        options={billingModeOptions}
                                        placeholder="Select Billing Mode"
                                        error={errors.billingMode}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        name="meteringType"
                                        value={formData.meteringType}
                                        onChange={handleDropdownChange}
                                        options={meteringTypeOptions}
                                        placeholder="Select Metering Type"
                                        isMultiSelect={true}
                                        error={errors.meteringType}
                                    />
                                </div>
                                <div>
                                    {/* Reserved for future fields */}
                                </div>
                            </div>

                        </div>


                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                            <Button
                                label="Next Step"
                                type="submit"
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
                <div className="col-span-1 bg-primary-lightest rounded-xl p-4">
                    <div className="">
                        <h2 className="text-base font-semibold text-primary">Remarks</h2>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ApplicationSetup; 