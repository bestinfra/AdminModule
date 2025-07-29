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
    icon: '/icons/dashboard.svg',
    nested: [
      { key: 'consumer_dashboard', label: 'Consumer Dashboard', description: 'Overview and analytics dashboard' },
      { key: 'dtr_dashboard', label: 'DTR Dashboard', description: 'DTR Dashboard' }
    ]
  },
  { key: 'consumer', label: 'Consumer', description: 'Consumer management and profiles', icon: '/icons/customer-service.svg' },
  { key: 'asset_management', label: 'Asset Management', description: 'Manage physical assets and equipment', icon: '/icons/Asset_managment.svg' },
  { 
    key: 'user_management_default', 
    label: 'User Management', 
    description: 'Core user management and permissions (includes Role Management)', 
    icon: '/icons/user_managment.svg',
    nested: [
      { key: 'users', label: 'Users', description: 'User management' },
      { key: 'role_management', label: 'Role Management', description: 'Role and permission management' }
    ]
  },
  { 
    key: 'meter_management', 
    label: 'Meter Management', 
    description: 'Smart meter monitoring and control',
    icon: '/icons/meter_managment.svg',
    nested: [
      { key: 'data_logger_master', label: 'Data Logger Master', description: 'Data logger management' },
      { key: 'meter_list', label: 'Meter List', description: 'Meter inventory and monitoring' }
    ]
  },
  { key: 'tickets', label: 'Tickets', description: 'Support ticketing system', icon: '/icons/customer-service.svg' },
  { 
    key: 'bills', 
    label: 'Bills', 
    description: 'Billing and payment management',
    icon: '/icons/apps-icon.svg',
    nested: [
      { key: 'prepaid', label: 'Prepaid', description: 'Prepaid billing system' },
      { key: 'postpaid', label: 'Postpaid', description: 'Postpaid billing system' }
    ]
  },
];

