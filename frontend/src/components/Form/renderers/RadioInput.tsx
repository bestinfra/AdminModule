import React from 'react';
import type { CommonInputProps } from '@components/Form/types';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioInputProps extends CommonInputProps {
  value: string;
  options?: RadioOption[];
  label?: string;
  description?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  value,
  options = [],
  label,
  description,
  ...commonProps
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="block text-base font-medium text-[var(--color-main)] dark:text-[var(--color-surface)]">{label}</span>
      )}
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              {...commonProps}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => {
                if (commonProps.onChange) commonProps.onChange(e);
              }}
              className="peer opacity-0 absolute w-5 h-5 cursor-pointer"
            />
            <span
              className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors
                border-[var(--color-primary-border)] bg-white dark:bg-[var(--color-dark-primary)]
                peer-checked:bg-[var(--color-secondary)] peer-checked:border-[var(--color-secondary)]
              `}
            >
              {value === option.value && (
                <span className="block w-3 h-3 rounded-full bg-white" />
              )}
            </span>
            <span className="text-base text-[var(--color-main)] dark:text-[var(--color-surface)]">{option.label}</span>
          </label>
        ))}
      </div>
      {description && (
        <span className="block text-xs text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mt-1">{description}</span>
      )}
    </div>
  );
};

export default RadioInput; 
