export const STEP_LABELS: { label: string; sub: string }[] = [
  { label: 'Application Setup', sub: 'Define your settings and preferences' },
  { label: 'Access Control', sub: 'Establish admin roles and secure access' },
  { label: 'Brand Personalization', sub: 'Apply your identity and visual themes' },
  { label: 'Feature Selection', sub: 'Choose modules to your operations' },
  { label: 'Finalize & Deploy', sub: 'Review configuration and go live confidently' },
];

export const INITIAL_APP_BASICS_DATA = {
  appName: '',
  subdomain: '',
  addressLine: '',
  country: '',
  state: '',
  city: '',
  applicationCategory: [],
  projectType: '',
  ownershipType: '',
  tariffPlans: [],
  billingMode: '',
  meteringType: [],
};

export const INITIAL_ADMIN_ACCESS_DATA = {
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminPhone: '',
  adminPassword: '',
  adminConfirmPassword: '',
  adminUsername: '',
  adminRole: '',
  newAccountRole: '',
  sendWelcomeEmail: false,
  newAccountFirstName: '',
  newAccountLastName: '',
  newAccountUsername: '',
  newAccountEmail: '',
  newAccountPhone: '',
  newAccountPassword: '',
  newAccountConfirmPassword: '',
  newAccounts: [],
};

export const INITIAL_BRANDING_DATA = {
  companyName: '',
  companyWebsite: '',
  appLogo: null,
  appFavicon: null,
  customPrimaryColor: '',
  customSecondaryColor: '',
  customTextPrimaryColor: '',
  customTextSecondaryColor: '',
  customBackgroundColor: '',
  customBorderColor: '',
  customShadowColor: '',
  customIconColor: '',
  customGradientColor: '',
  appDescription: '',
  contactEmail: '',
  contactPhone: '',
  timezone: '',
  currency: '',
  enableDarkMode: false,
  enableMultiLanguage: false,
};

export const INITIAL_MODULE_DATA = {
  modules: ['dashboard', 'consumer', 'user_management_default', 'role_management'],
};

export const STEP_COUNT = 5; 