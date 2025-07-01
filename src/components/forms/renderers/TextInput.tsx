import React from 'react';
import type { CommonInputProps } from '../types';

interface TextInputProps extends CommonInputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'date';
  value: string;
  placeholder?: string;
  icon?: string;
}

const TextInput: React.FC<TextInputProps> = ({ 
  type, value, placeholder, icon, ...commonProps 
}) => {
  return (
    <div className="relative">
      <input 
        {...commonProps} 
        type={type} 
        value={value || ''} 
        placeholder={placeholder} 
        className={`${commonProps.className} ${icon ? 'pr-12' : ''}`} 
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <img src={icon} alt="" className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default TextInput; 