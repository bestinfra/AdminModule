import React, { useRef, useState, useMemo } from 'react';
import FormInput from '@components/Form/FormInput';
import Dropdown from '@components/global/Dropdown';
import Button from '@components/global/Button';
import LoadingSpinner from '@components/global/LoadingSpinner';
import type { FormInputValue } from '@components/Form/types';
import { validateAccessControl } from '../utils';
import RemarksPanel from '@pages/Apps_module/components/RemarksPanel';

export interface AccessControlData {
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminUsername: string;
  adminRole: string;
  newAccountRole: string;
  sendWelcomeEmail: boolean;
  newAccountFirstName: string;
  newAccountLastName: string;
  newAccountUsername: string;
  newAccountEmail: string;
  newAccountPhone: string;
  newAccountPassword: string;
  newAccountConfirmPassword: string;
  newAccounts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    confirmPassword: string;
  }>;
}

export interface AccessControlErrors {
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminPhone?: string;
  adminPassword?: string;
  adminConfirmPassword?: string;
  adminUsername?: string;
  adminRole?: string;
  newAccountRole?: string;
  newAccountFirstName?: string;
  newAccountLastName?: string;
  newAccountUsername?: string;
  newAccountEmail?: string;
  newAccountPhone?: string;
  newAccountPassword?: string;
  newAccountConfirmPassword?: string;
  newAccounts?: Array<{
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    password?: string;
    confirmPassword?: string;
  }>;
}

export interface AccessControlProps {
  formData: AccessControlData;
  errors: AccessControlErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onDropdownChange: (e: { target: { name: string; value: string | string[] } }) => void;
  loading?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentStep?: number;
  onBack?: () => void;
}



