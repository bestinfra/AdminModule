import React, { useRef, useState, useMemo } from 'react';
import FormInput from '../../../components/forms/FormInput';
import Button from '../../../components/global/Button';
import LoadingSpinner from '../../../components/global/LoadingSpinner';
import RemarksPanel from './RemarksPanel';
import type { FormInputValue } from '../../../components/forms/types';
import { validateAccessControl } from '../utils';

export interface AccessControlData {
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminRole: string;
  adminDepartment: string;
  adminAddress: string;
  sendWelcomeEmail: boolean;
}

export interface AccessControlErrors {
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminPhone?: string;
  adminPassword?: string;
  adminConfirmPassword?: string;
  adminRole?: string;
}

export interface AccessControlProps {
  formData: AccessControlData;
  errors: AccessControlErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDropdownChange: (e: { target: { name: string; value: string | string[] } }) => void;
  loading?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}



const AccessControl: React.FC<AccessControlProps> = ({
  formData,
  errors,
  onInputChange,
  loading = false,
  onSubmit,
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleFormInputChange = (name: string, value: FormInputValue) => {
    onInputChange({ target: { name, value: value as string } } as React.ChangeEvent<HTMLInputElement>);
    if (hasSubmitted) setHasSubmitted(false);
  };

  const handleFormInputBlur = () => {
    // Handle blur if needed
  };

  // Validate form data and generate remarks
  const { isValid, errors: validationErrors, remarks } = useMemo(() => {
    return validateAccessControl(formData);
  }, [formData]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-xl border border-primary-border p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 p-4 flex flex-col gap-4">
          <div className="">
            <h2 className="text-base font-semibold text-primary">Admin Access</h2>
            <p className="text-base text-gray-600 mt-2">Set up the primary administrator account for your application</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            setHasSubmitted(true);
            
            // Only proceed if validation passes
            if (isValid) {
              onSubmit(e);
            }
          }} action="#" method="post" noValidate aria-label="Admin Access Form" autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          <FormInput
            input={{
              name: 'adminFirstName',
              type: 'text',
              label: '',
              placeholder: 'Enter first name',
              required: true
            }}
            value={formData.adminFirstName}
            error={allErrors.adminFirstName}
            showError={!!allErrors.adminFirstName}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'adminLastName',
              type: 'text',
              label: '',
              placeholder: 'Enter last name',
              required: true
            }}
            value={formData.adminLastName}
            error={allErrors.adminLastName}
            showError={!!allErrors.adminLastName}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            input={{
              name: 'adminEmail',
              type: 'email',
              label: '',
              placeholder: 'Enter email address',
              required: true
            }}
            value={formData.adminEmail}
            error={allErrors.adminEmail}
            showError={!!allErrors.adminEmail}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'adminPhone',
              type: 'tel',
              label: '',
              placeholder: 'Enter phone number',
              required: true
            }}
            value={formData.adminPhone}
            error={allErrors.adminPhone}
            showError={!!allErrors.adminPhone}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">This will be your admin login email</p> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            input={{
              name: 'adminPassword',
              type: 'password',
              label: '',
              placeholder: 'Enter password',
              required: true
            }}
            value={formData.adminPassword}
            error={allErrors.adminPassword}
            showError={!!allErrors.adminPassword}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'adminConfirmPassword',
              type: 'password',
              label: '',
              placeholder: 'Confirm password',
              required: true
            }}
            value={formData.adminConfirmPassword}
            error={allErrors.adminConfirmPassword}
            showError={!!allErrors.adminConfirmPassword}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">Password must be at least 8 characters with uppercase, lowercase, number, and special character</p> */}
        
        <div>
          <label htmlFor="adminAddress" className="block text-sm font-medium text-main dark:text-white mb-1">
            Address
          </label>
          <textarea
            id="adminAddress"
            name="adminAddress"
            value={formData.adminAddress}
            onChange={onInputChange}
            placeholder="Enter address (optional)"
            disabled={loading}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-3xl bg-white dark:bg-primary-dark text-main dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 dark:disabled:bg-primary-dark-light disabled:cursor-not-allowed focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-dark-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="sendWelcomeEmail"
            name="sendWelcomeEmail"
            type="checkbox"
            checked={formData.sendWelcomeEmail}
            onChange={onInputChange}
            disabled={loading}
            className="w-4 h-4 accent-primary border-gray-300 dark:border-dark-border"
            aria-checked={formData.sendWelcomeEmail}
          />
          <label htmlFor="sendWelcomeEmail" className="text-sm font-medium text-main dark:text-white select-none">
            Send welcome email to admin
          </label>
        </div>
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Admin will receive login credentials and setup instructions via email</p> */}
        <div className="flex justify-end items-center gap-4 mt-6">
          <Button
            label={loading ? 'Saving...' : 'Submit'}
            type="submit"
            variant="primary"
            disabled={loading}
          />
          {loading && <LoadingSpinner className="w-6 h-6" />}
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

export default AccessControl; 