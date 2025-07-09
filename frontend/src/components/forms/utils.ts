import type { FormInputConfig, FormInputValue } from './types';

// Utility functions for form handling
export const getDefaultValue = (type: string, defaultValue?: FormInputValue): FormInputValue => 
  defaultValue ?? (type === 'checkbox' ? false : type === 'file' ? null : '');

export const formatPhone = (value: string): string => {
  if (!value) return value;
  const cleaned = value.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    const [country, ...parts] = [cleaned.slice(0, 3), cleaned.slice(3, 6), cleaned.slice(6, 9), cleaned.slice(9, 13)];
    return [country, ...parts.filter(Boolean)].join(' ');
  }
  const parts = [cleaned.slice(0, 3), cleaned.slice(3, 6), cleaned.slice(6, 10)].filter(Boolean);
  return parts.length > 1 ? parts.join('-') : parts[0] || '';
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