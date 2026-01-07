import React from 'react';
import { Form } from '@components/Form';
import type { FormInputConfig } from '@components/Form';

// Dummy data for password requirements
const dummyPasswordRequirements = [
  { label: 'Minimum 8 characters long', test: (v: string) => v.length >= 8 },
  { label: 'At least one lowercase character', test: (v: string) => /[a-z]/.test(v) },
  { label: 'At least one uppercase character', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'At least one number', test: (v: string) => /[0-9]/.test(v) },
  { label: 'At least one special character', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

interface PasswordRequirementsProps {
  requirements?: Array<{ label: string; test: (value: string) => boolean }>;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ 
  requirements = dummyPasswordRequirements 
}) => {
  return (
    <section className="flex-1 flex flex-col gap-2">
      <h3 className="font-semibold text-lg mb-1">Password requirements:</h3>
      <p className="text-neutral mb-2">Ensure that these requirements are met:</p>
      <ul className="text-sm space-y-1">
        {requirements.map((req, idx) => (
          <li key={req.label} className="flex items-center gap-2">
            <span className="font-bold text-lg text-neutral">✗</span>
            <span className={idx === 0 ? 'font-semibold' : ''}>
              {req.label}
              {idx === 0 && <span className="font-normal text-xs ml-2">- the more, the better</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

interface ChangePasswordProps {
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  passwordRequirements?: Array<{ label: string; test: (value: string) => boolean }>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ 
  onSubmit, 
  onCancel,
  passwordRequirements 
}) => {
  const formInputs: FormInputConfig[] = [
    {
      name: 'currentPassword',
      type: 'password',
      placeholder: 'Enter Current Password',
      required: true,
      showPasswordToggle: true,
      validation: {
        minLength: 1,
        custom: (value) => {
          if (!value || String(value).trim() === '') {
            return 'Current password is required';
          }
          return null;
        }
      }
    },
    {
      name: 'newPassword',
      type: 'password',
      placeholder: 'Enter New Password',
      required: true,
      showPasswordToggle: true,
      validation: {
        minLength: 8,
        custom: (value) => {
          if (!value || String(value).length < 8) {
            return 'Password must be at least 8 characters long';
          }
          return null;
        }
      }
    },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm New Password',
      required: true,
      showPasswordToggle: true,
      validation: {
        custom: (value) => {
          if (!value || String(value).trim() === '') {
            return 'Please confirm your new password';
          }
          return null;
        }
      }
    }
  ];

  const handleSubmit = (data: Record<string, any>) => {
    if (data.newPassword !== data.confirmPassword) {
      // Handle password mismatch error
      console.error('Passwords do not match');
      return;
    }
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log('Form submitted:', data);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <section className="flex flex-col md:flex-row gap-10 w-full">
      <article className="flex-1">
        <Form
          inputs={formInputs}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          cancelLabel="Cancel"
          border='border-none'
          padding='p-0'
          showFormActions={true}
          cancelAction={handleCancel}
          formBackground=""
          className="space-y-6"
          gridLayout={{
            gridRows: 3,
            gridColumns: 1,
            gap: 'gap-2',
            className: 'w-full'
          }}
        />
      </article>
      <PasswordRequirements requirements={passwordRequirements} />
    </section>
  );
};

export default ChangePassword; 