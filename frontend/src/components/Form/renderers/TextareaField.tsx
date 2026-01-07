import React from 'react';
import type { CommonInputProps } from '@components/Form/types';

interface TextareaFieldProps extends CommonInputProps {
  value: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  value, label, placeholder, description, ...commonProps
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">
          {label}
        </label>
      )}
      <textarea
        {...commonProps}
        value={value}
        placeholder={placeholder}
        className={`${commonProps.className} textarea border border-primary-border rounded-xl outline-none focus:ring-0 focus:border-none`}
      />
      {description && <span className="block text-xs text-[var(--color-light)] dark:text-[var(--color-neutral-light)] ">{description}</span>}
    </div>
  );
};

export default TextareaField; 
