import React, { useState, useCallback, useRef, useMemo, memo } from 'react';
import Button from '../global/Button';
import FormInput from './FormInput';
import { CLASSES } from './constants';
import type { FormProps, FormInputConfig, FormInputValue } from './types';
import { getDefaultValue, formatPhone, validateField } from './utils';

const Form: React.FC<FormProps> = ({
  inputs, onSubmit, submitLabel = 'Submit', cancelLabel = 'Cancel', className = '', layout = 'grid', gridCols = 3,
  disabled = false, showCancel = false, isLoading = false, onCancel, formId = 'form', title, subtitle, variant = 'default'
}) => {
  const initialData = useMemo(() => 
    inputs.reduce((acc: Record<string, FormInputValue>, input) => ({ 
      ...acc, 
      [input.name]: getDefaultValue(input.type, input.defaultValue) 
    }), {}), 
    [inputs]
  );

  const [formData, setFormData] = useState<Record<string, FormInputValue>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleInputChange = useCallback((name: string, value: FormInputValue, config: FormInputConfig) => {
    const formattedValue = (config.name === 'phone' || config.name === 'mobile') && typeof value === 'string' 
      ? formatPhone(value) 
      : value;
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (touched.has(name)) {
      const error = validateField(formattedValue, config);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  }, [touched]);

  const handleInputBlur = useCallback((name: string, value: FormInputValue, config: FormInputConfig) => {
    setTouched(prev => new Set(prev).add(name));
    const error = validateField(value, config);
    setErrors(prev => ({ ...prev, [name]: error || '' }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    inputs.forEach(input => {
      const error = validateField(formData[input.name], input);
      if (error) { newErrors[input.name] = error; hasErrors = true; }
    });
    
    setErrors(newErrors);
    if (!hasErrors) onSubmit(formData);
  }, [formData, inputs, onSubmit]);

  const handleCancel = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched(new Set());
    setSubmitted(false);
    onCancel?.();
  }, [initialData, onCancel]);

  const layoutClasses = useMemo(() => {
    const baseClass = CLASSES.layout[layout];
    return layout === 'grid' ? `${baseClass} ${CLASSES.cols[gridCols]}` : baseClass;
  }, [layout, gridCols]);

  const formContainerClasses = `${CLASSES.container[variant]} ${className}`;

  const formInputs = useMemo(() => 
    inputs.map(input => (
      <FormInput
        key={input.name}
        input={input}
        value={formData[input.name]}
        error={errors[input.name]}
        showError={!!(errors[input.name] && (touched.has(input.name) || submitted))}
        disabled={disabled}
        onInputChange={handleInputChange}
        onInputBlur={handleInputBlur}
        fileInputRefs={fileInputRefs}
      />
    )), 
    [inputs, formData, errors, touched, submitted, disabled, handleInputChange, handleInputBlur]
  );

  // Get all error messages for screen readers
  const errorMessages = Object.values(errors).filter(Boolean);
  const hasErrors = errorMessages.length > 0;

  return (
    <div className={`w-full ${formContainerClasses}`}>
      <form 
        id={formId} 
        onSubmit={handleSubmit} 
        className="w-full" 
        noValidate
        aria-label={title || 'Form'}
      >
        {/* Error summary for screen readers */}
        {hasErrors && submitted && (
          <div 
            className="sr-only"
            role="alert"
            aria-live="assertive"
          >
            Form has {errorMessages.length} error{errorMessages.length > 1 ? 's' : ''}: {errorMessages.join('. ')}
          </div>
        )}

        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && <h2 className="text-2xl font-bold text-[var(--color-main)] dark:text-[var(--color-surface)] mb-2">{title}</h2>}
            {subtitle && <p className="text-[var(--color-light)] dark:text-[var(--color-neutral-light)]">{subtitle}</p>}
          </div>
        )}
        
        <div className={layoutClasses}>{formInputs}</div>
        
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-[var(--color-primary-border)] dark:border-[var(--color-dark-border)]">
          {showCancel && (
            <Button 
              onClick={handleCancel} 
              disabled={disabled || isLoading} 
              label={cancelLabel} 
              variant="secondary"
              type="button"
            />
          )}
          <Button 
            type="submit" 
            disabled={disabled || isLoading} 
            variant="primary" 
            label={isLoading ? 'Loading...' : submitLabel}
            aria-describedby={hasErrors ? `${formId}-errors` : undefined}
          />
        </div>
      </form>
    </div>
  );
};

export default memo(Form); 