import React, { useState, useRef } from 'react';
import FormInput from '../../../components/forms/FormInput';
import Dropdown from '../../../components/global/Dropdown';
import Button from '../../../components/global/Button';
import LoadingSpinner from '../../../components/global/LoadingSpinner';
import type { FormInputValue } from '../../../components/forms/types';

export interface AdminAccessFormData {
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

export interface AdminAccessFormErrors {
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminPhone?: string;
  adminPassword?: string;
  adminConfirmPassword?: string;
  adminRole?: string;
}

export interface AdminAccessFormProps {
  formData: AdminAccessFormData;
  errors: AdminAccessFormErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDropdownChange: (e: { target: { name: string; value: string | string[] } }) => void;
  loading?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const roleOptions = [
  { value: '', label: 'Select admin role' },
  { value: 'super-admin', label: 'Super Administrator' },
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
];

const AdminAccessForm: React.FC<AdminAccessFormProps> = ({
  formData,
  errors,
  onInputChange,
  onDropdownChange,
  loading = false,
  onSubmit,
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFormInputChange = (name: string, value: FormInputValue) => {
    onInputChange({ target: { name, value: value as string } } as any);
  };

  const handleFormInputBlur = (name: string, value: FormInputValue) => {
    // Handle blur if needed
  };

  return (
    <section className="max-w-2xl mx-auto bg-white dark:bg-primary-dark rounded-xl shadow p-6 md:p-8">
      <h2 className="text-2xl font-bold text-main dark:text-white mb-1">Admin Access</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Set up the primary administrator account for your application</p>
      <form className="space-y-6" onSubmit={onSubmit} action="#" method="post" noValidate aria-label="Admin Access Form" autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            input={{
              name: 'adminFirstName',
              type: 'text',
              label: 'First Name',
              placeholder: 'Enter first name',
              required: true
            }}
            value={formData.adminFirstName}
            error={errors.adminFirstName}
            showError={!!errors.adminFirstName}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'adminLastName',
              type: 'text',
              label: 'Last Name',
              placeholder: 'Enter last name',
              required: true
            }}
            value={formData.adminLastName}
            error={errors.adminLastName}
            showError={!!errors.adminLastName}
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
              label: 'Email Address',
              placeholder: 'Enter email address',
              required: true
            }}
            value={formData.adminEmail}
            error={errors.adminEmail}
            showError={!!errors.adminEmail}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'adminPhone',
              type: 'tel',
              label: 'Phone Number',
              placeholder: 'Enter phone number',
              required: true
            }}
            value={formData.adminPhone}
            error={errors.adminPhone}
            showError={!!errors.adminPhone}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">This will be your admin login email</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            input={{
              name: 'adminPassword',
              type: 'password',
              label: 'Password',
              placeholder: 'Enter password',
              required: true
            }}
            value={formData.adminPassword}
            error={errors.adminPassword}
            showError={!!errors.adminPassword}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'adminConfirmPassword',
              type: 'password',
              label: 'Confirm Password',
              placeholder: 'Confirm password',
              required: true
            }}
            value={formData.adminConfirmPassword}
            error={errors.adminConfirmPassword}
            showError={!!errors.adminConfirmPassword}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">Password must be at least 8 characters with uppercase, lowercase, number, and special character</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="adminRole" className="block text-sm font-medium text-main dark:text-white mb-1">
              Admin Role <span className="text-error">*</span>
            </label>
            <Dropdown
              name="adminRole"
              value={formData.adminRole}
              onChange={onDropdownChange}
              options={roleOptions}
              placeholder="Select admin role"
              required
              error={errors.adminRole}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Super Administrator has full access to all features</p>
          </div>
          <FormInput
            input={{
              name: 'adminDepartment',
              type: 'text',
              label: 'Department',
              placeholder: 'Enter department (optional)'
            }}
            value={formData.adminDepartment}
            error={undefined}
            showError={false}
            disabled={loading}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-primary-dark text-main dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 dark:disabled:bg-primary-dark-light disabled:cursor-not-allowed"
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Admin will receive login credentials and setup instructions via email</p>
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
    </section>
  );
};

export default AdminAccessForm; 