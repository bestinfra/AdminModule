import React, { useState } from 'react';
import Page from '../../components/global/Page';
import AppBasicsStep from './components/AppBasicsStep';

// Sidebar content as per user instructions
const SidebarContent = () => {
  const currentStep = 1;
  const stepLabels = [
    { label: 'App Basics', sub: 'Configure your application settings' },
    { label: 'Admin Access', sub: 'Set up administrator account' },
    { label: 'Branding', sub: 'Customize your app appearance' },
    { label: 'Modules', sub: 'Select feature modules' },
    { label: 'Go-Live', sub: 'Review and configure launch settings' },
  ];
  const errors: Record<string, string | null> = {};
  const handleBack = () => {};
  const handleNext = () => {};
  return (
    <div className="flex flex-col gap-6">
      {/* Stepper List */}
      <div className="flex flex-col gap-4">
        {stepLabels.map((step, idx) => (
          <div
            key={step.label}
            className={`p-4 rounded-lg border transition-all border-gray-200 dark:border-dark-border bg-white dark:bg-primary-dark shadow-sm ${idx === currentStep - 1 ? 'ring-2 ring-primary border-primary' : ''}`}
          >
            <div className={`font-semibold ${idx === currentStep - 1 ? 'text-primary dark:text-white' : 'text-main dark:text-white'}`}>{step.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{step.sub}</div>
          </div>
        ))}
      </div>
      {/* Error display placeholder */}
      {/* {errors.submit && (
        <ErrorDisplay ... />
      )} */}
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
    </div>
  );
};

const initialFormData = {
  appName: '',
  country: '',
  state: '',
  city: '',
  categories: [],
  subdomain: '',
  tariffPlans: [],
  termsAccepted: false,
};

type FormDataType = typeof initialFormData;
type ErrorsType = Record<keyof FormDataType, string | null>;

const AppManagement: React.FC = () => {
  // Local state for the AppBasicsStep demo
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [errors, setErrors] = useState<Partial<ErrorsType>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (errors[name as keyof FormDataType]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleArrayChange = (name: keyof FormDataType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const sections = [
    {
      id: 'main',
      component: (
        <AppBasicsStep
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onArrayChange={handleArrayChange}
        />
      ),
    },
  ];
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-primary-dark-light px-4 py-8 flex flex-col items-center justify-start w-full">
      <div className="w-full max-w-7xl mx-auto">
        <Page 
          layout="single-column" 
          sections={sections}
          sidebar={<SidebarContent />}
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