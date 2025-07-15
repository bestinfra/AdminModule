import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';
import Header from '../components/global/PageHeader';
import Step1 from '../components/AddConsumer/Step1';
import Step2 from '../components/AddConsumer/Step2';
import Step3 from '../components/AddConsumer/Step3';
    
// Validation schemas for each step
const personalInfoSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    id_type: z.string().min(1, 'ID type is required'),
    id_number: z.string().min(1, 'ID number is required'),
    building_name: z.string().min(1, 'Building name is required'),
    property_type: z.string().min(1, 'Property type is required'),
    move_in_date: z.string().min(1, 'Move-in date is required'),
    account_type: z.string().min(1, 'Account type is required'),
});

// Add this new schema for step 2
const meterLocationSchema = z.object({
    selectedUtilities: z
        .array(z.string())
        .min(1, 'At least one utility must be selected'),
});

// Step labels for the stepper
const stepLabels = [
    { label: 'Consumer & Property', sub: 'Provide all the details about the consumer and property' },
    { label: 'Meter & Location', sub: 'Provide the meter details and location details' },
    { label: 'Review & Submit', sub: 'Review all the details and submit the form' },
];

const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_type: '',
    id_number: '',
    building_name: '',
    property_type: '',
    move_in_date: '',
    account_type: '',
    uid: '',
};

const AddConsumer = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Helper function to check if user is admin
    const isAdmin = () => user?.role?.toLowerCase().includes('admin') || false;
    
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [buildingSearch, setBuildingSearch] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [selectedUtilities, setSelectedUtilities] = useState(['electric']);
    const [sharedMeter, setSharedMeter] = useState(false);
    const [sharedConsumers] = useState([]);
    const [gps, setGps] = useState('');

    // Form state management
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [focus, setFocus] = useState<Record<string, boolean>>({});
    const [valid, setValid] = useState<Record<string, boolean>>({});

    // Simple form handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Simple validation for demonstration
        if (value.trim() !== '') {
            setValid(prev => ({
                ...prev,
                [name]: true
            }));
        } else {
            setValid(prev => ({
                ...prev,
                [name]: false
            }));
        }
    };

    const setFieldFocus = (field: string, focused: boolean) => {
        setFocus(prev => ({
            ...prev,
            [field]: focused
        }));
    };

    const validateStep = (step: number): boolean => {
        try {
            switch (step) {
                case 1:
                    personalInfoSchema.parse({
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        email: formData.email,
                        phone: formData.phone,
                        id_type: formData.id_type,
                        id_number: formData.id_number,
                        building_name: formData.building_name,
                        property_type: formData.property_type,
                        move_in_date: formData.move_in_date,
                        account_type: formData.account_type,
                    });
                    break;
                case 2:
                    meterLocationSchema.parse({
                        selectedUtilities,
                    });
                    break;
                default:
                    return false;
            }
            return true;
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((issue: z.ZodIssue) => {
                    if (issue.path[0]) {
                        newErrors[issue.path[0].toString()] = issue.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep === 1) {
                // Generate a simple UID
                const uid = `CON-${Date.now()}`;
                setFormData((prev) => ({
                    ...prev,
                    uid: uid,
                }));
            }
            setErrors({});
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Consumer data:', {
                ...formData,
                utilities: selectedUtilities,
                shared_meter: sharedMeter,
                gps_coordinates: gps, // gps state was removed, so set to empty string
            });
            alert('Consumer created successfully!');
            navigate(isAdmin() ? '/admin/consumers' : '/user/consumers');
            setIsSubmitting(false);
        }, 1000);
    };

    const handleBuildingSelect = (name: string) => {
        setSelectedBuilding(name);
        setBuildingSearch(name);
        setFormData((prev) => ({
            ...prev,
            building_name: name,
        }));
    };

    const handleUtilityToggle = (key: string) => {
        setSelectedUtilities((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const handleGetLocation = () => {
        setGps('17.385044, 78.486671');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col gap-4">
            <Header
                title="Add Consumer"
                buttonsLabel="Cancel"
                variant="outline"
                size="medium"
                backButtonText="Back to Consumers"
                onClick={() => {
                    navigate(isAdmin() ? '/admin/consumers' : '/user/consumers');
                }}
            />
            <div className="flex flex-col lg:flex-row gap-6 w-full overflow-x-hidden justify-start items-start">
                <div className="flex flex-col lg:flex-row gap-6 w-full overflow-x-hidden justify-start items-start">
                {/* Sidebar Stepper */}
                <aside className="w-full lg:w-auto lg:min-w-fit lg:max-w-md bg-slate-50 rounded-2xl shadow-sm border border-gray-200 p-6   h-fit top-8 z-10 overflow-x-hidden">
                    <nav className="w-full flex flex-col space-y-6 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                        {stepLabels.map((step, idx) => {
                            const isCompleted = idx < currentStep - 1;
                            const isActive = idx === currentStep - 1;
                            const isClickable = idx < currentStep;
                            return (
                                <div
                                    key={step.label}
                                    className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-200 ${
                                        isClickable 
                                            ? 'cursor-pointer hover:bg-white/40' 
                                            : 'cursor-default'
                                    } ${
                                        isActive ? 'bg-white shadow-md' : ''
                                    }`}
                                    onClick={
                                        isClickable
                                            ? () => setCurrentStep(idx + 1)
                                            : undefined
                                    }
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 flex-shrink-0 ${
                                            isCompleted
                                                ? 'bg-green-500 text-white'
                                                : 'bg-blue-500 text-white'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <svg 
                                                className="w-5 h-5" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M5 13l4 4L19 7" 
                                                />
                                            </svg>
                                        ) : (
                                            <span>{idx + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <h3 className={`font-semibold text-base mb-1 ${
                                            isActive ? 'text-blue-600' : 'text-gray-900'
                                        }`}>
                                            {step.label}
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${
                                            isActive ? 'text-blue-500' : 'text-gray-500'
                                        }`}>
                                            {step.sub}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
                    <div className="flex flex-col gap-8 w-full overflow-x-hidden">
                        <form onSubmit={handleSubmit} className="w-full mx-auto overflow-x-hidden">
                            {currentStep === 1 && (
                                <Step1
                                    formData={formData}
                                    errors={errors}
                                    valid={valid}
                                    focus={focus}
                                    handleInputChange={handleInputChange}
                                    setFieldFocus={setFieldFocus}
                                    buildingSearch={buildingSearch}
                                    setBuildingSearch={setBuildingSearch}
                                    selectedBuilding={selectedBuilding}
                                    handleBuildingSelect={handleBuildingSelect}
                                    onNext={handleNext}
                                    isAdmin={isAdmin()}
                                />
                            )}
                            {currentStep === 2 && (
                                <Step2
                                    selectedUtilities={selectedUtilities}
                                    handleUtilityToggle={handleUtilityToggle}
                                    sharedMeter={sharedMeter}
                                    setSharedMeter={setSharedMeter}
                                    gps={gps} // gps state was removed, so pass empty string
                                    handleGetLocation={handleGetLocation}
                                    accountNumber={formData.uid}
                                    onNext={handleNext}
                                    onBack={handleBack}
                                />
                            )}
                            {currentStep === 3 && (
                                <Step3
                                    formData={formData}
                                    selectedUtilities={selectedUtilities}
                                    sharedMeter={sharedMeter}
                                    sharedConsumers={sharedConsumers}
                                    accountNumber={formData.uid}
                                    onBack={handleBack}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                            {errors.submit && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-800">{errors.submit}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </main>
                </div>
            </div>
        </div>
    );
};

export default AddConsumer;
