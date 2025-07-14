import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/global/Page';
import PageHeader from '../../components/global/PageHeader';
import AppBasicsStep from './components/AppBasicsStep';
import AdminAccessForm from './components/AdminAccessForm';
import BrandingStep from './components/BrandingStep';
import ModuleSelectionStep from './components/ModuleSelectionStep';
import GoLiveStep from './components/GoLiveStep';
import type { AdminAccessFormData, AdminAccessFormErrors } from './components/AdminAccessForm';
import { AppCreationAPI } from '../../api/appCreation';


const stepLabels: { label: string; sub: string }[] = [
  { label: 'Application Setup', sub: 'Define your settings and preferences' },
  { label: 'Access Control', sub: 'Establish admin roles and secure access' },
  { label: 'Brand Personalization', sub: 'Apply your identity and visual themes' },
  { label: 'Feature Selection', sub: 'Choose modules to your operations' },
  { label: 'Finalize & Deploy', sub: 'Review configuration and go live confidently' },
];

const initialAppBasicsData = {
  appName: '',
  country: '',
  state: '',
  city: '',
  categories: [],
  subdomain: '',
  tariffPlans: [],
  termsAccepted: false,
};

const initialAdminAccessData: AdminAccessFormData = {
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminPhone: '',
  adminPassword: '',
  adminConfirmPassword: '',
  adminRole: '',
  adminDepartment: '',
  adminAddress: '',
  sendWelcomeEmail: false,
};

const initialBrandingData = {
  companyName: '',
  companyWebsite: '',
  appLogo: null,
  appFavicon: null,
  primaryColor: '',
  appDescription: '',
  contactEmail: '',
  contactPhone: '',
  timezone: '',
  currency: '',
  enableDarkMode: false,
  enableMultiLanguage: false,
};

const initialModuleData = {
  modules: ['dashboard', 'consumer', 'user_management_default', 'role_management'],
};

const initialAdminAccessErrors: AdminAccessFormErrors = {};

