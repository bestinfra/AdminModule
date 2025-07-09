// Form component type definitions
export interface FormInputConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'checkbox' | 'textarea' | 'select' | 'file' | 'tel' | 'url';
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: FormInputValue;
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
    custom?: (value: FormInputValue) => string | null;
  };
}

export interface FormProps {
  inputs: FormInputConfig[];
  onSubmit: (data: Record<string, FormInputValue>) => void;
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

export interface FormInputProps {
  input: FormInputConfig;
  value: FormInputValue;
  error: string | undefined;
  showError: boolean;
  disabled: boolean;
  onInputChange: (name: string, value: FormInputValue, config: FormInputConfig) => void;
  onInputBlur: (name: string, value: FormInputValue, config: FormInputConfig) => void;
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}

// Form event types
export type FormInputEvent = 
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

export type FormBlurEvent = 
  | React.FocusEvent<HTMLInputElement>
  | React.FocusEvent<HTMLTextAreaElement>
  | React.FocusEvent<HTMLSelectElement>;

// Form value types based on input type
export type FormInputValue = 
  | string
  | number
  | boolean
  | FileList
  | null
  | undefined;

// Typed event handlers
export interface TypedFormHandlers {
  onChange: (event: FormInputEvent) => void;
  onBlur: (event: FormBlurEvent) => void;
}

// Common props for form inputs with accessibility support
export interface CommonInputProps {
  id: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  className: string;
  onChange: (event: FormInputEvent) => void;
  onBlur: (event: FormBlurEvent) => void;
  // ARIA attributes for accessibility
  'aria-invalid'?: 'true' | 'false';
  'aria-describedby'?: string;
  'aria-required'?: 'true' | 'false';
}

// Type-safe event value extractor
export type EventValueExtractor = (event: FormInputEvent | FormBlurEvent) => FormInputValue; 