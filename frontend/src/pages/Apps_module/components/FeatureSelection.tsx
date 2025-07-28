import React, { useState, useMemo } from 'react';
import Button from '@components/global/Button';
import { validateFeatureSelection } from '@pages/Apps_module/utils';
import RemarksPanel from '@pages/Apps_module/components/RemarksPanel';

interface FeatureSelectionProps {
  formData: any;
  errors: Record<string, string>;
  onModuleToggle: (moduleKey: string, newModules?: string[]) => void;
  onNext: (e: React.FormEvent<HTMLFormElement>) => void;
  currentStep?: number;
  onBack?: () => void;
}

// Module configuration with all modules in one section
const moduleConfig = [
  { 
    key: 'dashboard', 
    label: 'Dashboard', 
    description: 'Overview and analytics dashboard with DTR Dashboard',
    nested: [
      { key: 'consumer_dashboard', label: 'Consumer Dashboard', description: 'Overview and analytics dashboard' },
      { key: 'dtr_dashboard', label: 'DTR Dashboard', description: 'DTR Dashboard' }
    ]
  },
  { key: 'consumer', label: 'Consumer', description: 'Consumer management and profiles' },
  { key: 'asset_management', label: 'Asset Management', description: 'Manage physical assets and equipment' },
  { key: 'user_management_default', label: 'User Management', description: 'Core user management and permissions (includes Role Management)' },
  { key: 'meter_management', label: 'Meter Management', description: 'Smart meter monitoring and control' },
  { key: 'tickets', label: 'Tickets', description: 'Support ticketing system' },
  { 
    key: 'bills', 
    label: 'Bills', 
    description: 'Billing and payment management',
    nested: [
      { key: 'prepaid', label: 'Prepaid' },
      { key: 'postpaid', label: 'Postpaid' }
    ]
  },
];

const FeatureSelection: React.FC<FeatureSelectionProps> = ({ formData, errors, onModuleToggle, onNext, currentStep = 1, onBack }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const enabledModules = formData.modules || [];

  // Validate form data and generate remarks
  const { isValid, errors: validationErrors, remarks } = useMemo(() => {
    return validateFeatureSelection(formData);
  }, [formData]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  // Remove unused functions: handleModuleToggle, handleNestedModuleToggle, isNestedModuleEnabled

  const isModuleEnabled = (moduleKey: string) => enabledModules.includes(moduleKey);

  // Remove all optional module logic and UI
  // Only render the core modules section
  // Render all modules as selectable
  const renderModuleItem = (module: any) => {
    if (module.nested) {
      // Render modules with nested items (dashboard and bills)
      return (
        <div key={module.key} className="flex flex-col gap-2">
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-primary-dark border border-gray-200 dark:border-dark-border rounded-lg transition-all hover:border-primary hover:shadow-sm">
            <label className="flex items-start select-none cursor-pointer flex-shrink-0 pt-1">
              <input
                type="checkbox"
                checked={isModuleEnabled(module.key)}
                onChange={() => onModuleToggle(module.key)}
                className="peer sr-only"
              />
              <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                isModuleEnabled(module.key) 
                  ? 'border-primary bg-primary' 
                  : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
              }`}>
                {isModuleEnabled(module.key) && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </label>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-main dark:text-white">{module.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
            </div>
          </div>
          {/* Render nested modules if parent module is enabled */}
          {isModuleEnabled(module.key) && (
            <div className="ml-8 flex gap-2">
              {module.nested.map((nested: any) => (
                <div key={nested.key} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-gray-200 dark:border-dark-border rounded-lg transition-all">
                  <label className="flex items-start select-none cursor-pointer flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={isModuleEnabled(nested.key)}
                      onChange={() => onModuleToggle(nested.key)}
                      className="peer sr-only"
                    />
                    <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                      isModuleEnabled(nested.key) 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
                    }`}>
                      {isModuleEnabled(nested.key) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </label>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-main dark:text-white">{nested.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{nested.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    // Render all other modules
    return (
      <div key={module.key} className="flex items-start gap-3 p-3 bg-white dark:bg-primary-dark border border-gray-200 dark:border-dark-border rounded-lg transition-all hover:border-primary hover:shadow-sm">
        <label className="flex items-start select-none cursor-pointer flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isModuleEnabled(module.key)}
            onChange={() => onModuleToggle(module.key)}
            className="peer sr-only"
          />
          <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
            isModuleEnabled(module.key) 
              ? 'border-primary bg-primary' 
              : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
          }`}>
            {isModuleEnabled(module.key) && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        </label>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-main dark:text-white">{module.label}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-xl border border-primary-border p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 p-4 flex flex-col gap-4">
          <div className="">
            <h2 className="text-base font-semibold text-primary">Module Selection</h2>
            <p className="text-base text-gray-600 ">Configure which modules will be enabled for your application</p>
          </div>
          
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault();
            setHasSubmitted(true);
            // Only proceed if validation passes
            if (isValid) {
              onNext(e);
            }
          }} action="#" method="post" noValidate>
        {/* Core Modules Section */}
        <div className=" dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 flex flex-col gap-3 flex flex-col gap-2">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">Modules</h3>
            </div>
            <span className="text-xs px-4 py-1 rounded-full bg-primary-lightest">
              All Modules
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleConfig.map(renderModuleItem)}
          </div>
          {/* This section is removed as all modules are now displayed under one "Modules" section */}
          {allErrors.modules && (
            <div className="text-error text-sm font-medium mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              {allErrors.modules}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {currentStep > 1 && (
            <Button label="Previous" type="button" variant="secondary" onClick={onBack} />
          )}
          <div className="ml-auto">
            <Button label="Next" type="submit" variant="primary" />
          </div>
        </div>
      </form>
        </div>
        <RemarksPanel
          hasSubmitted={hasSubmitted}
          isValid={isValid}
          validationErrors={validationErrors}
          remarks={remarks}
        />
      </div>
    </div>
  );
};

export default FeatureSelection; 