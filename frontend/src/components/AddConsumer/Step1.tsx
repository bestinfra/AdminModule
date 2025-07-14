import { useEffect } from 'react';
import Button from '../global/Button';
import FormInput from '../forms/FormInput';

// Configuration data
const idTypeOptions = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driver_license', label: "Driver's License" },
    { value: 'voter_id', label: 'Voter ID' },
];

const meterOptions = [
    { name: 'MTR001A', units: 'MTR001A', type: 'Active' },
    { name: 'MTR002B', units: 'MTR002B', type: 'Active' },
    { name: 'MTR003C', units: 'MTR003C', type: 'Active' },
    { name: 'MTR004D', units: 'MTR004D', type: 'Inactive' },
    { name: 'MTR005E', units: 'MTR005E', type: 'Active' },
];

const propertyTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
];

interface Step1Props {
    formData: any;
    errors: Record<string, string>;
    valid?: Record<string, boolean>;
    focus?: Record<string, boolean>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFieldFocus?: (field: string, focused: boolean) => void;
    buildingSearch: string;
    setBuildingSearch: (value: string) => void;
    selectedBuilding: string;
    handleBuildingSelect: (name: string) => void;
    onNext: () => void;
    onBack?: () => void;
    isAdmin?: boolean;
    navigate?: any;
}

