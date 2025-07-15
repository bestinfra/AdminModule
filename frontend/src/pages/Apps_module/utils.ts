import { AppCreationAPI } from '../../api/appCreation';
import type { AllFormData, StepData } from './types';

/**
 * Combines all form data into a single object for API submission
 */
export const combineFormData = (stepData: StepData): AllFormData => {
  return {
    // App basics
    appName: stepData.appBasics.appName,
    subdomain: stepData.appBasics.subdomain,
    addressLine: stepData.appBasics.addressLine,
    country: stepData.appBasics.country,
    state: stepData.appBasics.state,
    city: stepData.appBasics.city,
    applicationCategory: stepData.appBasics.applicationCategory,
    projectType: stepData.appBasics.projectType,
    ownershipType: stepData.appBasics.ownershipType,
    tariffPlans: stepData.appBasics.tariffPlans,
    billingMode: stepData.appBasics.billingMode,
    meteringType: stepData.appBasics.meteringType,

    // Admin details
    adminFirstName: stepData.adminAccess.adminFirstName,
    adminLastName: stepData.adminAccess.adminLastName,
    adminEmail: stepData.adminAccess.adminEmail,
    adminPhone: stepData.adminAccess.adminPhone,
    adminPassword: stepData.adminAccess.adminPassword,
    adminConfirmPassword: stepData.adminAccess.adminConfirmPassword,
    adminRole: stepData.adminAccess.adminRole,
    adminDepartment: stepData.adminAccess.adminDepartment,
    adminAddress: stepData.adminAccess.adminAddress,
    sendWelcomeEmail: stepData.adminAccess.sendWelcomeEmail,

    // Branding
    companyName: stepData.branding.companyName,
    companyWebsite: stepData.branding.companyWebsite,
    appLogo: stepData.branding.appLogo,
    appFavicon: stepData.branding.appFavicon,
    primaryColor: stepData.branding.primaryColor,
    appDescription: stepData.branding.appDescription,
    contactEmail: stepData.branding.contactEmail,
    contactPhone: stepData.branding.contactPhone,
    timezone: stepData.branding.timezone,
    currency: stepData.branding.currency,
    enableDarkMode: stepData.branding.enableDarkMode,
    enableMultiLanguage: stepData.branding.enableMultiLanguage,

    // Modules
    modules: stepData.modules.modules,
  };
};

/**
 * Handles the final app creation submission
 */
export const submitAppCreation = async (formData: AllFormData): Promise<void> => {
  console.log('Submitting form data:', formData);
  
  // Check if server is running
  const isServerHealthy = await AppCreationAPI.checkServerHealth();
  if (!isServerHealthy) {
    throw new Error('App creation server is not running. Please start the server with: npm run server');
  }
  
  // Create the app using the API
  const result = await AppCreationAPI.createApp(formData);
  
  // Handle success
  alert(`${result.message}\n\nNext steps:\n${result.nextSteps?.join('\n') || ''}`);
};

/**
 * Validates if a step number is valid
 */
export const isValidStep = (step: number): boolean => {
  return step >= 1 && step <= 5;
};

/**
 * Validates Application Setup form data
 */
