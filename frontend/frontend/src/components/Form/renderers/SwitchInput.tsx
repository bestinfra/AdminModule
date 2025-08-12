import React from 'react';
import type { CommonInputProps } from '@components/Form/types';

interface SwitchInputProps extends CommonInputProps {
  value: boolean;
  label?: string;
  description?: string;
}

const SwitchInput: React.FC<SwitchInputProps> = ({
  value,
  label,
  description,
  ...commonProps
}) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer select-none">
      <span className="relative inline-flex items-center">
        <input
          {...commonProps}
          type="checkbox"
          checked={!!value}
          className="sr-only peer"
        />
        <span
          className={`w-11 h-6 flex items-center bg-gray-200 dark:bg-[var(--color-dark-primary)] rounded-full p-1 transition-colors
            peer-checked:bg-[var(--color-secondary)] peer-focus:ring-2 peer-focus:ring-[var(--color-secondary)]`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform
              ${value ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </span>
      </span>
      {label && (
        <span className="block text-base font-medium text-[var(--color-main)] dark:text-[var(--color-surface)]">{label}</span>
      )}
      {description && (
        <span className="block text-xs text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mt-1">{description}</span>
      )}
    </label>
  );
};

export default SwitchInput; 