const Step1: React.FC<Step1Props> = ({
    formData,
    errors,
    valid = {},
    focus = {},
    handleInputChange,
    setFieldFocus = () => {},
    buildingSearch,
    setBuildingSearch,
    selectedBuilding,
    handleBuildingSelect,
    onNext,
}) => {
    const fileInputRefs = { current: {} };

    // Form input configurations
    const formInputs = [
        {
            name: 'first_name',
            type: 'text' as const,
            label: 'First Name',
            placeholder: 'Enter first name',
            required: true,
            colSpan: 1,
            icon: valid.first_name ? 'icons/checkmark.svg' : undefined
        },
        {
            name: 'last_name',
            type: 'text' as const,
            label: 'Last Name',
            placeholder: 'Enter last name',
            required: true,
            colSpan: 1,
            icon: valid.last_name ? 'icons/checkmark.svg' : undefined
        },
        {
            name: 'email',
            type: 'email' as const,
            label: 'Email',
            placeholder: 'Enter email address',
            required: true,
            colSpan: 1,
            icon: valid.email ? 'icons/checkmark.svg' : undefined
        },
        {
            name: 'phone',
            type: 'tel' as const,
            label: 'Phone',
            placeholder: 'Enter phone number',
            required: true,
            colSpan: 1,
            icon: valid.phone ? 'icons/checkmark.svg' : undefined
        },
        {
            name: 'id_type',
            type: 'select' as const,
            label: 'ID Type',
            placeholder: 'Select ID Type',
            required: true,
            colSpan: 1,
            options: idTypeOptions,
            icon: valid.id_type ? 'icons/checkmark.svg' : undefined
        },
        {
            name: 'id_number',
            type: 'text' as const,
            label: 'ID Number',
            placeholder: formData.id_type === 'aadhar' ? 'XXXX XXXX XXXX' : 'ABCDE1234F',
            required: true,
            colSpan: 1,
            icon: valid.id_number ? 'icons/checkmark.svg' : undefined
        }
    ];

    // Function to validate Aadhar number
    const validateAadhar = (value: string): boolean => {
        const cleanValue = value.replace(/\s/g, '');
        return /^\d{12}$/.test(cleanValue);
    };

    // Function to validate PAN number
    const validatePAN = (value: string): boolean => {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    };

    // Validate ID number based on type
    const validateIdNumber = (value: string, type: string): boolean => {
        if (!value) return false;
        
        if (type === 'aadhar') {
            return validateAadhar(value);
        } else if (type === 'pan') {
            return validatePAN(value);
        }
        return false;
    };

    // Update ID number validation when ID type changes
    useEffect(() => {
        if (formData.id_type && formData.id_number) {
            const isValid = validateIdNumber(formData.id_number, formData.id_type);
            console.log('ID validation:', isValid);
        }
    }, [formData.id_type, formData.id_number]);



    // Function to check if a field should be enabled
    const isFieldEnabled = (fieldName: string): boolean => {
        const step1Fields = ['first_name', 'last_name', 'email', 'phone', 'id_type', 'id_number'];
        if (step1Fields.includes(fieldName)) {
            return true;
        }

        const step2Fields = ['building', 'property_type', 'move_in_date', 'account_type'];
        if (step2Fields.includes(fieldName)) {
            return step1Fields.every(field => formData[field] && formData[field].trim() !== '');
        }

        return true;
    };

    // Function to get field status classes
    const getFieldClasses = (fieldName: string): string => {
        const baseClasses = "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500";
        
        if (!isFieldEnabled(fieldName)) {
            return `${baseClasses} bg-gray-100 border-gray-300 cursor-not-allowed`;
        }
        if (focus[fieldName]) {
            return `${baseClasses} border-blue-500 bg-blue-50`;
        }
        if (valid[fieldName]) {
            return `${baseClasses} border-green-500 bg-green-50`;
        }
        if (errors[fieldName]) {
            return `${baseClasses} border-red-500 bg-red-50`;
        }
        return `${baseClasses} border-gray-300 hover:border-gray-400`;
    };

    // Custom handlers for FormInput
    const handleFormInputChange = (name: string, value: any) => {
        const syntheticEvent = {
            target: { name, value }
        } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
        handleInputChange(syntheticEvent);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
            {/* Error Summary */}
            {Object.keys(errors).some(key => errors[key]) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {Object.entries(errors).map(([field, error]) => {
                            if (error && ['first_name', 'last_name', 'email', 'phone', 'id_type', 'id_number'].includes(field)) {
                                return (
                                    <li key={field} className="text-red-600 text-sm">
                                        {error}
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                </div>
            )}

            {/* Step 1 Fields - Consumer Information */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Consumer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formInputs.map((input) => (
                        <FormInput
                            key={input.name}
                            input={input}
                            value={formData[input.name] || ''}
                            error={errors[input.name]}
                            showError={!!errors[input.name]}
                            disabled={!isFieldEnabled(input.name)}
                            onInputChange={handleFormInputChange}
                            onInputBlur={() => setFieldFocus(input.name, false)}
                            fileInputRefs={fileInputRefs}
                        />
                    ))}
                </div>
            </div>

            {/* Step 2 Fields - Asset/Property Details */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Asset/Property Details</h2>
                
                {/* Meter Search */}
                <div className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Meter Number *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="building"
                                name="building"
                                placeholder="Search for your meter number..."
                                value={buildingSearch}
                                onChange={(e) => setBuildingSearch(e.target.value)}
                                disabled={!isFieldEnabled('building')}
                                className={getFieldClasses('building')}
                            />
                            {valid.building && (
                                <img
                                    src="icons/checkmark.svg"
                                    alt="Valid"
                                    className="absolute right-3 top-2.5 w-4 h-4 text-green-500"
                                />
                            )}
                        </div>
                    </div>

                    {/* Meter Options */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {meterOptions
                            .filter(
                                (m) =>
                                    m.name
                                        .toLowerCase()
                                        .includes(buildingSearch.toLowerCase()) ||
                                    m.units.includes(buildingSearch)
                            )
                            .map((m) => (
                                <div
                                    key={m.name}
                                    onClick={() => isFieldEnabled('building') && handleBuildingSelect(m.name)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                        selectedBuilding === m.name
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    } ${!isFieldEnabled('building') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {m.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Meter Number: {m.units}
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            selectedBuilding === m.name 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : m.type === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {selectedBuilding === m.name ? 'Assigned' : m.type}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Property Type */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type *
                        </label>
                        <div className="relative">
                            <select
                                id="property_type"
                                name="property_type"
                                value={formData.property_type}
                                onChange={handleInputChange}
                                onFocus={() => setFieldFocus('property_type', true)}
                                onBlur={() => setFieldFocus('property_type', false)}
                                disabled={!isFieldEnabled('property_type')}
                                className={getFieldClasses('property_type')}
                            >
                                <option value="">Select Property Type</option>
                                {propertyTypes.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {valid.property_type && (
                                <img
                                    src="icons/checkmark.svg"
                                    alt="Valid"
                                    className="absolute right-8 top-2.5 w-4 h-4 text-green-500"
                                />
                            )}
                        </div>
                        {/* {errors.property_type && (
                            <p className="text-red-500 text-xs mt-1">{errors.property_type}</p>
                        )} */}
                    </div>

                    {/* Account Type */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type *
                        </label>
                        <div className="relative">
                            <select
                                id="account_type"
                                name="account_type"
                                value={formData.account_type}
                                onChange={handleInputChange}
                                onFocus={() => setFieldFocus('account_type', true)}
                                onBlur={() => setFieldFocus('account_type', false)}
                                disabled={!isFieldEnabled('account_type')}
                                className={getFieldClasses('account_type')}
                            >
                                <option value="">Select Account Type</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industrial</option>
                            </select>
                            {valid.account_type && (
                                <img
                                    src="icons/checkmark.svg"
                                    alt="Valid"
                                    className="absolute right-8 top-2.5 w-4 h-4 text-green-500"
                                />
                            )}
                        </div>
                        
                    </div>
                </div>

                {/* Move-in Date */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Move-in Date *
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="move_in_date"
                            name="move_in_date"
                            value={formData.move_in_date || ''}
                            onChange={handleInputChange}
                            onFocus={() => setFieldFocus('move_in_date', true)}
                            onBlur={() => setFieldFocus('move_in_date', false)}
                            disabled={!isFieldEnabled('move_in_date')}
                            className={getFieldClasses('move_in_date')}
                            max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        />
                        {valid.move_in_date && (
                            <img
                                src="icons/checkmark.svg"
                                alt="Valid"
                                className="absolute right-3 top-2.5 w-4 h-4 text-green-500"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6">
                <Button
                    label="Next"
                    variant="primary"
                    onClick={onNext}
                />
            </div>
        </div>
    );
};

export default Step1; 