import { useState } from 'react';
import type { FormInputConfig, FormInputValue } from './types';

// Utility functions for form handling
export const getDefaultValue = (type: string, defaultValue?: FormInputValue): FormInputValue => 
  defaultValue ?? null;

export const formatPhone = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const validateField = (value: FormInputValue, config: FormInputConfig): string | null => {
  if (config.required && (!value || (typeof value === 'string' && value.trim() === ''))) return `${config.label} is required`;
  if (!value || !config.validation) return null;
  
  const { validation } = config;
  
  // Handle string validation
  if (typeof value === 'string') {
    if (validation.pattern && !validation.pattern.test(value)) return `${config.label} format is invalid`;
    if (validation.minLength && value.length < validation.minLength) return `${config.label} must be at least ${validation.minLength} characters`;
    if (validation.maxLength && value.length > validation.maxLength) return `${config.label} must be no more than ${validation.maxLength} characters`;
  }
  
  // Handle number validation
  if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
    const numValue = typeof value === 'string' ? Number(value) : value;
    if (validation.min && numValue < validation.min) return `${config.label} must be at least ${validation.min}`;
    if (validation.max && numValue > validation.max) return `${config.label} must be no more than ${validation.max}`;
  }
  
  // Handle custom validation
  if (validation.custom) return validation.custom(value);
  
  return null;
};

// Custom hook for form data management
export function useFormData<T extends Record<string, any>>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData);

  const updateFormData = (fieldName: keyof T, value: FormInputValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    console.log(`${String(fieldName)} changed:`, value);
  };

  const resetFormData = () => {
    setFormData(initialData);
  };

  const setFormDataField = (fieldName: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return {
    formData,
    updateFormData,
    resetFormData,
    setFormDataField,
  };
}

// Helper function to create form inputs with onChange handlers
export function createFormInputs<T extends Record<string, any>>(
  inputs: FormInputConfig[],
  updateFormData: (fieldName: keyof T, value: FormInputValue) => void
): FormInputConfig[] {
  return inputs.map(input => ({
    ...input,
    onChange: (value: FormInputValue) => {
      updateFormData(input.name as keyof T, value);
    },
  }));
} 