const AccessControl: React.FC<AccessControlProps> = ({
  formData,
  errors,
  onInputChange,
  loading = false,
  onSubmit,
  currentStep = 1,
  onBack,
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

  // Handle new account input changes
  const handleNewAccountChange = (accountId: string, field: string, value: string) => {
    const updatedAccounts = formData.newAccounts?.map(account => 
      account.id === accountId ? { ...account, [field]: value } : account
    ) || [];
    
    onInputChange({ 
      target: { 
        name: 'newAccounts', 
        value: updatedAccounts 
      } 
    } as any);
    
    if (hasSubmitted) setHasSubmitted(false);
  };

  // Add new account
  const addNewAccount = () => {
    const newAccount = {
      id: `account-${Date.now()}`,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: ''
    };
    
    const updatedAccounts = [...(formData.newAccounts || []), newAccount];
    onInputChange({ 
      target: { 
        name: 'newAccounts', 
        value: updatedAccounts 
      } 
    } as any);
  };

  // Remove account
  const removeAccount = (accountId: string) => {
    const updatedAccounts = formData.newAccounts?.filter(account => account.id !== accountId) || [];
    onInputChange({ 
      target: { 
        name: 'newAccounts', 
        value: updatedAccounts 
      } 
    } as any);
  };

  // Validate form data and generate remarks
  const { isValid, errors: validationErrors, remarks } = useMemo(() => {
    return validateAccessControl(formData);
  }, [
    formData.adminFirstName,
    formData.adminLastName,
    formData.adminUsername,
    formData.adminEmail,
    formData.adminPhone,
    formData.adminPassword,
    formData.adminConfirmPassword,
    formData.newAccounts,
    formData.newAccountFirstName,
    formData.newAccountLastName,
    formData.newAccountUsername,
    formData.newAccountEmail,
    formData.newAccountPhone,
    formData.newAccountPassword,
    formData.newAccountConfirmPassword,
    formData.newAccountRole,
    formData.sendWelcomeEmail
  ]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  // Helper function to get error for new account fields
  const getNewAccountError = (accountIndex: number, fieldName: string) => {
    const errorKey = `newAccounts.${accountIndex}.${fieldName}`;
    return (allErrors as any)[errorKey];
  };

  // Dropdown options for admin role
  const adminRoleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'user', label: 'User' },
  ];

  // Unified Dropdown handler
  const handleDropdownChange = (e: { target: { name: string; value: string | string[] } }) => {
    // Clear submitted state when user starts editing
    if (hasSubmitted) {
      setHasSubmitted(false);
    }
    onInputChange(e as any);
  };

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-xl border border-primary-border p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 p-4 flex flex-col gap-4">
          <div className="">
            <h2 className="text-base font-semibold text-primary">Access Control</h2>
            <p className="text-base text-gray-600 mt-2">Set up the primary administrator account for your application</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            setHasSubmitted(true);
            
            // Only proceed if validation passes
            if (isValid) {
              onSubmit(e);
            }
          }} action="#" method="post" noValidate aria-label="Admin Access Form" autoComplete="off">

        {/* Admin Access Section */}
        <div className="p-4 border border-primary-border rounded-xl">
          <div className="mb-4 flex items-start gap-4">
            <h3 className="text-sm font-semibold text-primary">Admin Access</h3>
            <div className='text-xs  px-4 py-1 rounded-full bg-primary-lightest'>Default</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <div>
              <FormInput
                input={{
                  name: 'adminFirstName',
                  type: 'text',
                  label: '',
                  placeholder: 'First Name',
                  required: true,
                }}
                value={formData.adminFirstName}
                error={allErrors.adminFirstName}
                showError={!!allErrors.adminFirstName}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <FormInput
                input={{
                  name: 'adminLastName',
                  type: 'text',
                  label: '',
                  placeholder: 'Last Name',
                  required: true,
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
          </div>
          
          {/* Username and Email */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <FormInput
                input={{
                  name: 'adminUsername',
                  type: 'text',
                  label: '',
                  placeholder: 'Username',
                  required: true,
                }}
                value={formData.adminUsername}
                error={allErrors.adminUsername}
                showError={!!allErrors.adminUsername}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <FormInput
                input={{
                  name: 'adminEmail',
                  type: 'email',
                  label: '',
                  placeholder: 'Email Address',
                  required: true,
                }}
                value={formData.adminEmail}
                error={allErrors.adminEmail}
                showError={!!allErrors.adminEmail}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
           
            <div>
              <FormInput
                input={{
                  name: 'adminPhone',
                  type: 'tel',
                  label: '',
                  placeholder: 'Mobile Number',
                  required: true,
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
             <div>
              <div className="w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-not-allowed dark:bg-primary-dark border border-primary-border dark:border-dark-border text-base font-medium border-neutral-light bg-gray-50">
                <span className="text-base">Admin</span>
                <span className="text-xs text-gray-400">Default</span>
              </div>
            </div>
          </div>
          {/* password */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <FormInput
                input={{
                  name: 'adminPassword',
                  type: 'password',
                  label: '',
                  placeholder: 'Password',
                  required: true,
                }}
                value={formData.adminPassword}
                error={allErrors.adminPassword}
                showError={!!allErrors.adminPassword}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <FormInput
                input={{
                  name: 'adminConfirmPassword',
                  type: 'password',
                  label: '',
                  placeholder: 'Confirm Password',
                  required: true,
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
          </div>
        </div>

        {/* New Accounts Section */}
        {formData.newAccounts?.map((account, index) => (
          <div key={account.id} className="p-4 border border-primary-border rounded-xl">
            <div className="mb-4 flex items-start gap-4 justify-between">
              <div className='h-full flex items-start gap-4'>
                <h3 className="text-sm font-semibold text-primary">New Account {index + 1}</h3> 
                <div className='text-xs bg-secondary-light px-4 py-1 rounded-full'>Optional</div>
              </div>
            
              <button
                type="button"
                onClick={() => removeAccount(account.id)}
                className='text-xs px-2 text-red-500 cursor-pointer flex items-center justify-center '
              >
                <span className=" flex items-center justify-center rounded-full ">
                  <img
                    src='/icons/trash.svg'
                    alt='delete'
                    className='w-7 h-7'
                    style={{ color: 'rgba(220, 39, 44, 1)' }}
                  />
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-firstName`,
                    type: 'text',
                    label: '',
                    placeholder: 'First Name',
                    required: false,
                  }}
                  value={account.firstName}
                  error={getNewAccountError(index, 'firstName')}
                  showError={!!getNewAccountError(index, 'firstName')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'firstName', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-lastName`,
                    type: 'text',
                    label: '',
                    placeholder: 'Last Name',
                    required: false,
                  }}
                  value={account.lastName}
                  error={getNewAccountError(index, 'lastName')}
                  showError={!!getNewAccountError(index, 'lastName')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'lastName', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-username`,
                    type: 'text',
                    label: '',
                    placeholder: 'Username',
                    required: false,
                  }}
                  value={account.username}
                  error={getNewAccountError(index, 'username')}
                  showError={!!getNewAccountError(index, 'username')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'username', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-email`,
                    type: 'email',
                    label: '',
                    placeholder: 'Email Address',
                    required: false,
                  }}
                  value={account.email}
                  error={getNewAccountError(index, 'email')}
                  showError={!!getNewAccountError(index, 'email')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'email', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-phone`,
                    type: 'tel',
                    label: '',
                    placeholder: 'Mobile Number',
                    required: false,
                  }}
                  value={account.phone}
                  error={getNewAccountError(index, 'phone')}
                  showError={!!getNewAccountError(index, 'phone')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'phone', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
              <div>
                <Dropdown
                  name={`newAccount-${account.id}-role`}
                  value={account.role}
                  onChange={(e) => handleNewAccountChange(account.id, 'role', e.target.value as string)}
                  options={adminRoleOptions}
                  placeholder="Select Role"
                  error={getNewAccountError(index, 'role')}
                  searchable={false}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-password`,
                    type: 'password',
                    label: '',
                    placeholder: 'Password',
                    required: false,
                  }}
                  value={account.password}
                  error={getNewAccountError(index, 'password')}
                  showError={!!getNewAccountError(index, 'password')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'password', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
              <div>
                <FormInput
                  input={{
                    name: `newAccount-${account.id}-confirmPassword`,
                    type: 'password',
                    label: '',
                    placeholder: 'Confirm Password',
                    required: false,
                  }}
                  value={account.confirmPassword}
                  error={getNewAccountError(index, 'confirmPassword')}
                  showError={!!getNewAccountError(index, 'confirmPassword')}
                  disabled={loading}
                  onInputChange={(_name, value) => handleNewAccountChange(account.id, 'confirmPassword', value as string)}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Default New Account Section */}
        <div className="p-4 border border-primary-border rounded-xl">
          <div className="mb-4 flex items-start gap-4 justify-between">
            <div className='h-full flex items-start gap-4'>
              <h3 className="text-sm font-semibold text-primary">New Account</h3> 
              <div className='text-xs bg-secondary-light px-4 py-1 rounded-full'>Optional</div>
            </div>
          
            <button
              type="button"
              onClick={addNewAccount}
              className='text-xs px-2 text-primary cursor-pointer flex items-center justify-center p-1'
            >
              <span
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{
                  filter:
                    'invert(17%) sepia(80%) saturate(749%) hue-rotate(180deg) brightness(90%) contrast(92%)',
                }}
              >
                <img
                  src='/icons/plus2.svg'
                  alt='add account'
                  className='w-6 h-6'
                />
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <FormInput
                input={{
                  name: 'newAccountFirstName',
                  type: 'text',
                  label: '',
                  placeholder: 'First Name',
                  required: false,
                }}
                value={formData.newAccountFirstName || ''}
                error={allErrors.newAccountFirstName}
                showError={!!allErrors.newAccountFirstName}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <FormInput
                input={{
                  name: 'newAccountLastName',
                  type: 'text',
                  label: '',
                  placeholder: 'Last Name',
                  required: false,
                }}
                value={formData.newAccountLastName || ''}
                error={allErrors.newAccountLastName}
                showError={!!allErrors.newAccountLastName}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <FormInput
                input={{
                  name: 'newAccountUsername',
                  type: 'text',
                  label: '',
                  placeholder: 'Username',
                  required: false,
                }}
                value={formData.newAccountUsername || ''}
                error={allErrors.newAccountUsername}
                showError={!!allErrors.newAccountUsername}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <FormInput
                input={{
                  name: 'newAccountEmail',
                  type: 'email',
                  label: '',
                  placeholder: 'Email Address',
                  required: false,
                }}
                value={formData.newAccountEmail || ''}
                error={allErrors.newAccountEmail}
                showError={!!allErrors.newAccountEmail}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <FormInput
                input={{
                  name: 'newAccountPhone',
                  type: 'tel',
                  label: '',
                  placeholder: 'Mobile Number',
                  required: false,
                }}
                value={formData.newAccountPhone || ''}
                error={allErrors.newAccountPhone}
                showError={!!allErrors.newAccountPhone}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <Dropdown
                name="newAccountRole"
                value={formData.newAccountRole}
                onChange={handleDropdownChange}
                options={adminRoleOptions}
                placeholder="Select Role"
                error={allErrors.newAccountRole}
                searchable={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div>
              <FormInput
                input={{
                  name: 'newAccountPassword',
                  type: 'password',
                  label: '',
                  placeholder: 'Password',
                  required: false,
                }}
                value={formData.newAccountPassword || ''}
                error={allErrors.newAccountPassword}
                showError={!!allErrors.newAccountPassword}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
            <div>
              <FormInput
                input={{
                  name: 'newAccountConfirmPassword',
                  type: 'password',
                  label: '',
                  placeholder: 'Confirm Password',  
                  required: false,
                }}
                value={formData.newAccountConfirmPassword || ''}
                error={allErrors.newAccountConfirmPassword}
                showError={!!allErrors.newAccountConfirmPassword}
                disabled={loading}
                onInputChange={handleFormInputChange}
                onInputBlur={handleFormInputBlur}
                fileInputRefs={fileInputRefs}
              />
            </div>
          </div>
        </div>

        {/* mail check box */}
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
            Email Login Credentials to Users
          </label>
        </div>
          <div className="flex justify-between items-center gap-4 mt-6">
          {currentStep > 1 && (
            <Button
              label="Previous"
              type="button"
              variant="secondary"
              onClick={onBack}
            />
          )}
          <div className="ml-auto flex items-center gap-4">
            <Button
              label={loading ? 'Saving...' : 'Next'}
              type="submit"
              variant="primary"
              disabled={loading}
            />
            {loading && <LoadingSpinner className="w-6 h-6" />}
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

export default AccessControl; 
