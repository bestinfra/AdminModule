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
    adminUsername: stepData.adminAccess.adminUsername,
    adminRole: stepData.adminAccess.adminRole,
    newAccountRole: stepData.adminAccess.newAccountRole,
    sendWelcomeEmail: stepData.adminAccess.sendWelcomeEmail,
    newAccountFirstName: stepData.adminAccess.newAccountFirstName,
    newAccountLastName: stepData.adminAccess.newAccountLastName,
    newAccountUsername: stepData.adminAccess.newAccountUsername,
    newAccountEmail: stepData.adminAccess.newAccountEmail,
    newAccountPhone: stepData.adminAccess.newAccountPhone,
    newAccountPassword: stepData.adminAccess.newAccountPassword,
    newAccountConfirmPassword: stepData.adminAccess.newAccountConfirmPassword,
    newAccounts: stepData.adminAccess.newAccounts,

    // Branding
    companyName: stepData.branding.companyName,
    companyWebsite: stepData.branding.companyWebsite,
    appLogo: stepData.branding.appLogo,
    appFavicon: stepData.branding.appFavicon,
    // Custom colors (for form state)
    customPrimaryColor: stepData.branding.customPrimaryColor,
    customSecondaryColor: stepData.branding.customSecondaryColor,
    customTextPrimaryColor: stepData.branding.customTextPrimaryColor,
    customTextSecondaryColor: stepData.branding.customTextSecondaryColor,
    customBackgroundColor: stepData.branding.customBackgroundColor,
    customBorderColor: stepData.branding.customBorderColor,
    customShadowColor: stepData.branding.customShadowColor,
    customIconColor: stepData.branding.customIconColor,
    customGradientColor: stepData.branding.customGradientColor,
    // Mapped colors (for API)
    primaryColor: stepData.branding.customPrimaryColor,
    secondaryColor: stepData.branding.customSecondaryColor,
    textPrimaryColor: stepData.branding.customTextPrimaryColor,
    textSecondaryColor: stepData.branding.customTextSecondaryColor,
    backgroundColor: stepData.branding.customBackgroundColor,
    borderColor: stepData.branding.customBorderColor,
    shadowColor: stepData.branding.customShadowColor,
    iconColor: stepData.branding.customIconColor,
    gradientColor: stepData.branding.customGradientColor,
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
    /^https:\/\/www\.[a-z0-9-]+\.bestinfra\.app$/.test(formData.subdomain)
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
 * Validates Access Control form data
 */
