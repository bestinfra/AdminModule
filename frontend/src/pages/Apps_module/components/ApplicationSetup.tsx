import React, { useEffect, useRef, useState, useMemo } from 'react';
// @ts-ignore: If axios types are missing, install with: npm install axios @types/axios
import axios from 'axios';
import FormInput from '@components/forms/FormInput'; 
import Dropdown from '@components/global/Dropdown';
import Button from '@components/global/Button';
import type { FormInputValue } from '@components/forms/types';
import { validateApplicationSetup } from '../utils';
import RemarksPanel from './RemarksPanel';

interface ApplicationSetupProps {
    formData: any;
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
    onArrayChange: (name: string, value: any) => void;
    onNext: (e: React.FormEvent<HTMLFormElement>) => void;
    currentStep?: number;
    onBack?: () => void;
}

const ApplicationSetup: React.FC<ApplicationSetupProps> = ({ formData, errors, onInputChange, onArrayChange, onNext, currentStep = 1, onBack }) => {

    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationLocked, setLocationLocked] = useState(false);

    // Dynamic location data states
    const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);

    // Unified loading state and debounce ref for location lookups

    const locationDebounceRef = useRef<NodeJS.Timeout | null>(null);

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

    // Get user's current location
    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Use reverse geocoding to get address details
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.address) {
                                const address = data.address;
                                
                                // Update form with location data
                                onInputChange({ target: { name: 'addressLine', value: data.display_name || '' } });
                                
                                if (address.country) {
                                    onInputChange({ target: { name: 'country', value: address.country } });
                                }
                                
                                if (address.state) {
                                    onInputChange({ target: { name: 'state', value: address.state } });
                                }
                                
                                if (address.city || address.town || address.village) {
                                    onInputChange({ target: { name: 'city', value: address.city || address.town || address.village } });
                                }
                                setLocationLocked(true);
                            }
                        })
                        .catch(error => {
                            console.error('Error getting location details:', error);
                            alert('Could not get location details. Please fill in manually.');
                        })
                        .finally(() => {
                            setIsGettingLocation(false);
                        });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Could not get your location. Please fill in manually.');
                    setIsGettingLocation(false);
                }
            );
        } else {
            alert('Geolocation is not supported by this browser. Please fill in manually.');
            setIsGettingLocation(false);
        }
    };

    // Auto-generate subdomain from app name
    const prevAppNameRef = useRef<string>('');
    const isInitialMount = useRef(true);
    
    useEffect(() => {
        // Skip on initial mount to avoid setting subdomain when component first loads
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevAppNameRef.current = formData.appName || '';
            return;
        }
        
        // Only update if app name has actually changed and is different from previous
        if (formData.appName && formData.appName !== prevAppNameRef.current) {
            const generated = formData.appName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            const fullUrl = `https://www.${generated}.bestinfra.app`;
            onInputChange({ target: { name: 'subdomain', value: fullUrl } });
        } else {
            onInputChange({ target: { name: 'subdomain', value: '' } });
        }
    }, [formData.appName]);

    // Fetch state/country from city
    const fetchStateCountryFromCity = async (city: string) => {
        if (!city) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&addressdetails=1&limit=1`);
            const data = await response.json();
            if (data && data.length > 0 && data[0].address) {
                const address = data[0].address;
                if (address.state) {
                    onInputChange({ target: { name: 'state', value: address.state } });
                }
                if (address.country) {
                    onInputChange({ target: { name: 'country', value: address.country } });
                }
            }
        } catch (error) {
            console.error('Error fetching state/country from city:', error);
        }
    };

    // Fetch country from state
    const fetchCountryFromState = async (state: string) => {
        if (!state) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?state=${encodeURIComponent(state)}&format=json&addressdetails=1&limit=1`);
            const data = await response.json();
            if (data && data.length > 0 && data[0].address && data[0].address.country) {
                onInputChange({ target: { name: 'country', value: data[0].address.country } });
            }
        } catch (error) {
            console.error('Error fetching country from state:', error);
        }
    };

    const handleFormInputChange = (name: string, value: FormInputValue) => {
        onInputChange({ target: { name, value } } as any);
        if (hasSubmitted) setHasSubmitted(false);
        // Debounced location lookups
        if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
        if (name === 'city' && typeof value === 'string' && value.trim() !== '') {
            locationDebounceRef.current = setTimeout(() => {
                fetchStateCountryFromCity(value.trim());
            }, 500);
        } else if (name === 'state' && typeof value === 'string' && value.trim() !== '' && (!formData.city || formData.city.trim() === '')) {
            locationDebounceRef.current = setTimeout(() => {
                fetchCountryFromState(value.trim());
            }, 500);
        }
    };

    const handleFormInputBlur = () => {
        // Handle blur if needed
    };

    // Validate form data and generate remarks
    const { isValid, errors: validationErrors, remarks } = useMemo(() => {
        //  subdomain issues
        if (formData.subdomain) {
            console.log('Subdomain validation debug:', {
                subdomain: formData.subdomain,
                isValid: /^https:\/\/www\.[a-z0-9-]+\.bestinfra\.app$/.test(formData.subdomain),
                regex: /^https:\/\/www\.[a-z0-9-]+\.bestinfra\.app$/
            });
        }
        return validateApplicationSetup(formData);
    }, [
        formData.appName,
        formData.subdomain,
        formData.addressLine,
        formData.country,
        formData.state,
        formData.city,
        formData.applicationCategory,
        formData.projectType,
        formData.ownershipType,
        formData.tariffPlans,
        formData.billingMode,
        formData.meteringType
    ]);

    // Only show validation errors if form has been submitted
    const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

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
        // Clear submitted state when user starts editing
        if (hasSubmitted) {
            setHasSubmitted(false);
        }
        
        // Multi-select fields
        if (e.target.name === 'applicationCategory' || e.target.name === 'tariffPlans' ||
            e.target.name === 'meteringType') {
            onArrayChange(e.target.name, e.target.value);
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
                        <p className="text-base text-gray-600 mt-2">Configure your application's basic information, location details, project specifications, and billing preferences to get started.</p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={(e) => {
                        e.preventDefault();
                        setHasSubmitted(true);
                        
                        // Only proceed if validation passes
                        if (isValid) {
                            onNext(e);
                        }
                    }} action="#" method="post" noValidate>
                        {/* Application Information Section */}
                        <div className="p-4 border border-primary-border rounded-xl">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-primary">Application Information</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'appName',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Enter your Application Name',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.appName}
                                        error={allErrors.appName}
                                        showError={!!allErrors.appName}
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
                                            placeholder: 'Enter Sub Domain',
                                            required: true,
                                        }}
                                        value={formData.subdomain}
                                        error={allErrors.subdomain}
                                        showError={!!allErrors.subdomain}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information Section */}
                        <div className="p-4 border border-primary-border rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-primary">Location Information</h3>
                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="flex items-center gap-2 text-sm font-semibold text-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGettingLocation ? (
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                    {isGettingLocation ? 'Getting Location...' : 'Get Location'}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'addressLine',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Enter Address Line',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.addressLine}
                                        error={allErrors.addressLine}
                                        showError={!!allErrors.addressLine}
                                        disabled={locationLocked}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'city',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Enter City',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.city}
                                        error={allErrors.city}
                                        showError={!!allErrors.city}
                                        disabled={locationLocked}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'state',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Enter State/Province',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.state}
                                        error={allErrors.state}
                                        showError={!!allErrors.state}
                                        disabled={locationLocked}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="country"
                                        value={formData.country}
                                        onChange={handleDropdownChange}
                                        options={countryOptions}
                                        placeholder="Select Country"
                                        error={allErrors.country}
                                        disabled={locationLocked}
                                    />
                                </div>
                            </div>
                        
                        </div>

                        {/* Project Configuration Section */}
                        <div className="p-4 border border-primary-border rounded-xl">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-primary">Project Configuration</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        name="applicationCategory"
                                        value={formData.applicationCategory}
                                        onChange={handleDropdownChange}
                                        options={applicationCategoryOptions}
                                        placeholder="Select Application Category"
                                        isMultiSelect={true}
                                        error={allErrors.applicationCategory}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleDropdownChange}
                                        options={projectTypeOptions}
                                        placeholder="Select Project Type"
                                        error={allErrors.projectType}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Dropdown
                                        name="ownershipType"
                                        value={formData.ownershipType}
                                        onChange={handleDropdownChange}
                                        options={ownershipTypeOptions}
                                        placeholder="Select Ownership Type"
                                        error={allErrors.ownershipType}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="meteringType"
                                        value={formData.meteringType}
                                        onChange={handleDropdownChange}
                                        options={meteringTypeOptions}
                                        placeholder="Select Metering Type"
                                        isMultiSelect={true}
                                        error={allErrors.meteringType}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <Dropdown
                                        name="tariffPlans"
                                        value={formData.tariffPlans}
                                        onChange={handleDropdownChange}
                                        options={tariffPlanOptions}
                                        placeholder="Select Tariff Plans"
                                        isMultiSelect={true}
                                        error={allErrors.tariffPlans}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        name="billingMode"
                                        value={formData.billingMode}
                                        onChange={handleDropdownChange}
                                        options={billingModeOptions}
                                        placeholder="Select Billing Mode"
                                        error={allErrors.billingMode}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <div className="flex justify-between items-center">
                            {currentStep > 1 && (
                                <span 
                                    className="flex items-center gap-2 p-2 px-4 rounded-3xl border border-primary-border dark:border-dark-border bg-white dark:bg-primary-dark cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
                                    onClick={onBack}
                                >
                                    <img src={'/icons/arrow-back.svg'} alt="arrow-left" className="w-5 h-5 filter dark:invert" />
                                    <span className="text-neutral dark:text-gray-300 font-medium">Previous</span>
                                </span>
                            )}
                            <div className="ml-auto">
                                <Button
                                    label="Next Step"
                                    type="submit"
                                    variant="primary"
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <RemarksPanel
                    hasSubmitted={hasSubmitted}
                    isValid={isValid}
                    validationErrors={validationErrors}
                    remarks={remarks}
                />
            </div>

        </div>
    );
};

export default ApplicationSetup; 