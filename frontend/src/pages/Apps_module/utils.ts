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
    country: stepData.appBasics.country,
    state: stepData.appBasics.state,
    city: stepData.appBasics.city,
    categories: stepData.appBasics.categories,
    tariffPlans: stepData.appBasics.tariffPlans,
    termsAccepted: stepData.appBasics.termsAccepted,

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