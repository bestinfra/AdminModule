import React, { useState } from 'react';
import Page from '../../components/global/Page';
import AppBasicsStep from './components/AppBasicsStep';
import AdminAccessForm from './components/AdminAccessForm';
import BrandingStep from './components/BrandingStep';
import ModuleSelectionStep from './components/ModuleSelectionStep';
import GoLiveStep from './components/GoLiveStep';
import type { AdminAccessFormData, AdminAccessFormErrors } from './components/AdminAccessForm';
import { AppCreationAPI } from '../../api/appCreation';

const stepLabels: { label: string; sub: string }[] = [
  { label: 'App Basics', sub: 'Configure your application settings' },
  { label: 'Admin Access', sub: 'Set up administrator account' },
  { label: 'Branding', sub: 'Customize your app appearance' },
  { label: 'Modules', sub: 'Select feature modules' },
  { label: 'Complete', sub: 'Review and complete app configuration' },
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
  const [generatedApps, setGeneratedApps] = useState<any[]>([]);
  const [showGeneratedApps, setShowGeneratedApps] = useState(false);

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

  // Load generated apps
  const loadGeneratedApps = async () => {
    try {
      const response = await AppCreationAPI.getGeneratedApps();
      setGeneratedApps(response.apps);
    } catch (error) {
      console.error('Error loading generated apps:', error);
    }
  };

  // Toggle generated apps view
  const toggleGeneratedApps = () => {
    if (!showGeneratedApps) {
      loadGeneratedApps();
    }
    setShowGeneratedApps(!showGeneratedApps);
  };

  // Final submit handler
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // Combine all form data
      const allFormData = {
        ...appBasicsData,
        ...adminAccessData,
        ...brandingData,
        ...moduleData,
      };
      
      console.log('Creating app with data:', allFormData);
      
      // Check if server is running
      const isServerHealthy = await AppCreationAPI.checkServerHealth();
      if (!isServerHealthy) {
        throw new Error('App creation server is not running. Please start the server with: npm run server');
      }
      
      // Create the app using the API
      const result = await AppCreationAPI.createApp(allFormData);
      
      // Handle success
      alert(`✅ ${result.message}\n\nNext steps:\n${result.nextSteps.join('\n')}`);
      
      // Refresh generated apps list if it's currently shown
      if (showGeneratedApps) {
        await loadGeneratedApps();
      }
      
      // Optional: Reset form or redirect
      // setCurrentStep(1);
      // Reset all form data if needed
      
    } catch (error) {
      console.error('Error creating app:', error);
      alert(`❌ Error creating app: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <div className="flex flex-col gap-4">
        {stepLabels.map((step: { label: string; sub: string }, idx: number) => (
          <div
            key={step.label}
            className={`p-4 rounded-lg border transition-all border-gray-200 dark:border-dark-border bg-white dark:bg-primary-dark shadow-sm ${idx === currentStep - 1 ? 'ring-2 ring-primary border-primary' : ''}`}
          >
            <div className={`font-semibold ${idx === currentStep - 1 ? 'text-primary dark:text-white' : 'text-main dark:text-white'}`}>{step.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{step.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center gap-4 mt-4">
        {currentStep > 1 && (
          <button className="btn-outline" type="button" onClick={handleBack}>Previous</button>
        )}
        <div className="flex gap-2">
          {currentStep < stepLabels.length && (
            <button className="btn-primary" type="button" onClick={handleNext}>Next</button>
          )}
          <button className="btn-outline" type="button" onClick={() => {}}>Save Draft</button>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
        <button 
          className="w-full btn-outline text-sm" 
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
      </div>
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

  const sections = [
    {
      id: 'main',
      component: stepComponent,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-primary-dark-light px-4 py-8 flex flex-col items-center justify-start w-full">
      <div className="w-full max-w-7xl mx-auto">
        <Page
          layout="single-column"
          sections={sections}
          sidebar={<SidebarContent currentStep={currentStep} />}
          sidebarPosition="left"
          className="max-w-7xl mx-auto p-6"
          containerClassName="space-y-6"
          sectionClassName="border rounded-lg p-6 bg-white shadow-sm"
        />
      </div>
    </main>
  );
};

export default AppManagement; 