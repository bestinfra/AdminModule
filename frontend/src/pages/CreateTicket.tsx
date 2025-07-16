import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '@components/forms/FormInput';
import Dropdown from '@components/global/Dropdown';
import Button from '@components/global/Button';
import type { FormInputValue } from '@components/forms/types';

interface TicketFormData {
    consumerName: string;
    consumerNo: string;
    mobile: string;
    email: string;
    priority: string;
    category: string;
    subject: string;
    description: string;
    assignedTo: string;
    department: string;
    attachments: File[];
}

const CreateTicket: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TicketFormData>({
        consumerName: '',
        consumerNo: '',
        mobile: '',
        email: '',
        priority: '',
        category: '',
        subject: '',
        description: '',
        assignedTo: '',
        department: '',
        attachments: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const fileInputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});

    const handleInputChange = (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => {
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
    };

    const handleFormInputChange = (name: string, value: FormInputValue) => {
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
    };

    const handleFormInputBlur = () => {
        // Handle blur if needed
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                attachments: Array.from(e.target.files || [])
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.consumerName.trim()) {
            newErrors.consumerName = 'Consumer name is required';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.priority) {
            newErrors.priority = 'Priority is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Creating ticket with data:', formData);
            
            // Navigate back to tickets page after successful creation
            navigate('/all-tickets');
        } catch (error) {
            console.error('Error creating ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/all-tickets');
    };

    // Dropdown options
    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
    ];

    const categoryOptions = [
        { value: 'technical', label: 'Technical' },
        { value: 'billing', label: 'Billing' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'security', label: 'Security' },
        { value: 'general', label: 'General' },
        { value: 'customer-service', label: 'Customer Service' }
    ];

    const departmentOptions = [
        { value: 'it', label: 'IT' },
        { value: 'finance', label: 'Finance' },
        { value: 'operations', label: 'Operations' },
        { value: 'customer-service', label: 'Customer Service' },
        { value: 'management', label: 'Management' }
    ];

    const assigneeOptions = [
        { value: 'john-doe', label: 'John Doe' },
        { value: 'jane-smith', label: 'Jane Smith' },
        { value: 'mike-johnson', label: 'Mike Johnson' },
        { value: 'sarah-wilson', label: 'Sarah Wilson' },
        { value: 'tom-anderson', label: 'Tom Anderson' }
    ];

    return (
        <div className="mx-auto">
            <div className="bg-white rounded-xl border border-primary-border p-4">
                <div className="p-4 flex flex-col gap-4">
                    <div className="">
                        <h2 className="text-base font-semibold text-primary">Create New Ticket</h2>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                        {/* Consumer Information Section */}
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'consumerName',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Consumer Name',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.consumerName}
                                        error={errors.consumerName}
                                        showError={!!errors.consumerName}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>

                                <div>
                                    <FormInput
                                        input={{
                                            name: 'consumerNo',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Consumer No',
                                            required: false,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.consumerNo}
                                        error={errors.consumerNo}
                                        showError={!!errors.consumerNo}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>

                                <div>
                                    <FormInput
                                        input={{
                                            name: 'mobile',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Mobile',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.mobile}
                                        error={errors.mobile}
                                        showError={!!errors.mobile}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact & Priority Section */}
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'email',
                                            type: 'email',
                                            label: '',
                                            placeholder: 'Email',
                                            required: false,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.email}
                                        error={errors.email}
                                        showError={!!errors.email}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>

                                <div>
                                    <Dropdown
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        options={priorityOptions}
                                        placeholder="Select Priority"
                                        error={errors.priority}
                                    />
                                </div>

                                <div>
                                    <Dropdown
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        options={departmentOptions}
                                        placeholder="Select Department"
                                        error={errors.department}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category Section */}
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        options={categoryOptions}
                                        placeholder="Select Category"
                                        error={errors.category}
                                    />
                                </div>

                                <div>
                                    <Dropdown
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleInputChange}
                                        options={assigneeOptions}
                                        placeholder="Assign To"
                                        error={errors.assignedTo}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subject Section */}
                        <div className="">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <FormInput
                                        input={{
                                            name: 'subject',
                                            type: 'text',
                                            label: '',
                                            placeholder: 'Subject',
                                            required: true,
                                            className: 'w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-gray-300',
                                        }}
                                        value={formData.subject}
                                        error={errors.subject}
                                        showError={!!errors.subject}
                                        disabled={false}
                                        onInputChange={handleFormInputChange}
                                        onInputBlur={handleFormInputBlur}
                                        fileInputRefs={fileInputRefs}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Description"
                                        rows={4}
                                        className={`w-full px-4 py-3.5 rounded-xl border text-base font-medium resize-none ${
                                            errors.description 
                                                ? 'border-danger focus:border-danger' 
                                                : 'border-primary-border dark:border-dark-border focus:border-primary'
                                        } dark:bg-primary-dark text-neutral-darker dark:text-surface placeholder-neutral-dark dark:placeholder-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                                    />
                                    {errors.description && (
                                        <p className="text-danger text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="px-4 py-2 border border-neutral-light rounded-lg cursor-pointer hover:bg-primary-lightest transition-colors"
                                        >
                                            Choose Files
                                        </label>
                                        <span className="text-sm text-neutral">
                                            {formData.attachments.length > 0 
                                                ? `${formData.attachments.length} file(s) selected`
                                                : 'No file chosen'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-primary-border">
                            <Button
                                label="Cancel"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                            />
                            <Button
                                label={loading ? "Creating..." : "Submit"}
                                variant="primary"
                                type="submit"
                                loading={loading}
                                disabled={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTicket;
