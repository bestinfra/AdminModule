import { useState } from 'react';
import {
  INITIAL_APP_BASICS_DATA,
  INITIAL_ADMIN_ACCESS_DATA,
  INITIAL_BRANDING_DATA,
  INITIAL_MODULE_DATA,
} from '../constants';
import type {
  AppBasicsData,
  AppBasicsErrors,
  AccessControlData,
  AccessControlErrors,
  BrandingData,
  BrandingErrors,
  ModuleData,
  ModuleErrors,
  StepData,
  StepErrors,
} from '../types';
import { clearFieldError } from '../utils';

export const useStepState = () => {
  // State for each step
  const [appBasicsData, setAppBasicsData] = useState<AppBasicsData>(INITIAL_APP_BASICS_DATA);
  const [appBasicsErrors, setAppBasicsErrors] = useState<AppBasicsErrors>({});
  
  const [adminAccessData, setAdminAccessData] = useState<AccessControlData>(INITIAL_ADMIN_ACCESS_DATA);
  const [adminAccessErrors, setAdminAccessErrors] = useState<AccessControlErrors>({});
  
  const [brandingData, setBrandingData] = useState<BrandingData>(INITIAL_BRANDING_DATA);
  const [brandingErrors, setBrandingErrors] = useState<BrandingErrors>({});
  
  const [moduleData, setModuleData] = useState<ModuleData>(INITIAL_MODULE_DATA);
  const [moduleErrors, setModuleErrors] = useState<ModuleErrors>({});

  // Combined data getter
  const getAllStepData = (): StepData => ({
    appBasics: appBasicsData,
    adminAccess: adminAccessData,
    branding: brandingData,
    modules: moduleData,
  });

  // Combined errors getter
  const getAllStepErrors = (): StepErrors => ({
    appBasics: appBasicsErrors,
    adminAccess: adminAccessErrors,
    branding: brandingErrors,
    modules: moduleErrors,
  });

  // App Basics handlers
  const handleAppBasicsInputChange = (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => {
    const { name, value, type, checked } = 'target' in e ? e.target : { name: '', value: '', type: '', checked: false };
    let newValue = value;
    if (type === 'checkbox') newValue = checked;
    
    setAppBasicsData((prev) => ({ ...prev, [name]: newValue }));
    clearFieldError(appBasicsErrors, name as keyof AppBasicsData, setAppBasicsErrors);
  };

  const handleAppBasicsArrayChange = (name: string, value: any) => {
    setAppBasicsData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(appBasicsErrors, name as keyof AppBasicsData, setAppBasicsErrors);
  };

  // Admin Access handlers
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

  // Branding handlers
  const handleBrandingInputChange = (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => {
    const { name, value, type, checked } = 'target' in e ? e.target : { name: '', value: '', type: '', checked: false };
    let newValue = value;
    if (type === 'checkbox') newValue = checked;
    
    console.log('useStepState - Branding Input Change:', { 
      name, 
      value: newValue, 
      type: typeof newValue,
      previousData: brandingData[name as keyof BrandingData]
    });
    
    setBrandingData((prev) => {
      const updatedData = { ...prev, [name]: newValue };
      console.log(' useStepState - Updated Branding Data:', updatedData);
      return updatedData;
    });
    clearFieldError(brandingErrors, name as keyof BrandingData, setBrandingErrors);
  };

  // Module handlers
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
    clearFieldError(moduleErrors, 'modules', setModuleErrors);
  };

  // Reset all data
  const resetAllData = () => {
    setAppBasicsData(INITIAL_APP_BASICS_DATA);
    setAppBasicsErrors({});
    setAdminAccessData(INITIAL_ADMIN_ACCESS_DATA);
    setAdminAccessErrors({});
    setBrandingData(INITIAL_BRANDING_DATA);
    setBrandingErrors({});
    setModuleData(INITIAL_MODULE_DATA);
    setModuleErrors({});
  };

  return {
    // Data
    appBasicsData,
    adminAccessData,
    brandingData,
    moduleData,
    
    // Errors
    appBasicsErrors,
    adminAccessErrors,
    brandingErrors,
    moduleErrors,
    
    // Handlers
    handleAppBasicsInputChange,
    handleAppBasicsArrayChange,
    handleAdminInputChange,
    handleAdminDropdownChange,
    handleBrandingInputChange,
    handleModuleToggle,
    
    // Utilities
    getAllStepData,
    getAllStepErrors,
    resetAllData,
  };
}; 