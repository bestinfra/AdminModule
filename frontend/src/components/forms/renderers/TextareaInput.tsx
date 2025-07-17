import React from 'react';
import type { CommonInputProps } from '@components/forms/types';

interface TextareaInputProps extends CommonInputProps {
  value: string;
  placeholder?: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({ 
  value, placeholder, ...commonProps 
}) => {
  return (
    <textarea 
      {...commonProps} 
      value={value} 
      placeholder={placeholder} 
      className={`${commonProps.className} textarea`} 
    />
  );
};

export default TextareaInput; 