const FeatureSelection: React.FC<FeatureSelectionProps> = ({ formData, errors, onModuleToggle, onNext, currentStep = 1, onBack }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const enabledModules = formData.modules || [];

  // Validate form data and generate remarks
  const { isValid, errors: validationErrors, remarks } = useMemo(() => {
    return validateFeatureSelection(formData);
  }, [formData]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  const isModuleEnabled = (moduleKey: string) => enabledModules.includes(moduleKey);

  // Get all nested module keys for a given module
  const getNestedModuleKeys = (module: any): string[] => {
    return module.nested ? module.nested.map((nested: any) => nested.key) : [];
  };

  // Check if all nested modules are selected
  const areAllNestedSelected = (module: any): boolean => {
    const nestedKeys = getNestedModuleKeys(module);
    return nestedKeys.length > 0 && nestedKeys.every((key: string) => isModuleEnabled(key));
  };

  // Check if some nested modules are selected (for partial selection state)
  const areSomeNestedSelected = (module: any): boolean => {
    const nestedKeys = getNestedModuleKeys(module);
    return nestedKeys.length > 0 && nestedKeys.some((key: string) => isModuleEnabled(key)) && !areAllNestedSelected(module);
  };

  // Handle module toggle with parent-child logic
  const handleModuleToggle = (moduleKey: string) => {
    const module = moduleConfig.find(m => m.key === moduleKey);
    const isCurrentlyEnabled = isModuleEnabled(moduleKey);
    
    if (module && module.nested) {
      // This is a parent module
      const nestedKeys = getNestedModuleKeys(module);
      
      if (isCurrentlyEnabled) {
        // Deselect parent and all children
        const newModules = enabledModules.filter((key: string) => key !== moduleKey && !nestedKeys.includes(key));
        onModuleToggle(moduleKey, newModules);
      } else {
        // Select parent and all children, and expand the module
        const newModules = [...enabledModules, moduleKey, ...nestedKeys];
        onModuleToggle(moduleKey, newModules);
        setExpandedModules(prev => [...prev, moduleKey]);
      }
    } else {
      // This is a regular module
      onModuleToggle(moduleKey);
    }
  };

  // Handle nested module toggle
  const handleNestedModuleToggle = (parentKey: string, nestedKey: string) => {
    const module = moduleConfig.find(m => m.key === parentKey);
    const isCurrentlyEnabled = isModuleEnabled(nestedKey);
    
    let newModules = [...enabledModules];
    
    if (isCurrentlyEnabled) {
      // Deselect nested module
      newModules = newModules.filter(key => key !== nestedKey);
      
      // If no nested modules are selected, deselect parent too
      const remainingNested = getNestedModuleKeys(module).filter(key => key !== nestedKey);
      if (!remainingNested.some(key => newModules.includes(key))) {
        newModules = newModules.filter(key => key !== parentKey);
      }
    } else {
      // Select nested module
      newModules.push(nestedKey);
      
      // If this is the first nested module being selected, also select parent
      if (!isModuleEnabled(parentKey)) {
        newModules.push(parentKey);
      }
    }
    
    onModuleToggle(nestedKey, newModules);
  };

  // Select all modules
  const selectAllModules = () => {
    const allModuleKeys = moduleConfig.flatMap(module => {
      const keys = [module.key];
      if (module.nested) {
        keys.push(...module.nested.map((nested: any) => nested.key));
      }
      return keys;
    });
    onModuleToggle('select-all', allModuleKeys);
    // Expand all modules with nested items
    const modulesWithNested = moduleConfig.filter(m => m.nested).map(m => m.key);
    setExpandedModules(modulesWithNested);
  };

  // Deselect all modules
  const deselectAllModules = () => {
    onModuleToggle('deselect-all', []);
    setExpandedModules([]);
  };

  const toggleExpanded = (moduleKey: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleKey) 
        ? prev.filter(key => key !== moduleKey)
        : [...prev, moduleKey]
    );
  };

  const isExpanded = (moduleKey: string) => expandedModules.includes(moduleKey);

  // Render module item with dropdown-like interface
  const renderModuleItem = (module: any) => {
    const hasNested = module.nested && module.nested.length > 0;
    const expanded = isExpanded(module.key);
    const enabled = isModuleEnabled(module.key);
    const allNestedSelected = areAllNestedSelected(module);
    const someNestedSelected = areSomeNestedSelected(module);

    // Determine checkbox state for parent modules
    let checkboxState = 'unchecked';
    if (hasNested) {
      if (allNestedSelected) {
        checkboxState = 'checked';
      } else if (someNestedSelected) {
        checkboxState = 'partial';
      }
    } else {
      checkboxState = enabled ? 'checked' : 'unchecked';
    }

    return (
      <div key={module.key} className="w-full">
        {/* Main module item */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-primary-dark border border-gray-200 dark:border-dark-border rounded-lg transition-all hover:border-primary hover:shadow-sm">
          {/* Checkbox */}
          <label className="flex items-center select-none cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={checkboxState === 'checked'}
              ref={(input) => {
                if (input) {
                  input.indeterminate = checkboxState === 'partial';
                }
              }}
              onChange={() => handleModuleToggle(module.key)}
              className="peer sr-only"
            />
            <span className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
              checkboxState === 'checked' 
                ? 'border-primary bg-primary' 
                : checkboxState === 'partial'
                ? 'border-primary bg-primary'
                : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
            }`}>
              {checkboxState === 'checked' && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {checkboxState === 'partial' && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              )}
            </span>
          </label>

          {/* Icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            <img
              src={module.icon}
              alt=""
              className="w-6 h-6 icon-dark-filter transition-all duration-200"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-main dark:text-white">{module.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
          </div>

          {/* Expand/Collapse button */}
          {hasNested && (
            <button
              type="button"
              onClick={() => toggleExpanded(module.key)}
              className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-primary transition-colors"
            >
              <img
                src="/icons/arrow-down.svg"
                alt=""
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* Nested modules */}
        {hasNested && expanded && (
          <div className="mt-2 ml-8 relative">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="space-y-2">
              {module.nested.map((nested: any, _index: number) => (
                <div key={nested.key} className="relative">
                  {/* Horizontal line */}
                  <div className="absolute left-3 top-4 w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-gray-200 dark:border-dark-border rounded-lg transition-all ml-8">
                    <label className="flex items-center select-none cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isModuleEnabled(nested.key)}
                        onChange={() => handleNestedModuleToggle(module.key, nested.key)}
                        className="peer sr-only"
                      />
                      <span className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${
                        isModuleEnabled(nested.key) 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300 dark:border-dark-border bg-white dark:bg-primary-dark hover:border-primary'
                      }`}>
                        {isModuleEnabled(nested.key) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </label>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-main dark:text-white">{nested.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{nested.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        <div className="dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">Modules</h3>
              </div>
              <span className="text-xs px-4 py-1 rounded-full bg-primary-lightest">
                All Modules
              </span>
            </div>
            {/* Select All/None buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllModules}
                className="text-xs px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAllModules}
                className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleConfig.map(renderModuleItem)}
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