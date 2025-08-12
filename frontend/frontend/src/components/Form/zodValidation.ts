import { z } from 'zod';
import type { FormInputConfig, FormInputValue } from './types';

// Helper function to convert camelCase/PascalCase to Title Case
function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();  
}

// Helper function to generate professional labels and placeholders
export function generateFormLabels(input: FormInputConfig): { label: string; placeholder: string } {
  const { name, type } = input;
  
  // Convert name to readable format
  const baseName = toTitleCase(name.replace(/[_-]/g, ' '));
  
  // Generate label based on type and name
  let label = baseName;
  let placeholder = '';
  
  switch (type) {
    case 'email':
      label = baseName.includes('Email') ? baseName : `${baseName} Email`;
      placeholder = 'Enter your email address';
      break;
      
    case 'password':
      label = baseName.includes('Password') ? baseName : `${baseName} Password`;
      placeholder = 'Enter your password';
      break;
      
    case 'number':
      label = baseName.includes('Number') ? baseName : `${baseName} Number`;
      placeholder = 'Enter a number';
      break;
      
    case 'date':
      label = baseName.includes('Date') ? baseName : `${baseName} Date`;
      placeholder = 'Select a date';
      break;
      
    case 'tel':
      label = baseName.includes('Phone') || baseName.includes('Mobile') || baseName.includes('Contact') 
        ? baseName 
        : `${baseName} Phone Number`;
      placeholder = 'Enter phone number (e.g., +1-555-123-4567)';
      break;
      
    case 'url':
      label = baseName.includes('URL') || baseName.includes('Website') || baseName.includes('Link') 
        ? baseName 
        : `${baseName} URL`;
      placeholder = 'Enter website URL (e.g., https://example.com)';
      break;
      
    case 'colorpicker':
      label = baseName.includes('Color') ? baseName : `${baseName} Color`;
      placeholder = 'Choose a color';
      break;
      
    case 'file':
    case 'chosenfile':
      label = baseName.includes('File') ? baseName : `${baseName} File`;
      placeholder = 'Choose a file to upload';
      break;
      
    case 'dragdrop':
      label = baseName.includes('File') ? baseName : `${baseName} Files`;
      placeholder = 'Drag and drop files here or click to browse';
      break;
      
    case 'textarea':
    case 'textareafield':
      label = baseName.includes('Description') || baseName.includes('Notes') || baseName.includes('Comments') 
        ? baseName 
        : `${baseName} Description`;
      placeholder = 'Enter additional details...';
      break;
      
    case 'select':
    case 'dropdown':
      label = baseName.includes('Type') || baseName.includes('Category') || baseName.includes('Status') 
        ? baseName 
        : `${baseName} Selection`;
      placeholder = 'Select an option';
      break;
      
    case 'checkbox':
      label = baseName.includes('Agree') || baseName.includes('Accept') || baseName.includes('Confirm') 
        ? baseName 
        : `${baseName} Option`;
      placeholder = '';
      break;
      
    case 'switch':
      label = baseName.includes('Enable') || baseName.includes('Active') || baseName.includes('Status') 
        ? baseName 
        : `${baseName} Setting`;
      placeholder = '';
      break;
      
    case 'radio':
      label = baseName.includes('Option') || baseName.includes('Choice') || baseName.includes('Preference') 
        ? baseName 
        : `${baseName} Selection`;
      placeholder = '';
      break;
      
    case 'text':
    default:
      // Smart label generation based on common field names
      if (name.toLowerCase().includes('firstname') || name.toLowerCase().includes('first_name')) {
        label = 'First Name';
        placeholder = 'Enter your first name';
      } else if (name.toLowerCase().includes('lastname') || name.toLowerCase().includes('last_name')) {
        label = 'Last Name';
        placeholder = 'Enter your last name';
      } else if (name.toLowerCase().includes('fullname') || name.toLowerCase().includes('full_name')) {
        label = 'Full Name';
        placeholder = 'Enter your full name';
      } else if (name.toLowerCase().includes('username')) {
        label = 'Username';
        placeholder = 'Enter your username';
      } else if (name.toLowerCase().includes('company')) {
        label = 'Company Name';
        placeholder = 'Enter your company name';
      } else if (name.toLowerCase().includes('address')) {
        label = 'Address';
        placeholder = 'Enter your address';
      } else if (name.toLowerCase().includes('city')) {
        label = 'City';
        placeholder = 'Enter your city';
      } else if (name.toLowerCase().includes('state') || name.toLowerCase().includes('province')) {
        label = 'State/Province';
        placeholder = 'Enter your state or province';
      } else if (name.toLowerCase().includes('zip') || name.toLowerCase().includes('postal')) {
        label = 'ZIP/Postal Code';
        placeholder = 'Enter ZIP or postal code';
      } else if (name.toLowerCase().includes('country')) {
        label = 'Country';
        placeholder = 'Enter your country';
      } else if (name.toLowerCase().includes('title')) {
        label = 'Title';
        placeholder = 'Enter a title';
      } else if (name.toLowerCase().includes('subject')) {
        label = 'Subject';
        placeholder = 'Enter a subject';
      } else if (name.toLowerCase().includes('message')) {
        label = 'Message';
        placeholder = 'Enter your message';
      } else if (name.toLowerCase().includes('search')) {
        label = 'Search';
        placeholder = 'Search...';
      } else if (name.toLowerCase().includes('code') || name.toLowerCase().includes('id')) {
        label = baseName;
        placeholder = `Enter ${baseName.toLowerCase()}`;
      } else {
        label = baseName;
        placeholder = `Enter ${baseName.toLowerCase()}`;
      }
      break;
  }
  
  return { label, placeholder };
}

