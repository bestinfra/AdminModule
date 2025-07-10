import React from 'react';
import type { CommonInputProps } from '../types';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends CommonInputProps {
  value: string;
  placeholder?: string;
  options?: SelectOption[];
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  value, placeholder, options, ...commonProps 
}) => {
  return (
    <div className="relative">
      <select {...commonProps} value={value || ''} className={`${commonProps.className} select`}>
        <option value="" disabled>{placeholder || 'Select an option'}</option>
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput; 