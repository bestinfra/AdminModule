import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STEP_COUNT } from '../constants';
import { combineFormData, submitAppCreation, isValidStep } from '../utils';
import type { StepData, HeaderConfig } from '../types';

export const useStepNavigation = (
  stepData: StepData,
  resetAllData: () => void
) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step navigation
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEP_COUNT));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleEditStep = (stepIndex: number) => {
    const step = stepIndex + 1; // Convert 0-based to 1-based
    if (isValidStep(step)) {
      setCurrentStep(step);
    }
  };

  // Step submit handlers
  const handleAppBasicsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation is handled in the component itself
    // The component will only call this if validation passes
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

  // Final submit handler
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const allFormData = combineFormData(stepData);
      await submitAppCreation(allFormData);
      // Optional: Reset form or redirect after successful submission
      // resetAllData();
      // setCurrentStep(1);
    } catch (error) {
      console.error('Error creating app:', error);
      alert(`Error creating app: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Get header configuration based on current step
  const getHeaderConfig = (): HeaderConfig => {
    const stepLabels = [
      { label: 'Application Setup', sub: 'Define your settings and preferences' },
      { label: 'Access Control', sub: 'Establish admin roles and secure access' },
      { label: 'Brand Personalization', sub: 'Apply your identity and visual themes' },
      { label: 'Feature Selection', sub: 'Choose modules to your operations' },
      { label: 'Finalize & Deploy', sub: 'Review configuration and go live confidently' },
    ];

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
              resetAllData();
            }
            break;
        }
      },
      onBackClick: () => navigate('/'),
      backButtonText: 'Dashboard',
    };
  };

  return {
    currentStep,
    loading,
    handleNext,
    handleBack,
    handleEditStep,
    handleAppBasicsSubmit,
    handleAdminSubmit,
    handleBrandingSubmit,
    handleModuleSubmit,
    handleFinalSubmit,
    getHeaderConfig,
  };
}; 