export const validateApplicationSetup = (formData: any): { isValid: boolean; errors: Record<string, string>; remarks: string[] } => {
  const errors: Record<string, string> = {};
  const remarks: string[] = [];

  // Required field validations
  if (!formData.appName?.trim()) {
    errors.appName = 'Application name is required';
  } else if (formData.appName.length < 3) {
    errors.appName = 'Application name must be at least 3 characters long';
  } else if (formData.appName.length > 50) {
    errors.appName = 'Application name must be less than 50 characters';
  }

  if (!formData.subdomain?.trim()) {
    errors.subdomain = 'Subdomain is required';
  } else if (!/^https:\/\/www\.[a-z0-9-]+\.bestinfra\.app$/.test(formData.subdomain)) {
    errors.subdomain = 'Subdomain must be a valid URL like https://www.<name>.bestinfra.app';
  }

  if (!formData.addressLine?.trim()) {
    errors.addressLine = 'Address line is required';
  }

  if (!formData.country) {
    errors.country = 'Country is required';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State/Province is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.applicationCategory || formData.applicationCategory.length === 0) {
    errors.applicationCategory = 'At least one application category is required';
  }

  if (!formData.projectType) {
    errors.projectType = 'Project type is required';
  }

  if (!formData.ownershipType) {
    errors.ownershipType = 'Ownership type is required';
  }

  if (!formData.tariffPlans || formData.tariffPlans.length === 0) {
    errors.tariffPlans = 'At least one tariff plan is required';
  }

  if (!formData.billingMode) {
    errors.billingMode = 'Billing mode is required';
  }

  if (!formData.meteringType || formData.meteringType.length === 0) {
    errors.meteringType = 'At least one metering type is required';
  }

  // Generate remarks based on form data
  if (formData.appName && formData.appName.length >= 3) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Application name "${formData.appName}" is valid`);
  }

  if (
    formData.appName &&
    formData.subdomain &&
    /^http:\/\/www\.[a-z0-9-]+\.bestinfra\.app$/.test(formData.subdomain)
  ) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Subdomain configured: ${formData.subdomain}`);
  }

  if (formData.addressLine && formData.country && formData.state && formData.city) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Location configured: ${formData.city}, ${formData.state}, ${formData.country}`);
  } else if (formData.addressLine || formData.city || formData.state || formData.country) {
    const locationParts = [formData.city, formData.state, formData.country].filter(Boolean);
    if (locationParts.length > 0) {
      remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Partial location: ${locationParts.join(', ')}`);
    }
  }

  if (formData.applicationCategory && formData.applicationCategory.length > 0) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Application categories selected: ${formData.applicationCategory.length} category(ies)`);
  }

  if (formData.projectType) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Project type: ${formData.projectType}`);
  }

  if (formData.ownershipType) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Ownership type: ${formData.ownershipType}`);
  }

  if (formData.tariffPlans && formData.tariffPlans.length > 0) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Tariff plans configured: ${formData.tariffPlans.length} plan(s)`);
  }

  if (formData.billingMode) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Billing mode: ${formData.billingMode}`);
  }

  if (formData.meteringType && formData.meteringType.length > 0) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Metering types: ${formData.meteringType.length} type(s)`);
  }

  // Additional helpful remarks
  if (formData.applicationCategory?.includes('smart-metering') && formData.meteringType?.includes('smart-meter')) {
    remarks.push('💡 Smart metering configuration detected - consider enabling AMR/AMI features');
  }

  if (formData.billingMode === 'prepaid' && formData.tariffPlans?.includes('prepaid')) {
    remarks.push('💡 Prepaid billing mode selected - ensure payment gateway integration is configured');
  }



  if (formData.projectType === 'pilot') {
    remarks.push('💡 Pilot project detected - consider limited user access and testing features');
  }

  if (formData.applicationCategory?.includes('solar-epc') || formData.meteringType?.includes('solar-bidirectional')) {
    remarks.push('💡 Solar/EPC configuration detected - ensure net metering features are enabled');
  }

  // Validation warnings
  if (formData.applicationCategory?.length > 3) {
    remarks.push('⚠️ Multiple application categories selected - consider focusing on core functionality');
  }

  if (formData.tariffPlans?.length > 5) {
    remarks.push('⚠️ Many tariff plans selected - ensure billing system can handle complexity');
  }

  if (formData.meteringType?.length > 4) {
    remarks.push('⚠️ Multiple metering types selected - verify hardware compatibility');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    remarks
  };
};

/**
 * Clears error for a specific field
 */
export const clearFieldError = <T extends Record<string, any>>(
  errors: T,
  fieldName: keyof T,
  setErrors: (fn: (prev: T) => T) => void
): void => {
  if (errors[fieldName]) {
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  }
}; 