export const validateAccessControl = (formData: any): { isValid: boolean; errors: Record<string, string>; remarks: string[] } => {
  const errors: Record<string, string> = {};
  const remarks: string[] = [];

  // Required field validations for admin account
  if (!formData.adminFirstName?.trim()) {
    errors.adminFirstName = 'First name is required';
  } else if (formData.adminFirstName.length < 2) {
    errors.adminFirstName = 'First name must be at least 2 characters long';
  }

  if (!formData.adminLastName?.trim()) {
    errors.adminLastName = 'Last name is required';
  } else if (formData.adminLastName.length < 2) {
    errors.adminLastName = 'Last name must be at least 2 characters long';
  }

  if (!formData.adminUsername?.trim()) {
    errors.adminUsername = 'Username is required';
  } else if (formData.adminUsername.length < 3) {
    errors.adminUsername = 'Username must be at least 3 characters long';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.adminUsername)) {
    errors.adminUsername = 'Username can only contain letters, numbers, hyphens, and underscores';
  }

  if (!formData.adminEmail?.trim()) {
    errors.adminEmail = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
    errors.adminEmail = 'Please enter a valid email address';
  }

  if (!formData.adminPhone?.trim()) {
    errors.adminPhone = 'Phone number is required';
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.adminPhone.replace(/\s/g, ''))) {
    errors.adminPhone = 'Please enter a valid phone number';
  }

  if (!formData.adminPassword?.trim()) {
    errors.adminPassword = 'Password is required';
  } else if (formData.adminPassword.length < 8) {
    errors.adminPassword = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.adminPassword)) {
    errors.adminPassword = 'Password must contain uppercase, lowercase, number, and special character';
  }

  if (!formData.adminConfirmPassword?.trim()) {
    errors.adminConfirmPassword = 'Please confirm your password';
  } else if (formData.adminPassword !== formData.adminConfirmPassword) {
    errors.adminConfirmPassword = 'Passwords do not match';
  }

  // Validate new accounts array if it exists
  if (formData.newAccounts && Array.isArray(formData.newAccounts)) {
    formData.newAccounts.forEach((account: any, index: number) => {
      // Only validate if at least one field is filled
      const hasAnyField = account.firstName?.trim() || account.lastName?.trim() || 
                         account.username?.trim() || account.email?.trim() || 
                         account.phone?.trim() || account.password?.trim() || 
                         account.confirmPassword?.trim() || account.role?.trim();

      if (hasAnyField) {
        // Validate required fields for new accounts
        if (!account.firstName?.trim()) {
          errors[`newAccounts.${index}.firstName`] = 'First name is required';
        } else if (account.firstName.length < 2) {
          errors[`newAccounts.${index}.firstName`] = 'First name must be at least 2 characters long';
        }

        if (!account.lastName?.trim()) {
          errors[`newAccounts.${index}.lastName`] = 'Last name is required';
        } else if (account.lastName.length < 2) {
          errors[`newAccounts.${index}.lastName`] = 'Last name must be at least 2 characters long';
        }

        if (!account.username?.trim()) {
          errors[`newAccounts.${index}.username`] = 'Username is required';
        } else if (account.username.length < 3) {
          errors[`newAccounts.${index}.username`] = 'Username must be at least 3 characters long';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(account.username)) {
          errors[`newAccounts.${index}.username`] = 'Username can only contain letters, numbers, hyphens, and underscores';
        }

        if (!account.email?.trim()) {
          errors[`newAccounts.${index}.email`] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
          errors[`newAccounts.${index}.email`] = 'Please enter a valid email address';
        }

        if (!account.phone?.trim()) {
          errors[`newAccounts.${index}.phone`] = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(account.phone.replace(/\s/g, ''))) {
          errors[`newAccounts.${index}.phone`] = 'Please enter a valid phone number';
        }

        if (!account.role?.trim()) {
          errors[`newAccounts.${index}.role`] = 'Role is required';
        }

        if (!account.password?.trim()) {
          errors[`newAccounts.${index}.password`] = 'Password is required';
        } else if (account.password.length < 8) {
          errors[`newAccounts.${index}.password`] = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(account.password)) {
          errors[`newAccounts.${index}.password`] = 'Password must contain uppercase, lowercase, number, and special character';
        }

        if (!account.confirmPassword?.trim()) {
          errors[`newAccounts.${index}.confirmPassword`] = 'Please confirm your password';
        } else if (account.password !== account.confirmPassword) {
          errors[`newAccounts.${index}.confirmPassword`] = 'Passwords do not match';
        }
      }
    });
  }

  // Validate default new account fields (if any are filled)
  const hasDefaultNewAccountFields = formData.newAccountFirstName?.trim() || 
                                   formData.newAccountLastName?.trim() || 
                                   formData.newAccountUsername?.trim() || 
                                   formData.newAccountEmail?.trim() || 
                                   formData.newAccountPhone?.trim() || 
                                   formData.newAccountPassword?.trim() || 
                                   formData.newAccountConfirmPassword?.trim() || 
                                   formData.newAccountRole?.trim();

  if (hasDefaultNewAccountFields) {
    if (!formData.newAccountFirstName?.trim()) {
      errors.newAccountFirstName = 'First name is required';
    } else if (formData.newAccountFirstName.length < 2) {
      errors.newAccountFirstName = 'First name must be at least 2 characters long';
    }

    if (!formData.newAccountLastName?.trim()) {
      errors.newAccountLastName = 'Last name is required';
    } else if (formData.newAccountLastName.length < 2) {
      errors.newAccountLastName = 'Last name must be at least 2 characters long';
    }

    if (!formData.newAccountUsername?.trim()) {
      errors.newAccountUsername = 'Username is required';
    } else if (formData.newAccountUsername.length < 3) {
      errors.newAccountUsername = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.newAccountUsername)) {
      errors.newAccountUsername = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    if (!formData.newAccountEmail?.trim()) {
      errors.newAccountEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newAccountEmail)) {
      errors.newAccountEmail = 'Please enter a valid email address';
    }

    if (!formData.newAccountPhone?.trim()) {
      errors.newAccountPhone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.newAccountPhone.replace(/\s/g, ''))) {
      errors.newAccountPhone = 'Please enter a valid phone number';
    }

    if (!formData.newAccountRole?.trim()) {
      errors.newAccountRole = 'Role is required';
    }

    if (!formData.newAccountPassword?.trim()) {
      errors.newAccountPassword = 'Password is required';
    } else if (formData.newAccountPassword.length < 8) {
      errors.newAccountPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newAccountPassword)) {
      errors.newAccountPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.newAccountConfirmPassword?.trim()) {
      errors.newAccountConfirmPassword = 'Please confirm your password';
    } else if (formData.newAccountPassword !== formData.newAccountConfirmPassword) {
      errors.newAccountConfirmPassword = 'Passwords do not match';
    }
  }

  // Generate remarks based on form data
  if (formData.adminFirstName && formData.adminLastName) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Admin name configured: ${formData.adminFirstName} ${formData.adminLastName}`);
  }

  if (formData.adminUsername && formData.adminUsername.length >= 3) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Admin username: ${formData.adminUsername}`);
  }

  if (formData.adminEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Admin email configured: ${formData.adminEmail}`);
  }

  if (formData.adminPhone && /^[\+]?[1-9][\d]{0,15}$/.test(formData.adminPhone.replace(/\s/g, ''))) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Admin phone configured: ${formData.adminPhone}`);
  }

  if (formData.adminPassword && formData.adminPassword.length >= 8) {
    remarks.push('<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Password meets security requirements');
  }

  if (formData.adminPassword === formData.adminConfirmPassword && formData.adminPassword) {
    remarks.push('<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Password confirmation matches');
  }

  // Count new accounts
  const newAccountsCount = formData.newAccounts?.length || 0;
  if (newAccountsCount > 0) {
    remarks.push(`<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ${newAccountsCount} additional account(s) configured`);
  }

  if (hasDefaultNewAccountFields) {
    remarks.push('<svg class="w-4 h-4 inline mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Default new account template configured');
  }

  if (formData.sendWelcomeEmail) {
    remarks.push('💡 Welcome email will be sent to users upon account creation');
  } else {
    remarks.push('⚠️ Welcome email is disabled - users will need to set passwords manually');
  }

  // Additional helpful remarks
  if (formData.adminEmail?.includes('admin') || formData.adminEmail?.includes('administrator')) {
    remarks.push('💡 Consider using a personal email for admin account for better security');
  }

  if (formData.adminPassword && formData.adminPassword.length > 12) {
    remarks.push('💡 Strong password detected - good security practice');
  }

  if (newAccountsCount > 5) {
    remarks.push('⚠️ Many additional accounts configured - consider bulk import for large teams');
  }

  if (formData.newAccounts?.some((acc: any) => acc.role === 'admin')) {
    remarks.push('💡 Additional admin accounts detected - ensure proper access controls');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    remarks
  };
};

