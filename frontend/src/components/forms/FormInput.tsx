import React, { memo } from 'react';
import { CLASSES } from '@components/forms/constants';
import type { 
  FormInputProps, 
  FormInputEvent, 
  FormBlurEvent, 
  CommonInputProps,
  FormInputValue 
} from '@components/forms/types';
import {
  TextInput,
  TextareaInput,
  SelectInput,
  FileInput,
  CheckboxInput
} from '@components/forms/renderers';

const FormInput: React.FC<FormInputProps> = ({ 
  input, value, error, showError, disabled, onInputChange, onInputBlur, fileInputRefs 
}) => {
  const { name, type, label, placeholder, required, options, className: inputClassName, colSpan = 1, icon, description } = input;
  
  const gridSpanClass = CLASSES.grid[colSpan as keyof typeof CLASSES.grid] || 'col-span-1';
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;

  // Helper function to extract value from event based on input type
  const extractValueFromEvent = (event: FormInputEvent): FormInputValue => {
    const target = event.target;
    
    if (target.type === 'checkbox') {
      return (target as HTMLInputElement).checked;
    }
    
    if (target.type === 'file') {
      return (target as HTMLInputElement).files;
    }
    
    return target.value;
  };

  // Helper function to extract value from blur event
  const extractValueFromBlurEvent = (event: FormBlurEvent): FormInputValue => {
    const target = event.target;
    
    if (target.type === 'checkbox') {
      return (target as HTMLInputElement).checked;
    }
    
    if (target.type === 'file') {
      return (target as HTMLInputElement).files;
    }
    
    return target.value;
  };

  const commonProps: CommonInputProps = {
    id: name,
    name,
    required,
    disabled,
    className: `w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer dark:bg-primary-dark border-primary-border dark:border-dark-border text-base font-medium ${showError ? 'border-red-500' : 'border-gray-300'} ${inputClassName || ''}`,
    onChange: (event: FormInputEvent) => {
      const extractedValue = extractValueFromEvent(event);
      onInputChange(name, extractedValue, input);
    },
    onBlur: (event: FormBlurEvent) => {
      const extractedValue = extractValueFromBlurEvent(event);
      onInputBlur(name, extractedValue, input);
    },
    // Add ARIA attributes for accessibility
    'aria-invalid': showError ? 'true' : 'false',
    'aria-describedby': showError ? errorId : description ? descriptionId : undefined,
    'aria-required': required ? 'true' : 'false'
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <TextareaInput
            {...commonProps}
            value={value as string}
            placeholder={placeholder || label}
          />
        );
      
      case 'select':
        return (
          <SelectInput
            {...commonProps}
            value={value as string}
            placeholder={placeholder || `Select ${label}`}
            options={options}
          />
        );

      case 'file':
        return (
          <FileInput
            {...commonProps}
            value={value as FileList}
            icon={icon}
            fileInputRefs={fileInputRefs}
          />
        );

      case 'checkbox':
        return (
          <CheckboxInput
            {...commonProps}
            value={value as boolean}
            label={label || ''}
            description={description}
          />
        );

      default:
        return (
          <TextInput
            {...commonProps}
            type={type}
            value={value as string}
            placeholder={placeholder || label}
            icon={icon}
          />
        );
    }
  };

  return (
    <div className={`w-full ${gridSpanClass}`}>
      <div className="space-y-2 flex flex-col gap-2">
        {label && (
          <label htmlFor={name} className="label">
            {label}
          </label>
        )}
        <div className="relative">{renderInput()}</div>
        
        {/* Accessible description */}
        {description && !showError && (
          <p 
            id={descriptionId}
            className="text-sm text-gray-500"
            role="note"
          >
            {description}
          </p>
        )}
        
        {/* Accessible error message */}
        {showError && error && (
          <div 
            id={errorId}
            className="text-sm text-red-500"
            role="alert"
            aria-live="polite"
          >
            <span className="sr-only">Error: </span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

FormInput.displayName = 'FormInput';

export default memo(FormInput); 