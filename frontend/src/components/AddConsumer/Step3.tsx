import Button from '../global/Button';

// Configuration data - keeping consistent with Step2
const utilityOptions = [
    {
        key: 'electric',
        label: 'Electric',
        desc: 'Electricity consumption monitoring',
        icon: 'icons/electric.svg',
    },
    {
        key: 'water',
        label: 'Water',
        desc: 'Water usage tracking',
        icon: 'icons/water.svg',
    },
    {
        key: 'gas',
        label: 'Gas',
        desc: 'Natural gas consumption',
        icon: 'icons/gas.svg',
    },
    {
        key: 'solar',
        label: 'Solar',
        desc: 'Solar energy generation',
        icon: 'icons/solar.svg',
    },
];

interface SharedConsumer {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    id_type: string;
    id_number: string;
}

interface Step3Props {
    formData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        date_of_birth?: string;
        id_type: string;
        id_number: string;
        building_name: string;
        property_type: string;
        account_type: string;
        move_in_date: string;
        uid: string;
    };
    selectedUtilities: string[];
    sharedMeter: boolean;
    sharedConsumers?: SharedConsumer[];
    gps: string;
    accountNumber: string;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
}

const Step3: React.FC<Step3Props> = ({
    formData,
    selectedUtilities,
    sharedMeter,
    sharedConsumers,
    gps,
    accountNumber,
    onBack,
    onSubmit,
    isSubmitting,
}) => {
    const getUtilityLabel = (key: string) => {
        const utility = utilityOptions.find((opt) => opt.key === key);
        return utility ? (
            <span key={key} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 mr-2 mb-2">
                <img
                    src={utility.icon}
                    alt={utility.label}
                    className="w-4 h-4"
                />
                {utility.label}
            </span>
        ) : (
            <span key={key} className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 mr-2 mb-2">
                {key}
            </span>
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Review & Submit</h2>
                <p className="text-gray-600">Please review all the information before submitting</p>
            </div>
            
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Personal Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Full Name</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.first_name} {formData.last_name}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Email</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.email}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Phone</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.phone}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.date_of_birth || '-'}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">ID Type</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.id_type}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">ID Number</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.id_number}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Property Details
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Building</span>
                            <div className="text-base text-gray-900 font-medium mt-1">
                                {formData.building_name}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Property Type</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.property_type}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Account Type</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.account_type}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Move-in Date</span>
                            <div className="text-base text-gray-900 mt-1">
                                {formData.move_in_date}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Utility Services */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Utility Services
                    </h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-gray-500">Selected Utilities</span>
                        <div className="mt-2">
                            {selectedUtilities.map(getUtilityLabel)}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Shared Meter</span>
                            <div className="text-base text-gray-900 mt-1">
                                {sharedMeter ? 'Yes' : 'No'}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Account Number</span>
                            <div className="text-base text-gray-900 font-medium mt-1">
                                {accountNumber}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shared Consumers Section - Only show if shared meter is enabled */}
            {sharedMeter && sharedConsumers && sharedConsumers.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Shared Consumers
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {sharedConsumers.map((consumer, index) => (
                            <div key={index} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <h4 className="font-medium text-gray-900 mb-4">Consumer {index + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Name</span>
                                        <div className="text-base text-gray-900 mt-1">
                                            {consumer.first_name} {consumer.last_name}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Contact</span>
                                        <div className="text-base text-gray-900 mt-1">
                                            <div>{consumer.email}</div>
                                            <div>{consumer.phone}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">ID Details</span>
                                        <div className="text-base text-gray-900 mt-1">
                                            <div>{consumer.id_type}</div>
                                            <div>{consumer.id_number}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between pt-6">
                <Button
                    label="Back"
                    variant="outline"
                    onClick={onBack}
                    type="button"
                />
                <Button
                    label={isSubmitting ? 'Submitting...' : 'Submit'}
                    variant="primary"
                    onClick={() => onSubmit({} as React.FormEvent)}
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
};

export default Step3; 