/**
 * Validates Brand Personalization form data
 */
export const validateBrandPersonalization = (formData: any): { isValid: boolean; errors: Record<string, string>; remarks: string[] } => {
  const errors: Record<string, string> = {};
  const remarks: string[] = [];

  // Required field validations
  if (!formData.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  } else if (formData.companyName.length < 2) {
    errors.companyName = 'Company name must be at least 2 characters long';
  }

  if (formData.companyWebsite && !/^https?:\/\/.+/.test(formData.companyWebsite)) {
    errors.companyWebsite = 'Please enter a valid website URL starting with http:// or https://';
  }

  // Check for primary color in both brand and custom modes
  const primaryColor = formData.primaryColor || formData.customPrimaryColor || '#0066cc';
  if (!primaryColor) {
    errors.primaryColor = 'Primary color is required';
  }

  if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    errors.contactEmail = 'Please enter a valid contact email address';
  }

  if (formData.contactPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
    errors.contactPhone = 'Please enter a valid contact phone number';
  }

  // Generate remarks based on form data
  if (formData.companyName && formData.companyName.length >= 2) {
    remarks.push(`✓ Company name configured: ${formData.companyName}`);
  }

  if (formData.companyWebsite && /^https?:\/\/.+/.test(formData.companyWebsite)) {
    remarks.push(`✓ Company website configured: ${formData.companyWebsite}`);
  }

  if (primaryColor) {
    remarks.push(`✓ Primary color selected: ${primaryColor}`);
  }

  if (formData.appLogo) {
    remarks.push('✓ App logo uploaded');
  } else {
    remarks.push('💡 Consider uploading a logo for better brand recognition');
  }

  if (formData.appFavicon) {
    remarks.push('✓ Favicon uploaded');
  } else {
    remarks.push('💡 Consider uploading a favicon for browser tab identification');
  }

  if (formData.appDescription?.trim()) {
    remarks.push('✓ App description provided');
  } else {
    remarks.push('💡 Consider adding an app description for better user understanding');
  }

  if (formData.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
    remarks.push(`✓ Contact email configured: ${formData.contactEmail}`);
  }

  if (formData.contactPhone && /^[\+]?[1-9][\d]{0,15}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
    remarks.push(`✓ Contact phone configured: ${formData.contactPhone}`);
  }

  if (formData.timezone) {
    remarks.push(`✓ Timezone configured: ${formData.timezone}`);
  } else {
    remarks.push('💡 Consider setting a timezone for accurate time-based features');
  }

  if (formData.currency) {
    remarks.push(`✓ Currency configured: ${formData.currency}`);
  } else {
    remarks.push('💡 Consider setting a currency for billing and financial features');
  }

  // Additional helpful remarks
  if (formData.enableDarkMode) {
    remarks.push('💡 Dark mode enabled - users can switch between light and dark themes');
  }

  if (formData.enableMultiLanguage) {
    remarks.push('💡 Multi-language support enabled - consider adding language packs');
  }

  if (primaryColor === '#0066cc') {
    remarks.push('💡 Default blue color selected - consider customizing for brand identity');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    remarks
  };
};

