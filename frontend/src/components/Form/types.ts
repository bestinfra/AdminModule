export interface FormInputConfig {
  name: string;
  type: 
    | 'text'   
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'checkbox'
    | 'textarea'
    | 'select'
    | 'file'
    | 'tel'
    | 'url'
    | 'colorpicker'
    | 'dragdrop'
    | 'dropdown'
    | 'radio'
    | 'switch'
    | 'chosenfile'
    | 'textareafield';
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: FormInputValue;  
  options?: Array<{ value: string; label: string }>;
  colorOptions?: Array<{ value: string; label: string; color: string }>;
  className?: string;
  row?: number;
  col?: number;
  colSpan?: number;
  fullWidth?: boolean;
  icon?: string;
  accept?: string;
  onChange?: (value: FormInputValue) => void;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: FormInputValue) => string | null;
  };
}

export interface GridLayoutProps {
  gridRows: number;
  gridColumns: number;
  gap?: string;
  className?: string;
  autoFullWidth?: boolean;
}

export interface FormProps {
  inputs: FormInputConfig[];
  onSubmit: (data: Record<string, FormInputValue>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridLayout?: GridLayoutProps;
  isLoading?: boolean;
  formId?: string;
  variant?: 'default' | 'card' | 'minimal';
  initialData?: Record<string, FormInputValue>;
  errorMessages?: Record<string, string>;
  touchedFields?: Set<string>;
  submitted?: boolean;
  customSchema?: import('zod').ZodSchema<any>;
  showErrorsByDefault?: boolean;
  onChange?: (formData: Record<string, FormInputValue>) => void;
  showFormActions?: boolean;
  submitAction?: () => void;
  cancelAction?: () => void;
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

export type FormInputEvent = 
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

export type FormBlurEvent = 
  | React.FocusEvent<HTMLInputElement>
  | React.FocusEvent<HTMLTextAreaElement>
  | React.FocusEvent<HTMLSelectElement>;

export type FormInputValue = 
  | string
  | string[]
  | number
  | boolean
  | FileList
  | File
  | null
  | undefined;

export interface TypedFormHandlers {
  onChange: (event: FormInputEvent) => void;
  onBlur: (event: FormBlurEvent) => void;
}

export interface CommonInputProps {
  id: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  className: string;
  onChange: (event: FormInputEvent) => void;
  onBlur: (event: FormBlurEvent) => void;
  'aria-invalid'?: 'true' | 'false';
  'aria-describedby'?: string;
  'aria-required'?: 'true' | 'false';
}

export type EventValueExtractor = (event: FormInputEvent | FormBlurEvent) => FormInputValue;

export interface FormRef {
  getFormValues: () => Record<string, FormInputValue>;
  getValidationErrors: () => Record<string, string>;
  hasErrors: () => boolean;
  submit: () => void;
  reset: () => void;
  validate: () => { success: boolean; errors: Record<string, string> };
} 