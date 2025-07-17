import React, { useState, useMemo } from 'react';
import Button from '@components/global/Button';
import { validateFeatureSelection } from '../utils';
import RemarksPanel from '@pages/Apps_module/components/RemarksPanel';

interface FeatureSelectionProps {
  formData: any;
  errors: Record<string, string>;
  onModuleToggle: (moduleKey: string, newModules?: string[]) => void;
  onNext: (e: React.FormEvent<HTMLFormElement>) => void;
  currentStep?: number;
  onBack?: () => void;
}

// Module configuration with default and optional modules
const moduleConfig = {
  default: [
    { key: 'dashboard', label: 'Dashboard', description: 'Overview and analytics dashboard' },
    { key: 'consumer', label: 'Consumer', description: 'Consumer management and profiles' },
    { key: 'user_management_default', label: 'User Management', description: 'Core user management and permissions' },
    { key: 'role_management', label: 'Role Management', description: 'Role-based access control' },
  ],
  optional: [
    { 
      key: 'bills', 
      label: 'Bills', 
      description: 'Billing and payment management',
      nested: [
        { key: 'prepaid', label: 'Prepaid', description: 'Prepaid billing system' },
        { key: 'postpaid', label: 'Postpaid', description: 'Postpaid billing system' }
      ]
    },
    { key: 'tickets', label: 'Tickets', description: 'Support ticketing system' },
    { key: 'asset_management', label: 'Asset Management', description: 'Manage physical assets and equipment' },
    { key: 'meter_management', label: 'Meter Management', description: 'Smart meter monitoring and control' },
    { key: 'user_management_optional', label: 'User Management (Advanced)', description: 'Advanced user management features' },
  ]
};

const FeatureSelection: React.FC<FeatureSelectionProps> = ({ formData, errors, onModuleToggle, onNext, currentStep = 1, onBack }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const enabledModules = formData.modules || ['dashboard', 'consumer', 'user_management_default', 'role_management'];

  // Validate form data and generate remarks
  const { isValid, errors: validationErrors, remarks } = useMemo(() => {
    return validateFeatureSelection(formData);
  }, [formData]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  const handleModuleToggle = (moduleKey: string) => {
    if (moduleKey === 'bills') {
      const isBillsCurrentlyEnabled = enabledModules.includes('bills');
      if (!isBillsCurrentlyEnabled) {
        // Toggling Bills ON: remove prepaid and postpaid from enabledModules
        const newModules = [
          ...enabledModules.filter((m: string) => m !== 'prepaid' && m !== 'postpaid'),
          'bills'
        ];
        onModuleToggle('bills', newModules);
        return;
      }
    }
    onModuleToggle(moduleKey);
  };

  const handleNestedModuleToggle = (nestedKey: string) => {
    onModuleToggle(nestedKey);
  };

  const isModuleEnabled = (moduleKey: string) => enabledModules.includes(moduleKey);
  const isNestedModuleEnabled = (nestedKey: string) => enabledModules.includes(nestedKey);

  const billsModule = moduleConfig.optional.find(m => m.key === 'bills');
  const otherModules = moduleConfig.optional.filter(m => m.key !== 'bills');
  const nestedModules = billsModule?.nested || [];

  let gridModules;
  if (isModuleEnabled('bills')) {
    gridModules = [
      billsModule,
      ...nestedModules.map(nm => ({ ...nm, isNested: true })),
      ...otherModules
    ];
  } else {
    gridModules = [
      billsModule,
      ...otherModules
    ];
  }

  // Check if sections are completed
  // const isDefaultSectionCompleted = moduleConfig.default.every(module => module && isModuleEnabled(module.key));
  // const isOptionalSectionCompleted = gridModules.filter(m => m && !('isNested' in m)).every(optModule => optModule && isModuleEnabled(optModule.key));

  // Render default modules as selectable
  const renderDefaultModuleItem = (module: any) => (
    <div key={module.key} className="flex items-start gap-3 p-3 bg-white dark:bg-primary-dark border border-gray-200 dark:border-dark-border rounded-lg transition-all hover:border-primary hover:shadow-sm">
      <button
        type="button"
        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all flex-shrink-0 ${
          isModuleEnabled(module.key) 
            ? 'border-primary bg-primary text-white' 
            : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
        }`}
        onClick={() => onModuleToggle(module.key)}
        aria-label={`Toggle ${module.label}`}
      >
        {isModuleEnabled(module.key) && <span className="font-bold text-xs">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-main dark:text-white">{module.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
      </div>
    </div>
  );

  const renderModuleItem = (module: any) => {
    if (module.isNested) {
      return (
        <div key={module.key} className="flex items-center gap-3 p-3 bg-white dark:bg-primary-dark border border-gray-200 dark:border-dark-border rounded-lg transition-all ml-8 border-l-3 border-l-primary bg-blue-50 dark:bg-blue-900/10">
          <button
            type="button"
            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all flex-shrink-0 ${
              isNestedModuleEnabled(module.key) 
                ? 'border-primary bg-primary text-white' 
                : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
            }`}
            onClick={() => handleNestedModuleToggle(module.key)}
            aria-label={`Toggle ${module.label}`}
          >
            {isNestedModuleEnabled(module.key) && <span className="font-bold text-xs">✓</span>}
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-main dark:text-white mb-1">{module.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
          </div>
        </div>
      );
    }
    return (
      <div key={module.key} className="flex items-center justify-start gap-3 p-3 bg-white dark:bg-primary-dark border border-gray-200 dark:border-dark-border rounded-lg transition-all hover:border-primary hover:shadow-sm">
        <button
          type="button"
          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all flex-shrink-0 ${
            isModuleEnabled(module.key) 
              ? 'border-primary bg-primary text-white' 
              : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
          }`}
          onClick={() => handleModuleToggle(module.key)}
          aria-label={`Toggle ${module.label}`}
        >
          {isModuleEnabled(module.key) && <span className="font-bold text-xs">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-main dark:text-white mb-1">{module.label}</div>
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
            <p className="text-base text-gray-600 mt-2">Configure which modules will be enabled for your application</p>
          </div>
          
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault();
            setHasSubmitted(true);
            // Only proceed if validation passes
            if (isValid) {
              onNext(e);
            }
          }} action="#" method="post" noValidate>
        {/* Default Modules Section */}
        <div className=" dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 flex flex-col gap-3 flex flex-col gap-2">
          <div className="flex  items-start m gap-4">
            <div>
              <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">Recomanded Modules</h3>
            </div>
         
            <span className="text-xs  px-4 py-1 rounded-full bg-primary-lightest">
              Default
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleConfig.default.map(renderDefaultModuleItem)}
          </div>
        </div>

        {/* Optional Modules Section */}
        <div className=" dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 flex flex-col gap-3">
          <div className="flex  items-start gap-4">
            <div>
              <h3 className="text-sm font-semibold text-primary dark:text-white">Optional Modules</h3>
           
            </div>
           
            <span className="text-xs bg-secondary-light px-4 py-1 rounded-full">
              Optional
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ transition: 'all 0.3s' }}>
            {gridModules.map(renderModuleItem)}
          </div>
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