import React from 'react';
import type { CommonInputProps } from '@components/Form/types';

interface CheckboxInputProps extends CommonInputProps {
  value: boolean;
  label: string;
  description?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ 
  value, label, description, ...commonProps 
}) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer select-none gap-2">
      <span className="relative flex items-center m-0">
        <input
          {...commonProps}
          type="checkbox"
          checked={!!value}
          className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
        />
        <span className="w-5 h-5 flex items-center justify-center border rounded peer-checked:bg-secondary">
        
          {value && (
            <img
              src="/icons/LoginCheck.svg"
              alt="Check"
              className="w-3 h-3"
            />
          )}
        </span>
      </span>
      <span className="flex-1">
        <span className="block text-base font-medium text-text-primary dark:text-surface">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-text-secondary dark:text-neutral-light ">
            {description}
          </span>
        )}
      </span>
    </label>
  );
};

export default CheckboxInput; 
