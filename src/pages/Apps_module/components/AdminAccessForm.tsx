import React, { useState } from 'react';
import FormInput from '../../../components/forms/FormInput';
import Dropdown from '../../../components/global/Dropdown';
import Button from '../../../components/global/Button';
import LoadingSpinner from '../../../components/global/LoadingSpinner';

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
  return (
    <section className="max-w-2xl mx-auto bg-white dark:bg-primary-dark rounded-xl shadow p-6 md:p-8">
      <h2 className="text-2xl font-bold text-main dark:text-white mb-1">Admin Access</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Set up the primary administrator account for your application</p>
      <form className="space-y-6" onSubmit={onSubmit} aria-label="Admin Access Form" autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="First Name"
            type="text"
            value={formData.adminFirstName}
            onChange={onInputChange}
            name="adminFirstName"
            placeholder="Enter first name"
            required
            error={errors.adminFirstName}
            disabled={loading}
          />
          <FormInput
            label="Last Name"
            type="text"
            value={formData.adminLastName}
            onChange={onInputChange}
            name="adminLastName"
            placeholder="Enter last name"
            required
            error={errors.adminLastName}
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email Address"
            type="email"
            value={formData.adminEmail}
            onChange={onInputChange}
            name="adminEmail"
            placeholder="Enter email address"
            required
            error={errors.adminEmail}
            disabled={loading}
            aria-describedby="admin-email-help"
          />
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.adminPhone}
            onChange={onInputChange}
            name="adminPhone"
            placeholder="Enter phone number"
            required
            error={errors.adminPhone}
            disabled={loading}
          />
        </div>
        <p id="admin-email-help" className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">This will be your admin login email</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Password"
            type="password"
            value={formData.adminPassword}
            onChange={onInputChange}
            name="adminPassword"
            placeholder="Enter password"
            required
            error={errors.adminPassword}
            disabled={loading}
            aria-describedby="admin-password-help"
          />
          <FormInput
            label="Confirm Password"
            type="password"
            value={formData.adminConfirmPassword}
            onChange={onInputChange}
            name="adminConfirmPassword"
            placeholder="Confirm password"
            required
            error={errors.adminConfirmPassword}
            disabled={loading}
          />
        </div>
        <p id="admin-password-help" className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">Password must be at least 8 characters with uppercase, lowercase, number, and special character</p>
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
            label="Department"
            type="text"
            value={formData.adminDepartment}
            onChange={onInputChange}
            name="adminDepartment"
            placeholder="Enter department (optional)"
            disabled={loading}
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