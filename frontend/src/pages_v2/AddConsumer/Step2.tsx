import { useState, useEffect } from 'react';
import Button from '@components/global/Button';

// Configuration data
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

const idTypeOptions = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driver_license', label: "Driver's License" },
    { value: 'voter_id', label: 'Voter ID' },
];

interface Step2Props {
    selectedUtilities: string[];
    handleUtilityToggle: (key: string) => void;
    sharedMeter: boolean;
    setSharedMeter: (value: boolean) => void;
    gps: string;
    handleGetLocation: () => void;
    accountNumber: string;
    onNext: () => void;
    onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({
    selectedUtilities,
    handleUtilityToggle,
    sharedMeter,
    setSharedMeter,
    gps,
    handleGetLocation,
    accountNumber,
    onNext,
    onBack
}) => {
    useEffect(() => {
        if (!selectedUtilities.includes('electric')) {
            handleUtilityToggle('electric');
        }
    }, []);

    const [sharedConsumers, setSharedConsumers] = useState([{
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        id_number: '',
        id_type: ''
    }]);

    const [sharedConsumerErrors, setSharedConsumerErrors] = useState([{
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        id_number: '',
        id_type: ''
    }]);

    const [customUtilities, setCustomUtilities] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUtility, setNewUtility] = useState({
        label: '',
        desc: '',
        icon: 'icons/custom-utility.svg'
    });

    const validateSharedConsumer = (consumer: any) => {
        const errors: any = {};
        if (!consumer.first_name.trim()) {
            errors.first_name = 'First name is required';
        }
        if (!consumer.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }
        if (!consumer.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(consumer.email)) {
            errors.email = 'Invalid email format';
        }
        if (!consumer.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(consumer.phone.replace(/\D/g, ''))) {
            errors.phone = 'Invalid phone number format';
        }
        if (!consumer.id_number.trim()) {
            errors.id_number = 'ID number is required';
        }
        if (!consumer.id_type) {
            errors.id_type = 'ID type is required';
        }
        return errors;
    };

    const addSharedConsumer = () => {
        setSharedConsumers(prev => [...prev, {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            id_number: '',
            id_type: ''
        }]);
        setSharedConsumerErrors(prev => [...prev, {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            id_number: '',
            id_type: ''
        }]);
    };

    const removeSharedConsumer = (index: number) => {
        setSharedConsumers(prev => prev.filter((_, i) => i !== index));
        setSharedConsumerErrors(prev => prev.filter((_, i) => i !== index));
    };

    const handleSharedConsumerChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSharedConsumers(prev => prev.map((consumer, i) => 
            i === index ? { ...consumer, [name]: value } : consumer
        ));
        
