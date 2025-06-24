import React, { useState, useCallback, useRef } from 'react';
import Button from '../global/Button';

// Type definitions for form configuration and props
interface FormInputConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'checkbox' | 'textarea' | 'select' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  colSpan?: number;
  icon?: string;
  description?: string;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
}

interface FormProps {
  inputs: FormInputConfig[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridCols?: 1 | 2 | 3 | 4 | 5 | 6;
  disabled?: boolean;
  showCancel?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  formId?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'card' | 'minimal';
}

// Internal state types for form data and validation errors
interface FormData {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

const Form: React.FC<FormProps> = ({
  inputs,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  className = '',
  layout = 'grid',
  gridCols = 3,
  disabled = false,
  showCancel = false,
  isLoading = false,
  onCancel,
  formId = 'form',
  title,
  subtitle,
  variant = 'default'
}) => {
  // Initialize form data with default values based on input types
  const initialData: FormData = inputs.reduce((acc: FormData, input) => {
    acc[input.name] = input.defaultValue || 
      (input.type === 'checkbox' ? false : 
       input.type === 'file' ? null : '');
    return acc;
  }, {});

  // Form state management
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Field validation function - checks required fields, patterns, lengths, and custom validation
  const validateField = useCallback((name: string, value: any, config: FormInputConfig): string | null => {
    // Required field validation
    if (config.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${config.label} is required`;
    }

    // Skip validation if no value and not required
    if (!value || !config.validation) {
      return null;
    }

    const { validation } = config;

    // Pattern validation using regex
    if (validation.pattern && !validation.pattern.test(value)) {
      return `${config.label} format is invalid`;
    }

    // String length validation
    if (validation.minLength && value.length < validation.minLength) {
      return `${config.label} must be at least ${validation.minLength} characters`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `${config.label} must be no more than ${validation.maxLength} characters`;
    }

    // Numeric value validation
    if (validation.min && Number(value) < validation.min) {
      return `${config.label} must be at least ${validation.min}`;
    }
    if (validation.max && Number(value) > validation.max) {
      return `${config.label} must be no more than ${validation.max}`;
    }

    // Custom validation function
    if (validation.custom) {
      return validation.custom(value);
    }

    return null;
  }, []);

  // Input change handler - updates form data and validates if field has been touched
  const handleInputChange = useCallback((name: string, value: any, config: FormInputConfig) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Only validate if field has been touched (user has interacted with it)
    if (touched.has(name)) {
      const error = validateField(name, value, config);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  }, [touched, validateField]);

  // Input blur handler - marks field as touched and validates
  const handleInputBlur = useCallback((name: string, value: any, config: FormInputConfig) => {
    setTouched(prev => new Set(prev).add(name));
    const error = validateField(name, value, config);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  }, [validateField]);

  // Form submission handler - validates all fields before submitting
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all form fields
    const newErrors: FormErrors = {};
    let hasErrors = false;
    
    inputs.forEach(input => {
      const error = validateField(input.name, formData[input.name], input);
      if (error) {
        newErrors[input.name] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    // Only submit if no validation errors
    if (!hasErrors) {
      onSubmit(formData);
    }
  }, [formData, inputs, onSubmit, validateField]);

  // Form cancellation handler - resets form state
  const handleCancel = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched(new Set());
    if (onCancel) {
      onCancel();
    }
  }, [initialData, onCancel]);

  // Renders individual form input based on type
  const renderInput = (input: FormInputConfig) => {
    const { name, type, label, placeholder, required, defaultValue, options, className: inputClassName, colSpan = 1, icon, description } = input;
    const value = formData[name];
    const error = errors[name];
    const showError = error && touched.has(name);

    // Generate CSS grid span class based on column span
    const getGridSpanClass = (span: number) => {
      switch (span) {
        case 1: return 'col-span-1';
        case 2: return 'col-span-2';
        case 3: return 'col-span-3';
        case 4: return 'col-span-4';
        case 5: return 'col-span-5';
        case 6: return 'col-span-6';
        default: return 'col-span-1';
      }
    };

    const gridSpanClass = getGridSpanClass(colSpan);
    
    // Render different input types with appropriate styling and functionality
    const renderInputByType = () => {
      switch (type) {
        case 'textarea':
          return (
            <textarea
              id={name}
              name={name}
              value={value}
              placeholder={placeholder || label}
              required={required}
              disabled={disabled}
              className={`input textarea ${inputClassName || ''}`}
              onChange={(e) => handleInputChange(name, e.target.value, input)}
              onBlur={(e) => handleInputBlur(name, e.target.value, input)}
            />
          );

        case 'select':
          return (
            <div className="relative">
              <select
                id={name}
                name={name}
                value={value}
                required={required}
                disabled={disabled}
                className={`input select ${inputClassName || ''}`}
                onChange={(e) => handleInputChange(name, e.target.value, input)}
                onBlur={(e) => handleInputBlur(name, e.target.value, input)}
              >
                <option value="" disabled selected>{placeholder || label}</option>
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );

        case 'file':
          const setRef = (el: HTMLInputElement | null) => {
            fileInputRefs.current[name] = el;
          };
          return (
            <div className="relative flex flex-col gap-5">
              <div className="flex items-center justify-between p-4 border border-gray-200/60 bg-white rounded-xl">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => fileInputRefs.current[name]?.click()}
                    label="Choose File"
                  />
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {value?.[0]?.name || 'No file chosen'}
                  </span>
                </div>
                {icon && (
                  <img src={icon} alt="" className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          );

        case 'checkbox':
          return (
            <div className="flex items-start space-x-3 p-4 bg-gray-50/50 border-b border-gray-200/60">
              <input
                id={name}
                name={name}
                type="checkbox"
                checked={!!value}
                disabled={disabled}
                className="input"
                onChange={(e) => handleInputChange(name, e.target.checked, input)}
                onBlur={() => handleInputBlur(name, value, input)}
              />
              <div className="flex-1">
                <label htmlFor={name} className="block text-sm font-medium text-gray-900">
                  {label}
                </label>
                {description && (
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}
              </div>
            </div>
          );

        default: // text, email, password, number, date
          return (
            <div className="relative">
              <input
                id={name}
                name={name}
                type={type}
                value={value || ''}
                placeholder={placeholder || label}
                required={required}
                disabled={disabled}
                className={`input ${icon ? 'pr-12' : ''} ${inputClassName || ''}`}
                onChange={(e) => handleInputChange(name, e.target.value, input)}
                onBlur={(e) => handleInputBlur(name, e.target.value, input)}
              />
              {icon && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <img src={icon} alt="" className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          );
      }
    };

    return (
      <div key={name} className={`w-full ${gridSpanClass}`}>
        <div className="space-y-2 flex flex-col gap-2">
          {/* Label */}
          <label htmlFor={name} className="label">
            {label}
          </label>
          
          {/* Input Field */}
          <div className="relative ">
            {renderInputByType()}
          </div>
          
          {/* Description */}
          {description && !showError && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        
      </div>
    );
  };
  
  // Get the appropriate grid columns class based on gridCols
  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-3';
    }
  };

  const layoutClasses = `grid ${getGridColsClass(gridCols)} gap-6`;
  
  // Form container classes based on variant
  const getFormContainerClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-white p-8';
      case 'minimal':
        return 'bg-transparent p-0';
      default:
        return 'bg-gradient-to-br from-slate-50 to-slate-100 p-8';
    }
  };

  return (
    <div className={`w-full ${getFormContainerClasses()} ${className}`}>
    <form
      id={formId}
      onSubmit={handleSubmit}
        className="w-full"
      noValidate
    >
        {/* Form Header */}
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            )}
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* Form Fields */}
      <div className={layoutClasses}>
        {inputs.map(renderInput)}
      </div>
      
        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-gray-200/60">
          {showCancel && (
            <Button
              onClick={handleCancel}
              disabled={disabled || isLoading}
              label={cancelLabel}
              variant="secondary"
            />
          )}
          
          <Button
            disabled={disabled || isLoading}
            variant="primary"
            label={isLoading ? 'Loading...' : submitLabel}
          />
        </div>
    </form>
    </div>
  );
};

export default Form; 