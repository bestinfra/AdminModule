import React from 'react';
import type { CommonInputProps } from '../types';

interface CheckboxInputProps extends CommonInputProps {
  value: boolean;
  label: string;
  description?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ 
  value, label, description, ...commonProps 
}) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer select-none">
      <span className="relative flex items-center">
        <input
          {...commonProps}
          type="checkbox"
          checked={!!value}
          className="peer absolute opacity-0 w-5 h-5 cursor-pointer"
        />
        <span
          className={`w-5 h-5 flex items-center justify-center border-2 rounded transition-colors
            border-[var(--color-primary-border)] bg-white dark:bg-[var(--color-dark-primary)]
            peer-checked:bg-[var(--color-secondary)] peer-checked:border-[var(--color-secondary)]
          `}
        >
          {value && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8.5L7 11.5L12 5.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
      <span className="flex-1">
        <span className="block text-base font-medium text-[var(--color-main)] dark:text-[var(--color-surface)]">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mt-1">
            {description}
          </span>
        )}
      </span>
    </label>
  );
};

export default CheckboxInput; 