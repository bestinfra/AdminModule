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

// Helper function to convert FormInputConfig to Zod schema
export function createZodSchema(inputs: FormInputConfig[]) {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  inputs.forEach((input) => {
    let fieldSchema: z.ZodTypeAny;

    // Base schema based on input type
    switch (input.type) {
      case 'email':
        fieldSchema = z.string().email(`${input.label || 'This field'} must be a valid email`).nullable().optional();
        break;
      
      case 'number':
        fieldSchema = z.coerce
          .number()
          .refine(
            (val) => !isNaN(val) && isFinite(val),
            { message: `${input.label || 'This field'} must be a valid number` }
          )
          .nullable()
          .optional();
        break;
      
      case 'checkbox':
      case 'switch':
        fieldSchema = z.boolean().nullable().optional();
        break;
      
      case 'file':
      case 'chosenfile':
        fieldSchema = z.any(); // File validation handled separately
        break;
      
      case 'date':
        fieldSchema = z.string().datetime().nullable().optional();
        break;
      
      case 'url':
        fieldSchema = z.string().url(`${input.label || 'This field'} must be a valid URL`).nullable().optional();
        break;
      
      case 'tel':
        fieldSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, `${input.label || 'This field'} must be a valid phone number`).nullable().optional();
        break;
      
      case 'radio':
        fieldSchema = z.string().nullable().optional();
        break;
      case 'textarea':
      case 'textareafield':
      case 'text':
      case 'password':
      case 'select':
      case 'dropdown':
      case 'colorpicker':
      default:
        fieldSchema = z.string().nullable().optional();
        break;
    }

    // Apply validation rules
    if (input.validation) {
      const { validation } = input;

      // Required validation
      if (input.required) {
        fieldSchema = fieldSchema.refine(
          (val) => {
            if (val === null || val === undefined || val === '') return false;
            if (typeof val === 'boolean') return val;
            if (val instanceof FileList) return val.length > 0;
            if (val instanceof File) return val.size > 0;
            if (Array.isArray(val)) return val.length > 0;
            return true;
          },
          { message: `${input.label || 'This field'} is required` }
        );
      }
      // Note: We don't need to call .optional() again since it's already applied in the base schema

      // String-specific validations
      if (typeof fieldSchema === 'object' && 'refine' in fieldSchema) {
        if (validation.minLength) {
          fieldSchema = fieldSchema.refine(
            (val) => typeof val === 'string' && val.length >= validation.minLength!,
            { message: `${input.label || 'This field'} must be at least ${validation.minLength} characters` }
          );
        }

        if (validation.maxLength) {
          fieldSchema = fieldSchema.refine(
            (val) => typeof val === 'string' && val.length <= validation.maxLength!,
            { message: `${input.label || 'This field'} must be no more than ${validation.maxLength} characters` }
          );
        }

        if (validation.pattern) {
          fieldSchema = fieldSchema.refine(
            (val) => typeof val === 'string' && validation.pattern!.test(val),
            { message: `${input.label || 'This field'} format is invalid` }
          );
        }

        // Number-specific validations
        if (validation.min !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => {
              if (input.type === 'number') {
                return typeof val === 'number' && !isNaN(val) && val >= validation.min!;
              }
              const num = typeof val === 'string' ? Number(val) : val;
              return typeof num === 'number' && !isNaN(num) && num >= validation.min!;
            },
            { message: `${input.label || 'This field'} must be at least ${validation.min}` }
          );
        }

        if (validation.max !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => {
              if (input.type === 'number') {
                return typeof val === 'number' && !isNaN(val) && val <= validation.max!;
              }
              const num = typeof val === 'string' ? Number(val) : val;
              return typeof num === 'number' && !isNaN(num) && num <= validation.max!;
            },
            { message: `${input.label || 'This field'} must be no more than ${validation.max}` }
          );
        }

        // Custom validation
        if (validation.custom) {
          fieldSchema = fieldSchema.refine(
            (val) => {
              const customError = validation.custom!(val);
              return !customError;
            },
            (val) => ({ message: validation.custom!(val) || 'Invalid value' })
          );
        }
      }
    } else if (input.required) {
      // If no validation object but field is required
      fieldSchema = fieldSchema.refine(
        (val) => {
          if (val === null || val === undefined || val === '') return false;
          if (typeof val === 'boolean') return val;
          if (val instanceof FileList) return val.length > 0;
          if (val instanceof File) return val.size > 0;
          if (Array.isArray(val)) return val.length > 0;
          return true;
        },
        { message: `${input.label || 'This field'} is required` }
      );
    }
    // Note: We don't need to call .optional() again since it's already applied in the base schema

    schemaObject[input.name] = fieldSchema;
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
      error.errors.forEach((err) => {
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
      const fieldError = error.errors.find(err => err.path[0] === input.name);
      return fieldError ? fieldError.message : null;
    }
    return 'Validation failed';
  }
}

// Type for form data with Zod validation
export type ZodFormData<T> = z.infer<ReturnType<typeof createZodSchema>>;

// Hook for Zod form validation
export function useZodForm<T extends Record<string, any>>(
  inputs: FormInputConfig[],
  initialData?: T
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