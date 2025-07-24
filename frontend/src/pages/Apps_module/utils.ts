import { AppCreationAPI } from '../../api/appCreation';
import type { AllFormData, StepData } from './types';

/**
 * Combines all form data into a single object for API submission
 */
export const combineFormData = (stepData: StepData): AllFormData => {
  const payload = {
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
    // All color fields (for state and API)
    colorPrimaryBg: stepData.branding.colorPrimaryBg,
    colorPrimaryBgLight: stepData.branding.colorPrimaryBgLight,
    colorPrimaryLightest: stepData.branding.colorPrimaryLightest,
    colorSecondary: stepData.branding.colorSecondary,
    colorSecondaryLight: stepData.branding.colorSecondaryLight,
    colorSecondaryPositive: stepData.branding.colorSecondaryPositive,
    colorSecondaryPositiveLight: stepData.branding.colorSecondaryPositiveLight,
    colorTextPrimary: stepData.branding.colorTextPrimary,
    colorTextSecondary: stepData.branding.colorTextSecondary,
    colorPrimaryBorder: stepData.branding.colorPrimaryBorder,
    colorWarning: stepData.branding.colorWarning,
    colorWarningAlt: stepData.branding.colorWarningAlt,
    colorWarningLight: stepData.branding.colorWarningLight,
    colorDanger: stepData.branding.colorDanger,
    colorDangerAlt: stepData.branding.colorDangerAlt,
    colorDangerLight: stepData.branding.colorDangerLight,
    colorInfo: stepData.branding.colorInfo,
    colorNeutralDark: stepData.branding.colorNeutralDark,
    colorNeutralDarker: stepData.branding.colorNeutralDarker,
    colorNeutralLightest: stepData.branding.colorNeutralLightest,
    colorAccentLight: stepData.branding.colorAccentLight,
    colorShadowPrimary: stepData.branding.colorShadowPrimary,
    colorShadowSecondary: stepData.branding.colorShadowSecondary,
    colorPrimaryDark: stepData.branding.colorPrimaryDark,
    colorPrimaryDarkLight: stepData.branding.colorPrimaryDarkLight,
    colorDarkPrimary: stepData.branding.colorDarkPrimary,
    colorDarkSecondary: stepData.branding.colorDarkSecondary,
    colorDarkBorder: stepData.branding.colorDarkBorder,
    colorPrimaryGradient: stepData.branding.colorPrimaryGradient,
    colorPrimaryDarkGradient: stepData.branding.colorPrimaryDarkGradient,
    colorGradientSecondary: stepData.branding.colorGradientSecondary,
    colorStatIconGradient: stepData.branding.colorStatIconGradient,
    appDescription: stepData.branding.appDescription,
    contactEmail: stepData.branding.contactEmail,
    contactPhone: stepData.branding.contactPhone,
    enableDarkMode: stepData.branding.enableDarkMode,
    enableMultiLanguage: stepData.branding.enableMultiLanguage,

    // Modules
    modules: stepData.modules.modules,
  };
  console.log('combineFormData payload:', payload);
  return payload;
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

  // Send credentials email if requested
  if (formData.sendWelcomeEmail && formData.adminEmail && formData.adminUsername && formData.adminPassword) {
    try {
      await AppCreationAPI.sendLoginCredentialsEmail({
        to: formData.adminEmail,
        username: formData.adminUsername,
        password: formData.adminPassword,
      });
      alert('Login credentials email sent to admin.');
    } catch (e) {
      alert('App created, but failed to send credentials email: ' + (e instanceof Error ? e.message : e));
    }
  }
  
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
  } else if (formData.country !== 'India') {
    errors.country = 'Only India is supported';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State/Province is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  } else {
    // Validate that the city is in India
    // This is a basic validation - in a real implementation, you might want to check against a list of Indian cities
    const indianCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
      'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
      'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
      'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior',
      'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Bareilly',
      'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar',
      'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Guntur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai',
      'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded',
      'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar',
      'Jammu', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur',
      'Maheshtala', 'Tirupur', 'Davanagere', 'Kozhikode', 'Akbarpur', 'Kurnool', 'Bokaro', 'Rajahmundry', 'Ballari', 'Agartala',
      'Bhagalpur', 'Latur', 'Dhule', 'Korba', 'Bhilwara', 'Brahmapur', 'Mysore', 'Muzaffarpur', 'Ahmednagar', 'Mathura',
      'Kollam', 'Avadi', 'Kadapa', 'Kamarhati', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur', 'Shivamogga',
      'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur',
      'Hisar', 'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Tirupati',
      'Karnal', 'Bathinda', 'Rampur', 'Shivpuri', 'Ratlam', 'Modinagar', 'Delhi Cantonment', 'Ludhiana', 'Roorkee', 'Silchar',
      'Hapur', 'Anantapur', 'Arrah', 'Karimnagar', 'Parbhani', 'Etawah', 'Bharatpur', 'Begusarai', 'New Delhi', 'Chhapra',
      'Kadapa', 'Ramagundam', 'Pali', 'Satna', 'Vizianagaram', 'Katihar', 'Hardwar', 'Sonipat', 'Nagercoil', 'Thanjavur',
      'Murwara', 'Naihati', 'Sambalpur', 'Nadiad', 'Yamunanagar', 'English Bazar', 'Eluru', 'Munger', 'Panchkula', 'Raayachuru',
      'Panvel', 'Deoghar', 'Ongole', 'Nandyal', 'Morena', 'Bhiwani', 'Porbandar', 'Palakkad', 'Anand', 'Purnia',
      'Baharampur', 'Barmer', 'Morvi', 'Orai', 'Bahraich', 'Vikarabad', 'Phagwara', 'Bardoli', 'Sihor', 'Bhandara',
      'Pilkhuwa', 'Kapurthala', 'Chicheroda', 'Arambagh', 'Gohana', 'Ladnu', 'Pattukkottai', 'Sirsi', 'Sircilla', 'Tamluk',
      'Jagraon', 'AlipurdUrban Agglomerationr', 'Alirajpur', 'Tandur', 'Naidupet', 'Tirupathur', 'Tohana', 'Ratangarh', 'Dhubri', 'Masaurhi',
      'Visnagar', 'Vrindavan', 'Nokha', 'Nagda', 'Nohar', 'Chittur-Thathamangalam', 'Malaj Khand', 'Sarangpur', 'Robertsganj', 'Sirkali',
      'Radhanpur', 'Tiruchendur', 'Utraula', 'Patratu', 'Vijainagar', 'Periyasemur', 'Panruti', 'Manapparai', 'Tehri', 'Samdhan',
      'Pardi', 'Rahatgarh', 'Panagar', 'Uthiramerur', 'Tirora', 'Rangia', 'Sahjanwa', 'Wara Seoni', 'Magadi', 'Rajgarh',
      'Modinagar', 'Lalganj', 'Narkhed', 'Mangaldoi', 'Nargund', 'Tirumangalam', 'Kawardha', 'Ramanagaram', 'Uchgaon', 'Mokokchung',
      'Paschim Punropara', 'Sagwara', 'Ramganj Mandi', 'Tarakeswar', 'Mahalingapura', 'Dharmanagar', 'Mahemdabad', 'Manendragarh', 'Uran', 'Tharamangalam',
      'Tirukkoyilur', 'Pen', 'Makhdumpur', 'Shoranur', 'Naharlagun', 'Saidpur', 'Rampurhat', 'Chinchani', 'Kadayanallur', 'Ranibennur',
      'Kaikalur', 'Mangalagiri', 'Phulabani', 'Umreth', 'Narsipatnam', 'Nautanwa', 'Rajgir', 'Yellandu', 'Sathyamangalam', 'Pilibanga',
      'Morshi', 'Pehowa', 'Sonepur', 'Pappinisseri', 'Zamania', 'Mihijam', 'Purna', 'Puliyankudi', 'Shikarpur, Bulandshahr', 'Umaria',
      'Porsa', 'Naugawan Sadat', 'Fatehpur Sikri', 'Manuguru', 'Udaipur', 'Pipar City', 'Pattamundai', 'Nanjikottai', 'Taranagar', 'Yerraguntla',
      'Satana', 'Sherghati', 'Sankeshwara', 'Madikeri', 'Thuraiyur', 'Sanand', 'Rajula', 'Kyathampalle', 'Shahabad, Rampur', 'Tilda Newra',
      'Narsinghgarh', 'Chittur', 'Sirohi', 'Dandeli', 'Shamli', 'Pranpur', 'Khunti', 'Balangir', 'Wanaparthy', 'Gudur',
      'Kendujhar', 'Mandla', 'Mandi', 'Nimbahera', 'Vijapur', 'Sawantwadi', 'Sitapur', 'Hathras', 'Silvassa', 'Talcher',
      'Virudhachalam', 'Kanhangad', 'Karauli', 'Mangaldoi', 'Phagwara', 'Puducherry', 'Keshod', 'Sullurpeta', 'Wadhwan', 'Gurdaspur',
      'Vatakara', 'Tura', 'Narnaul', 'Kharar', 'Yadgir', 'Ambejogai', 'Ankleshwar', 'Savarkundla', 'Paradip', 'Virudhunagar',
      'Koratla', 'Valparai', 'Sangli', 'Vijayapura', 'Santipur', 'Bhind', 'Gondiya', 'Tiruchengode', 'Yeola', 'Mukhed',
      'Rajgarh', 'Ladwa', 'Arsikere', 'Obra', 'Nalgonda', 'Suri', 'Rajauri', 'Perinthalmanna', 'Rafiganj', 'Mukhed',
      'Kodungallur', 'Phulabani', 'Umreth', 'Narsipatnam', 'Nautanwa', 'Rajgir', 'Yellandu', 'Sathyamangalam', 'Pilibanga',
      'Morshi', 'Pehowa', 'Sonepur', 'Pappinisseri', 'Zamania', 'Mihijam', 'Purna', 'Puliyankudi', 'Shikarpur, Bulandshahr', 'Umaria',
      'Porsa', 'Naugawan Sadat', 'Fatehpur Sikri', 'Manuguru', 'Udaipur', 'Pipar City', 'Pattamundai', 'Nanjikottai', 'Taranagar', 'Yerraguntla'
    ];
    
    const cityName = formData.city.trim();
    const isIndianCity = indianCities.some(city => 
      city.toLowerCase() === cityName.toLowerCase() ||
      cityName.toLowerCase().includes(city.toLowerCase()) ||
      city.toLowerCase().includes(cityName.toLowerCase())
    );
    
    if (!isIndianCity) {
      errors.city = 'Please enter a valid Indian city';
    }
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
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Application name "${formData.appName}" is valid</div>`);
  }

  if (
    formData.appName &&
    formData.subdomain &&
    /^https:\/\/www\.[a-z0-9-]+\.bestinfra\.app$/.test(formData.subdomain)
  ) {
    remarks.push(`<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Subdomain configured: ${formData.subdomain}`);
  }

  if (formData.addressLine && formData.country && formData.state && formData.city) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Location configured: ${formData.city}, ${formData.state}, ${formData.country}</div>`);
  } else if (formData.addressLine || formData.city || formData.state || formData.country) {
    const locationParts = [formData.city, formData.state, formData.country].filter(Boolean);
    if (locationParts.length > 0) {
      remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Partial location: ${locationParts.join(', ')}</div>`);
    }
  }

  if (formData.applicationCategory && formData.applicationCategory.length > 0) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Application categories selected: ${formData.applicationCategory.length} category(ies)</div>`);
  }

  if (formData.projectType) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Project type: ${formData.projectType}</div>`);
  }

  if (formData.ownershipType) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Ownership type: ${formData.ownershipType}</div>`);
  }

  if (formData.tariffPlans && formData.tariffPlans.length > 0) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Tariff plans configured: ${formData.tariffPlans.length} plan(s)</div>`);
  }

  if (formData.billingMode) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Billing mode: ${formData.billingMode}</div>`);
  }

  if (formData.meteringType && formData.meteringType.length > 0) {
    remarks.push(`<div class="flex items-center gap-2"><img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Metering types: ${formData.meteringType.length} type(s)</div>`);
  }

  // Additional helpful remarks
  if (formData.applicationCategory?.includes('smart-metering') && formData.meteringType?.includes('smart-meter')) {
    remarks.push('<div class="flex items-center gap-2"><img src="icons/info.svg" alt="info" class="w-4 h-4 inline mr-1" /> Smart metering configuration detected - consider enabling AMR/AMI features</div>');
  }

  if (formData.billingMode === 'prepaid' && formData.tariffPlans?.includes('prepaid')) {
    remarks.push('<div class="flex items-center gap-2"><img src="icons/info.svg" alt="info" class="w-4 h-4 inline mr-1" /> Prepaid billing mode selected - ensure payment gateway integration is configured</div>');
  }



  if (formData.projectType === 'pilot') {
    remarks.push('  <div class="flex items-center gap-2"><img src="icons/info.svg" alt="info" class="w-4 h-4 inline mr-1" /> Pilot project detected - consider limited user access and testing features</div>');
  }

  if (formData.applicationCategory?.includes('solar-epc') || formData.meteringType?.includes('solar-bidirectional')) {
    remarks.push('<div class="flex items-center gap-2"><img src="icons/info.svg" alt="info" class="w-4 h-4 inline mr-1" /> Solar/EPC configuration detected - ensure net metering features are enabled</div>');
  }

  // Validation warnings
  if (formData.applicationCategory?.length > 3) {
    remarks.push('<img src="icons/triangle-warning.svg" alt="warning" class="w-4 h-4 inline mr-1" /> Multiple application categories selected - consider focusing on core functionality');
  }

  if (formData.tariffPlans?.length > 5) {
    remarks.push('<img src="icons/triangle-warning.svg" alt="warning" class="w-4 h-4 inline mr-1" /> Many tariff plans selected - ensure billing system can handle complexity');
  }

  if (formData.meteringType?.length > 4) {
    remarks.push('<img src="icons/triangle-warning.svg" alt="warning" class="w-4 h-4 inline mr-1" /> Multiple metering types selected - verify hardware compatibility');
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
    remarks.push(`<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Admin name configured: ${formData.adminFirstName} ${formData.adminLastName}`);
  }

  if (formData.adminUsername && formData.adminUsername.length >= 3) {
    remarks.push(`<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Admin username: ${formData.adminUsername}`);
  }

  if (formData.adminEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
    remarks.push(`<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Admin email configured: ${formData.adminEmail}`);
  }

  if (formData.adminPhone && /^[\+]?[1-9][\d]{0,15}$/.test(formData.adminPhone.replace(/\s/g, ''))) {
    remarks.push(`<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" /> Admin phone configured: ${formData.adminPhone}`);
  }

  if (formData.adminPassword && formData.adminPassword.length >= 8) {
    remarks.push('<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" />" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Password meets security requirements');
  }

  if (formData.adminPassword === formData.adminConfirmPassword && formData.adminPassword) {
    remarks.push('<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" />" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Password confirmation matches');
  }

  // Count new accounts
  const newAccountsCount = formData.newAccounts?.length || 0;
  if (newAccountsCount > 0) {
    remarks.push(`<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" />" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> ${newAccountsCount} additional account(s) configured`);
  }

  if (hasDefaultNewAccountFields) {
    remarks.push('<img src="icons/check.svg" alt="success" class="w-4 h-4 inline mr-1" />" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Default new account template configured');
  }

  if (formData.sendWelcomeEmail) {
    remarks.push('<img src="icons/check.svg" alt="info" class="w-4 h-4 inline mr-1" /> Welcome email will be sent to users upon account creation');
  } else {
    remarks.push('<img src="icons/triangle-warning.svg" alt="warning" class="w-4 h-4 inline mr-1" /> Welcome email is disabled - users will need to set passwords manually');
  }

  // Additional helpful remarks
  if (formData.adminEmail?.includes('admin') || formData.adminEmail?.includes('administrator')) {
    remarks.push('<img src="icons/info.svg" alt="info" class="w-4 h-4 inline mr-1" /> Consider using a personal email for admin account for better security');
  }

  if (formData.adminPassword && formData.adminPassword.length > 12) {
    remarks.push('<img src="icons/check.svg" alt="info" class="w-4 h-4 inline mr-1" /> Strong password detected - good security practice');
  }

  if (newAccountsCount > 5) {
    remarks.push('<img src="icons/triangle-warning.svg" alt="warning" class="w-4 h-4 inline mr-1" /> Many additional accounts configured - consider bulk import for large teams');
  }

  if (formData.newAccounts?.some((acc: any) => acc.role === 'admin')) {
    remarks.push('<img src="icons/info.svg" alt="info" class="w-4 h-4 inline mr-1" /> Additional admin accounts detected - ensure proper access controls');
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
  const requiredModules = ['dashboard', 'consumer', 'user_management_default'];
  const missingRequired = requiredModules.filter(module => !formData.modules?.includes(module));
  
  if (missingRequired.length > 0) {
    remarks.push(`💡 Consider enabling: ${missingRequired.join(', ')}`);
  }

  // Add remark about role management being included with user management
  if (formData.modules?.includes('user_management_default')) {
    remarks.push('✓ User Management enabled (includes Role Management)');
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