        // Clear error when user starts typing
        setSharedConsumerErrors(prev => prev.map((errors, i) => 
            i === index ? { ...errors, [name]: '' } : errors
        ));
    };

    const validateAllSharedConsumers = () => {
        const newErrors = sharedConsumers.map(consumer => validateSharedConsumer(consumer));
        setSharedConsumerErrors(newErrors);
        return newErrors.every(errors => Object.keys(errors).length === 0);
    };

    const handleNext = () => {
        if (sharedMeter && !validateAllSharedConsumers()) {
            return;
        }
        onNext();
    };

    const handleAddUtility = () => {
        if (newUtility.label && newUtility.desc) {
            setCustomUtilities(prev => [...prev, {
                ...newUtility,
                key: `custom_${Date.now()}`,
                confirmed: true
            }]);
            setNewUtility({
                label: '',
                desc: '',
                icon: 'icons/custom-utility.svg'
            });
            setShowAddModal(false);
        }
    };

    const handleRemoveCustomUtility = (key: string) => {
        setCustomUtilities(prev => prev.filter(util => util.key !== key));
    };

    const allUtilities = [...utilityOptions, ...customUtilities];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Meter & Location Setup</h2>
                {customUtilities.length < 3 && (
                    <button
                        className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                        onClick={() => setShowAddModal(true)}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Utility Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Select Utilities *
                </label>
                <div className={`grid gap-4 ${customUtilities.length > 0 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
                    {allUtilities.map(opt => (
                        <div
                            key={opt.key}
                            className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedUtilities.includes(opt.key) 
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {/* Remove button for custom utilities */}
                            {opt.key.startsWith('custom_') && (
                                <button
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    onClick={() => handleRemoveCustomUtility(opt.key)}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <div className="flex items-start space-x-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedUtilities.includes(opt.key)}
                                        onChange={() => handleUtilityToggle(opt.key)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <img 
                                    src={opt.icon} 
                                    alt={opt.label} 
                                    className="w-8 h-8 flex-shrink-0" 
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{opt.label}</div>
                                    <div className="text-sm text-gray-600">{opt.desc}</div>
                                </div>
                            </div>
                            {selectedUtilities.includes(opt.key) && (
                                <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
                                    Selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* GPS Location */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    GPS Location
                </label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={gps}
                        readOnly
                        placeholder="GPS coordinates will appear here"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    />
                    <Button
                        label="Get Location"
                        onClick={handleGetLocation}
                        variant="outline"
                    />
                </div>
            </div>

            {/* Account Number Display */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Account Number
                </label>
                <input
                    type="text"
                    value={accountNumber}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
            </div>

            {/* Shared Meter Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Shared Meter</h3>
                    <p className="text-sm text-gray-600">Enable if this meter is shared with other consumers</p>
                </div>
                <div className="flex items-center space-x-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sharedMeter}
                            onChange={() => setSharedMeter(!sharedMeter)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    {sharedMeter && (
                        <button
                            className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                            onClick={addSharedConsumer}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Shared Consumers Forms */}
            {sharedMeter && (
                <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Shared meter billing will be calculated based on unit square footage and occupancy. Contact management for specific details.
                        </p>
                    </div>

                    {sharedConsumers.map((consumer, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Shared Consumer {index + 1}</h3>
                                {index > 0 && (
                                    <button
                                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                        onClick={() => removeSharedConsumer(index)}
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        placeholder="First Name"
                                        value={consumer.first_name}
                                        onChange={(e) => handleSharedConsumerChange(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            sharedConsumerErrors[index]?.first_name 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {/* {sharedConsumerErrors[index]?.first_name && (
                                        <p className="text-red-500 text-xs mt-1">{sharedConsumerErrors[index].first_name}</p>
                                    )} */}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        placeholder="Last Name"
                                        value={consumer.last_name}
                                        onChange={(e) => handleSharedConsumerChange(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            sharedConsumerErrors[index]?.last_name 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {/* {sharedConsumerErrors[index]?.last_name && (
                                        <p className="text-red-500 text-xs mt-1">{sharedConsumerErrors[index].last_name}</p>
                                    )} */}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={consumer.email}
                                        onChange={(e) => handleSharedConsumerChange(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            sharedConsumerErrors[index]?.email 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {/* {sharedConsumerErrors[index]?.email && (
                                        <p className="text-red-500 text-xs mt-1">{sharedConsumerErrors[index].email}</p>
                                    )} */}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone"
                                        value={consumer.phone}
                                        onChange={(e) => handleSharedConsumerChange(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            sharedConsumerErrors[index]?.phone 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                        {/* {sharedConsumerErrors[index]?.phone && (
                                            <p className="text-red-500 text-xs mt-1">{sharedConsumerErrors[index].phone}</p>
                                        )} */}
                                </div>

                                {/* ID Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="id_number"
                                        placeholder="ID Number"
                                        value={consumer.id_number}
                                        onChange={(e) => handleSharedConsumerChange(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            sharedConsumerErrors[index]?.id_number 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {/* {sharedConsumerErrors[index]?.id_number && (
                                        <p className="text-red-500 text-xs mt-1">{sharedConsumerErrors[index].id_number}</p>
                                    )} */}
                                </div>

                                {/* ID Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ID Type *
                                    </label>
                                    <select
                                        name="id_type"
                                        value={consumer.id_type}
                                        onChange={(e) => handleSharedConsumerChange(index, e)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            sharedConsumerErrors[index]?.id_type 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select ID Type</option>
                                        {idTypeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {/* {sharedConsumerErrors[index]?.id_type && (
                                        <p className="text-red-500 text-xs mt-1">{sharedConsumerErrors[index].id_type}</p>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Other Charges Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Other Charges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <img src="icons/maintenance.svg" alt="Maintenance" className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">Maintenance Charges</h3>
                                <p className="text-sm text-gray-600 mt-1">Scheduled maintenance checks to ensure optimal performance</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                    <span className="text-xs text-gray-500">Every 3 months</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <img src="icons/inspection.svg" alt="Inspection" className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">Safety Inspection</h3>
                                <p className="text-sm text-gray-600 mt-1">Comprehensive safety checks and compliance verification</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Pending
                                    </span>
                                    <span className="text-xs text-gray-500">Every 6 months</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6">
                <Button
                    label="Previous"
                    variant="outline"
                    onClick={onBack}
                />
                <Button
                    label="Next"
                    variant="primary"
                    onClick={handleNext}
                />
            </div>

            {/* Add Utility Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Add New Utility</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Utility Name
                                </label>
                                <input
                                    type="text"
                                    value={newUtility.label}
                                    onChange={(e) => setNewUtility(prev => ({ ...prev, label: e.target.value }))}
                                    placeholder="Enter utility name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newUtility.desc}
                                    onChange={(e) => setNewUtility(prev => ({ ...prev, desc: e.target.value }))}
                                    placeholder="Enter utility description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <Button
                                label="Cancel"
                                variant="outline"
                                onClick={() => setShowAddModal(false)}
                            />
                            <Button
                                label="Add Utility"
                                variant="primary"
                                onClick={handleAddUtility}
                                disabled={!newUtility.label || !newUtility.desc}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step2; 