const AppManagement: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1-based index
  const [appBasicsData, setAppBasicsData] = useState<typeof initialAppBasicsData>(initialAppBasicsData);
  const [appBasicsErrors, setAppBasicsErrors] = useState<Partial<Record<keyof typeof initialAppBasicsData, string>>>({});
  const [adminAccessData, setAdminAccessData] = useState<AdminAccessFormData>(initialAdminAccessData);
  const [adminAccessErrors, setAdminAccessErrors] = useState<AdminAccessFormErrors>(initialAdminAccessErrors);
  const [brandingData, setBrandingData] = useState<typeof initialBrandingData>(initialBrandingData);
  const [brandingErrors, setBrandingErrors] = useState<Partial<Record<keyof typeof initialBrandingData, string>>>({});
  const [moduleData, setModuleData] = useState<typeof initialModuleData>(initialModuleData);
  const [moduleErrors, setModuleErrors] = useState<Partial<Record<keyof typeof initialModuleData, string>>>({});
  const [loading, setLoading] = useState(false);



  // Handlers for App Basics Step
  const handleAppBasicsInputChange = (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => {
    const { name, value, type, checked } = 'target' in e ? e.target : { name: '', value: '', type: '', checked: false };
    let newValue = value;
    if (type === 'checkbox') newValue = checked;
    setAppBasicsData((prev) => ({ ...prev, [name]: newValue }));
    if (appBasicsErrors[name as keyof typeof initialAppBasicsData]) {
      setAppBasicsErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleAppBasicsArrayChange = (name: string, value: any) => {
    setAppBasicsData((prev) => ({ ...prev, [name]: value }));
    if (appBasicsErrors[name as keyof typeof initialAppBasicsData]) {
      setAppBasicsErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handlers for Admin Access Step
  const handleAdminInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setAdminAccessData((prev) => ({ ...prev, [name]: newValue }));
    if (adminAccessErrors && Object.prototype.hasOwnProperty.call(adminAccessErrors, name)) {
      setAdminAccessErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleAdminDropdownChange = (e: { target: { name: string; value: string | string[] } }) => {
    const { name, value } = e.target;
    setAdminAccessData((prev) => ({ ...prev, [name]: value }));
    if (adminAccessErrors && Object.prototype.hasOwnProperty.call(adminAccessErrors, name)) {
      setAdminAccessErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handlers for Branding Step
  const handleBrandingInputChange = (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => {
    const { name, value, type, checked } = 'target' in e ? e.target : { name: '', value: '', type: '', checked: false };
    let newValue = value;
    if (type === 'checkbox') newValue = checked;
    setBrandingData((prev) => ({ ...prev, [name]: newValue }));
    if (brandingErrors[name as keyof typeof initialBrandingData]) {
      setBrandingErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handlers for Module Selection Step
  const handleModuleToggle = (moduleKey: string, newModules?: string[]) => {
    const currentModules = moduleData.modules || [];
    let updatedModules: string[];

    if (newModules) {
      updatedModules = newModules;
    } else if (currentModules.includes(moduleKey)) {
      updatedModules = currentModules.filter(m => m !== moduleKey);
    } else {
      updatedModules = [...currentModules, moduleKey];
    }

    setModuleData((prev) => ({ ...prev, modules: updatedModules }));
    if (moduleErrors.modules) {
      setModuleErrors((prev) => ({ ...prev, modules: undefined }));
    }
  };

  // Step navigation
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, stepLabels.length));
  };
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Edit step navigation
  const handleEditStep = (stepIndex: number) => {
    setCurrentStep(stepIndex + 1); // Convert 0-based to 1-based
  };





  // Final submit handler
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
        // Combine all form data
        const allFormData = {
            // App basics
            appName: appBasicsData.appName,
            subdomain: appBasicsData.subdomain,
            country: appBasicsData.country,
            state: appBasicsData.state,
            city: appBasicsData.city,
            categories: appBasicsData.categories,

            // Admin details
            adminFirstName: adminAccessData.adminFirstName,
            adminLastName: adminAccessData.adminLastName,
            adminEmail: adminAccessData.adminEmail,
            adminPhone: adminAccessData.adminPhone,
            adminRole: adminAccessData.adminRole,
            adminDepartment: adminAccessData.adminDepartment,
            adminAddress: adminAccessData.adminAddress,

            // Branding
            companyName: brandingData.companyName,
            companyWebsite: brandingData.companyWebsite,
            appLogo: brandingData.appLogo,
            appFavicon: brandingData.appFavicon,
            primaryColor: brandingData.primaryColor,
            contactEmail: brandingData.contactEmail,
            contactPhone: brandingData.contactPhone,
            timezone: brandingData.timezone,
            currency: brandingData.currency,
            enableDarkMode: brandingData.enableDarkMode,
            enableMultiLanguage: brandingData.enableMultiLanguage,

            // Modules
            modules: moduleData.modules,
        };
        
        console.log('Submitting form data:', allFormData);
        
        // Check if server is running
        const isServerHealthy = await AppCreationAPI.checkServerHealth();
        if (!isServerHealthy) {
            throw new Error('App creation server is not running. Please start the server with: npm run server');
        }
        
        // Create the app using the API
        const result = await AppCreationAPI.createApp(allFormData);
        
        // Handle success
        alert(`${result.message}\n\nNext steps:\n${result.nextSteps?.join('\n') || ''}`);
        

        
        // Optional: Reset form or redirect
        // setCurrentStep(1);
        // Reset all form data if needed
        
    } catch (error) {
      console.error('Error creating app:', error);
      alert(`Error creating app: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        setLoading(false);
    }
};

  // Step submit handlers
  const handleAppBasicsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  const handleAdminSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  const handleBrandingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  const handleModuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNext();
  };

  // Sidebar
  const SidebarContent: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex flex-col gap-6">
      
      <div className="createSteps bg-primary-lightest p-4 rounded-2xl">
        <div className="flex items-center justify-between gap-4">
          {stepLabels.map((step: { label: string; sub: string }, idx: number) => {
            const isActive = idx === currentStep - 1;
            const isCompleted = idx < currentStep - 1;
            
            return (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div
                    className={`p-4 rounded-lg transition-all dark:border-dark-border flex flex-row items-start gap-4 w-full ${
                      isActive 
                        ? 'bg-white dark:bg-primary-dark shadow-[0px_5px_5px_-2px_rgba(220,228,239,1)]' 
                        : isCompleted 
                          ? 'bg-white dark:bg-primary-dark'
                          : 'bg-white dark:bg-primary-dark opacity-60'
                    }`}
                  >
                    <div className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-full text-white text-sm font-semibold ${
                      isActive 
                        ? 'bg-primary' 
                        : isCompleted 
                          ? 'bg-secondary' 
                          : 'bg-gray-400'
                    }`}>
                      {isCompleted ? (
                       <img src={'icons/checkmark.svg'} alt="check" className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                      <h2 className={`text-base font-semibold ${
                        isActive 
                          ? 'font-extrabold text-primary dark:text-white' 
                          : isCompleted 
                            ? 'font-semibold text-secondary dark:text-secondary' 
                            : 'font-semibold text-main dark:text-white'
                      }`}>{step.label}</h2>
                      <h3 className={`text-base ${
                        isActive 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : isCompleted 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>{step.sub}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Connector line between steps */}
                {idx < stepLabels.length - 1 && (
                  <div className="flex items-center justify-center pt-4">
                    <div className={`h-0.5 w-8 ${
                      isCompleted ? 'bg-secondary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center gap-4 mt-4">
        {currentStep > 1 && (
          <span className="flex items-center gap-2 p-2 px-2 rounded-3xl border border-primary-border dark:border-dark-border bg-white dark:bg-primary-dark cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={handleBack}>
            <img src={'/icons/arrow-back.svg'} alt="arrow-left" className="w-7 h-7  filter dark:invert" />
            <span className="text-neutral dark:text-gray-300 font-medium">Previous</span>
          </span>
        )}
      </div>
      {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
        <button 
          className="w-full p-3 rounded-3xl border border-primary-border dark:border-dark-border bg-white dark:bg-primary-dark text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
          type="button" 
          onClick={toggleGeneratedApps}
        >
          {showGeneratedApps ? 'Hide' : 'Show'} Generated Apps
        </button>
        {showGeneratedApps && (
          <div className="mt-4 space-y-2">
            {generatedApps.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No apps generated yet</p>
            ) : (
              generatedApps.map((app) => (
                <div key={app.name} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-medium text-sm">{app.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(app.created).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div> */}
    </div>
  );

  // Step content
  let stepComponent = null;
  if (currentStep === 1) {
    stepComponent = (
      <AppBasicsStep
        formData={appBasicsData}
        errors={appBasicsErrors}
        onInputChange={handleAppBasicsInputChange}
        onArrayChange={handleAppBasicsArrayChange}
        onNext={handleAppBasicsSubmit}
      />
    );
  } else if (currentStep === 2) {
    stepComponent = (
      <AdminAccessForm
        formData={adminAccessData}
        errors={adminAccessErrors}
        onInputChange={handleAdminInputChange}
        onDropdownChange={handleAdminDropdownChange}
        loading={loading}
        onSubmit={handleAdminSubmit}
      />
    );
  } else if (currentStep === 3) {
    stepComponent = (
      <BrandingStep
        formData={brandingData}
        errors={brandingErrors}
        onInputChange={handleBrandingInputChange}
        onNext={handleBrandingSubmit}
      />
    );
  } else if (currentStep === 4) {
    stepComponent = (
      <ModuleSelectionStep
        formData={moduleData}
        errors={moduleErrors}
        onModuleToggle={handleModuleToggle}
        onNext={handleModuleSubmit}
      />
    );
  } else if (currentStep === 5) {
    stepComponent = (
      <GoLiveStep
        formData={{
          ...appBasicsData,
          ...adminAccessData,
          ...brandingData,
          ...moduleData,
        }}
        onEditStep={handleEditStep}
        onSubmit={handleFinalSubmit}
        isSubmitting={loading}
      />
    );
  }

  // Get header configuration based on current step
  const getHeaderConfig = () => {
    const currentStepLabel = stepLabels[currentStep - 1];
    return {
      title: currentStepLabel.label,
      showMenu: currentStep === 5,
      menuItems: currentStep === 5 ? [
        { id: 'save', label: 'Save as Template' },
        { id: 'export', label: 'Export Configuration' },
        { id: 'reset', label: 'Reset Form', isDestructive: true },
      ] : [],
      onMenuItemClick: (itemId: string) => {
        switch (itemId) {
          case 'save':
            console.log('Saving as template');
            break;
          case 'export':
            console.log('Exporting configuration');
            break;
          case 'reset':
            if (confirm('Are you sure you want to reset the form? This will clear all data.')) {
              setCurrentStep(1);
              setAppBasicsData(initialAppBasicsData);
              setAdminAccessData(initialAdminAccessData);
              setBrandingData(initialBrandingData);
              setModuleData(initialModuleData);
            }
            break;
        }
      },
      onBackClick: () => navigate('/'),
      backButtonText: 'Dashboard',
    };
  };

  const sections = [
    {
      id: 'main',
      component: stepComponent,
    },
  ];

  return (
    <main className="min-h-screen  dark:bg-primary-dark-light  flex flex-col items-center justify-start w-full">
      <div className="w-full">
        {/* Page Header */}
        <div className="mb-4">
          <PageHeader {...getHeaderConfig()} />
        </div>
        
        {/* Horizontal Progress Bar */}
        <div className="mb-6">
          <SidebarContent currentStep={currentStep} />
        </div>
        
        <Page
          layout="single-column"
          sections={sections}
          className=""
          containerClassName="space-y-6"
        />
      </div>
    </main>
  );
};

export default AppManagement; 