// Helper function to enhance FormInputConfig with generated labels and placeholders
export function enhanceFormInputs(inputs: FormInputConfig[]): FormInputConfig[] {
  return inputs.map(input => {
    const { label: generatedLabel, placeholder: generatedPlaceholder } = generateFormLabels(input);
    
    return {
      ...input,
      label: input.label || generatedLabel,
      placeholder: input.placeholder || generatedPlaceholder,
    };
  });
}

// Enhanced validation patterns for different input types
const VALIDATION_PATTERNS = {
  // Phone number patterns
  PHONE: {
    INTERNATIONAL: /^[\+]?[1-9][\d]{0,15}$/,
    US: /^[\+]?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
    INDIAN: /^[\+]?91?[-.\s]?([0-9]{5})[-.\s]?([0-9]{5})$/,
    GENERAL: /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/
  },
  
  // Email patterns
  EMAIL: {
    STANDARD: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    STRICT: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  
  // URL patterns
  URL: {
    STANDARD: /^https?:\/\/.+/,
    STRICT: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  },
  
  // Password patterns
  PASSWORD: {
    WEAK: /^.{6,}$/,
    MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  },
  
  // Number patterns
  NUMBER: {
    INTEGER: /^\d+$/,
    DECIMAL: /^\d*\.?\d+$/,
    POSITIVE: /^[1-9]\d*$/,
    NEGATIVE: /^-\d+$/,
    CURRENCY: /^\d+(\.\d{1,2})?$/
  },
  
  // Date patterns
  DATE: {
    ISO: /^\d{4}-\d{2}-\d{2}$/,
    US: /^\d{2}\/\d{2}\/\d{4}$/,
    EU: /^\d{2}-\d{2}-\d{4}$/
  },
  
  // Text patterns
  TEXT: {
    ALPHA: /^[a-zA-Z\s]+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
    NO_SPECIAL: /^[a-zA-Z0-9\s\-_]+$/,
    USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
    NAME: /^[a-zA-Z\s'-]+$/
  }
};

// Helper function to create base schema based on input type
function createBaseSchema(input: FormInputConfig): z.ZodTypeAny {
  const { type, label = 'This field' } = input;
  
  switch (type) {
    case 'email':
      return z.string()
        .email(`${label} must be a valid email address`)
        .min(1, `${label} is required`)
        .max(254, `${label} must be less than 254 characters`)
        .transform(val => val.trim().toLowerCase())
        .nullable()
        .optional();

    case 'password':
      return z.string()
        .min(1, `${label} is required`)
        .max(128, `${label} must be less than 128 characters`)
        .nullable()
        .optional();

    case 'number':
      return z.coerce
<<<<<<< HEAD:src/components/Form/zodValidation.ts
        .number()
=======
        .number({
          invalid_type_error: `${label} must be a valid number`,
          required_error: `${label} is required`
        })
>>>>>>> be6a00465516c0f621bf0dfd1b2252475400ac8d:frontend/src/components/Form/zodValidation.ts
        .refine(
          (val) => !isNaN(val) && isFinite(val),
          { message: `${label} must be a valid number` }
        )
        .nullable()
        .optional();

    case 'date':
      return z.string()
        .min(1, `${label} is required`)
        .refine(
          (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
          },
          { message: `${label} must be a valid date` }
        )
        .nullable()
        .optional();

    case 'tel':
      return z.string()
        .min(1, `${label} is required`)
        .refine(
          (val) => VALIDATION_PATTERNS.PHONE.GENERAL.test(val.replace(/\s/g, '')),
          { message: `${label} must be a valid phone number` }
        )
        .transform(val => val.replace(/\s/g, ''))
        .nullable()
        .optional();

    case 'url':
      return z.string()
        .min(1, `${label} is required`)
        .url(`${label} must be a valid URL`)
        .refine(
          (val) => val.startsWith('http://') || val.startsWith('https://'),
          { message: `${label} must start with http:// or https://` }
        )
        .nullable()
        .optional();

    case 'checkbox':
    case 'switch':
      return z.boolean()
        .nullable()
        .optional();

    case 'file':
    case 'chosenfile':
      return z.any()
        .refine(
          (val) => {
            if (!val) return true; // Optional file
            if (val instanceof File) return val.size > 0;
            if (val instanceof FileList) return val.length > 0;
            return true;
          },
          { message: `${label} must be a valid file` }
        )
        .nullable()
        .optional();

    case 'dragdrop':
      return z.any()
        .refine(
          (val) => {
            if (!val) return true; // Optional files
            if (Array.isArray(val)) return val.every(file => file instanceof File);
            if (val instanceof FileList) return val.length > 0;
            return true;
          },
          { message: `${label} must contain valid files` }
        )
        .nullable()
        .optional();

    case 'select':
    case 'dropdown':
      return z.string()
        .min(1, `${label} is required`)
        .nullable()
        .optional();

    case 'radio':
      return z.string()
        .min(1, `${label} is required`)
        .nullable()
        .optional();

    case 'colorpicker':
      return z.string()
        .min(1, `${label} is required`)
        .regex(/^#[0-9A-F]{6}$/i, `${label} must be a valid hex color (e.g., #FF0000)`)
        .nullable()
        .optional();

    case 'textarea':
    case 'textareafield':
      return z.string()
        .min(1, `${label} is required`)
        .max(10000, `${label} must be less than 10,000 characters`)
        .nullable()
        .optional();

    case 'text':
    default:
      return z.string()
        .min(1, `${label} is required`)
        .max(255, `${label} must be less than 255 characters`)
        .transform(val => val.trim())
        .nullable()
        .optional();
  }
}

// Helper function to apply validation rules
function applyValidationRules(schema: z.ZodTypeAny, input: FormInputConfig): z.ZodTypeAny {
  const { validation, label = 'This field', required } = input;
  
  if (!validation && !required) {
    return schema;
  }

  let enhancedSchema = schema;

  // Required validation
  if (required) {
    enhancedSchema = enhancedSchema.refine(
      (val) => {
        if (val === null || val === undefined || val === '') return false;
        if (typeof val === 'boolean') return true; // Boolean fields are always valid when present
        if (val instanceof FileList) return val.length > 0;
        if (val instanceof File) return val.size > 0;
        if (Array.isArray(val)) return val.length > 0;
        return true;
      },
      { message: `${label} is required` }
    );
  }

  if (!validation) {
    return enhancedSchema;
  }

  const { minLength, maxLength, min, max, pattern, custom } = validation;

  // String-specific validations
  if (typeof enhancedSchema === 'object' && 'refine' in enhancedSchema) {
    if (minLength) {
      enhancedSchema = enhancedSchema.refine(
        (val) => {
          if (typeof val !== 'string') return true;
          return val.length >= minLength;
        },
        { message: `${label} must be at least ${minLength} characters` }
      );
    }

    if (maxLength) {
      enhancedSchema = enhancedSchema.refine(
        (val) => {
          if (typeof val !== 'string') return true;
          return val.length <= maxLength;
        },
        { message: `${label} must be no more than ${maxLength} characters` }
      );
    }

    if (pattern) {
      enhancedSchema = enhancedSchema.refine(
        (val) => {
          if (typeof val !== 'string') return true;
          return pattern.test(val);
        },
        { message: `${label} format is invalid` }
      );
    }

    // Number-specific validations
    if (min !== undefined) {
      enhancedSchema = enhancedSchema.refine(
        (val) => {
          if (input.type === 'number') {
            return typeof val === 'number' && !isNaN(val) && val >= min;
          }
          const num = typeof val === 'string' ? Number(val) : val;
          return typeof num === 'number' && !isNaN(num) && num >= min;
        },
        { message: `${label} must be at least ${min}` }
      );
    }

    if (max !== undefined) {
      enhancedSchema = enhancedSchema.refine(
        (val) => {
          if (input.type === 'number') {
            return typeof val === 'number' && !isNaN(val) && val <= max;
          }
          const num = typeof val === 'string' ? Number(val) : val;
          return typeof num === 'number' && !isNaN(num) && num <= max;
        },
        { message: `${label} must be no more than ${max}` }
      );
    }

    // Custom validation
    if (custom) {
      enhancedSchema = enhancedSchema.refine(
<<<<<<< HEAD:src/components/Form/zodValidation.ts
        (val: any) => {
          const customError = custom(val);
          return !customError;
        },
        { message: 'Invalid value' }
=======
        (val) => {
          const customError = custom(val);
          return !customError;
        },
        (val) => ({ message: custom(val) || 'Invalid value' })
>>>>>>> be6a00465516c0f621bf0dfd1b2252475400ac8d:frontend/src/components/Form/zodValidation.ts
      );
    }
  }

  return enhancedSchema;
}

// Helper function to convert FormInputConfig to Zod schema
export function createZodSchema(inputs: FormInputConfig[]) {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  inputs.forEach((input) => {
    const baseSchema = createBaseSchema(input);
    const enhancedSchema = applyValidationRules(baseSchema, input);
    schemaObject[input.name] = enhancedSchema;
  });

  return z.object(schemaObject);
}

// Validation function that uses Zod
export function validateFormData(data: Record<string, FormInputValue>, inputs: FormInputConfig[]) {
  try {
    const schema = createZodSchema(inputs);
    schema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
<<<<<<< HEAD:src/components/Form/zodValidation.ts
      error.issues.forEach((err) => {
=======
      error.errors.forEach((err) => {
>>>>>>> be6a00465516c0f621bf0dfd1b2252475400ac8d:frontend/src/components/Form/zodValidation.ts
        const fieldName = err.path.join('.');
        errors[fieldName] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

// Validate single field
export function validateField(value: FormInputValue, input: FormInputConfig): string | null {
  try {
    const schema = createZodSchema([input]);
    schema.parse({ [input.name]: value });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
<<<<<<< HEAD:src/components/Form/zodValidation.ts
      const fieldError = error.issues.find(err => err.path[0] === input.name);
=======
      const fieldError = error.errors.find(err => err.path[0] === input.name);
>>>>>>> be6a00465516c0f621bf0dfd1b2252475400ac8d:frontend/src/components/Form/zodValidation.ts
      return fieldError ? fieldError.message : null;
    }
    return 'Validation failed';
  }
}

// Type for form data with Zod validation
export type ZodFormData = z.infer<ReturnType<typeof createZodSchema>>;

// Hook for Zod form validation
export function useZodForm(
  inputs: FormInputConfig[]
) {
  const schema = createZodSchema(inputs);
  
  const validate = (data: Record<string, FormInputValue>) => {
    return validateFormData(data, inputs);
  };

  const validateFieldByName = (name: string, value: FormInputValue) => {
    const input = inputs.find(i => i.name === name);
    if (!input) return null;
    return validateField(value, input);
  };

  return {
    schema,
    validate,
    validateField: validateFieldByName,
  };
}

// Export validation patterns for external use
export { VALIDATION_PATTERNS }; 