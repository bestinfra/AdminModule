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
      <textarea
        {...commonProps}
        value={value}
        placeholder={placeholder}
        className={`${commonProps.className} textarea `}
      />
      {description && <span className="block text-xs text-[var(--color-light)] dark:text-[var(--color-neutral-light)] mt-1">{description}</span>}
    </div>
  );
};

export default TextareaField; 
