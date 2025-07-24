import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { z } from 'zod';
import Page from '@/components/global/PageC';
import Step1 from '@/pages_v2/AddConsumer/Step1';
import Step2 from '@/pages_v2/AddConsumer/Step2';
import Step3 from '@/pages_v2/AddConsumer/Step3';

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
    {
        label: 'Consumer & Property',
        sub: 'Provide all the details about the consumer and property',
    },
    {
        label: 'Meter & Location',
        sub: 'Provide the meter details and location details',
    },
    {
        label: 'Review & Submit',
        sub: 'Review all the details and submit the form',
    },
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
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
        // Simple validation for demonstration
        if (value.trim() !== '') {
            setValid((prev) => ({
                ...prev,
                [name]: true,
            }));
        } else {
            setValid((prev) => ({
                ...prev,
                [name]: false,
            }));
        }
    };

    const setFieldFocus = (field: string, focused: boolean) => {
        setFocus((prev) => ({
            ...prev,
            [field]: focused,
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
                gps_coordinates: gps,
            });
            alert('Consumer created successfully!');
            navigate('/consumers');
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

    // Prepare stepper steps data
    const stepperSteps = stepLabels.map((step, idx) => ({
        label: step.label,
        description: step.sub,
        isActive: idx === currentStep - 1,
        isCompleted: idx < currentStep - 1,
    }));

    // Prepare form content based on current step
    const getFormContent = () => {
        switch (currentStep) {
            case 1:
                return (
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
                );
            case 2:
                return (
                    <Step2
                        selectedUtilities={selectedUtilities}
                        handleUtilityToggle={handleUtilityToggle}
                        sharedMeter={sharedMeter}
                        setSharedMeter={setSharedMeter}
                        gps={gps}
                        handleGetLocation={handleGetLocation}
                        accountNumber={formData.uid}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                );
            case 3:
                return (
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
                );
            default:
                return null;
        }
    };

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        rows: [
                            {
                                layout: 'row',
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: 'Add Consumer',
                                            buttonsLabel: 'Cancel',
                                            variant: 'outline',
                                            size: 'medium',
                                            backButtonText: 'Back to Consumers',
                                            onClick: () => {
                                                navigate('/consumers');
                                            },
                                        },
                                    },
                                ],
                            },
                            {
                                layout: 'row',
                                gap: 'gap-8',
                                className: 'items-start',
                                columns: [
                                    {
                                        name: 'Stepper',
                                        props: {
                                            steps: stepperSteps,
                                            className:
                                                'w-full lg:w-auto lg:min-w-fit lg:max-w-md flex-shrink-0',
                                        },
                                    },
                                    {
                                        name: 'FormContainer',
                                        props: {
                                            children: (
                                                <form
                                                    onSubmit={handleSubmit}
                                                    className="w-full">
                                                    {getFormContent()}
                                                    {errors.submit && (
                                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                                            <p className="text-red-600">
                                                                {errors.submit}
                                                            </p>
                                                        </div>
                                                    )}
                                                </form>
                                            ),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ]}
            sectionWrapperClassName="min-h-screen flex flex-col gap-6"
        />
    );
};

export default AddConsumer;