/**
 * Validates Feature Selection form data
 */
export const validateFeatureSelection = (formData: any): { isValid: boolean; errors: Record<string, string>; remarks: string[] } => {
  const errors: Record<string, string> = {};
  const remarks: string[] = [];

  // Required field validations
  if (!formData.modules || formData.modules.length === 0) {
    errors.modules = 'At least one module must be selected';
  }

  // Check for required default modules
  const requiredModules = ['dashboard', 'consumer', 'user_management_default', 'role_management'];
  const missingRequired = requiredModules.filter(module => !formData.modules?.includes(module));
  
  if (missingRequired.length > 0) {
    errors.modules = `Required modules missing: ${missingRequired.join(', ')}`;
  }

  // Generate remarks based on form data
  if (formData.modules && formData.modules.length > 0) {
    remarks.push(`✓ ${formData.modules.length} module(s) selected`);
  }

  // Check for specific module combinations
  if (formData.modules?.includes('bills')) {
    if (formData.modules?.includes('prepaid') || formData.modules?.includes('postpaid')) {
      remarks.push('✓ Billing system with specific billing types configured');
    } else {
      remarks.push('💡 Billing module selected - consider enabling prepaid or postpaid billing');
    }
  }

  if (formData.modules?.includes('tickets')) {
    remarks.push('✓ Support ticketing system enabled');
  }

  if (formData.modules?.includes('asset_management')) {
    remarks.push('✓ Asset management system enabled');
  }

  if (formData.modules?.includes('meter_management')) {
    remarks.push('✓ Meter management system enabled');
  }

  if (formData.modules?.includes('user_management_optional')) {
    remarks.push('✓ Advanced user management features enabled');
  }

  // Additional helpful remarks
  const optionalModules = formData.modules?.filter((m: string) => 
    !requiredModules.includes(m) && m !== 'prepaid' && m !== 'postpaid'
  ) || [];

  if (optionalModules.length > 3) {
    remarks.push('💡 Multiple optional modules selected - ensure adequate system resources');
  }

  if (formData.modules?.includes('prepaid') && formData.modules?.includes('postpaid')) {
    remarks.push('💡 Both prepaid and postpaid billing enabled - hybrid billing system');
  }

  if (formData.modules?.includes('asset_management') && formData.modules?.includes('meter_management')) {
    remarks.push('💡 Asset and meter management enabled - comprehensive infrastructure monitoring');
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