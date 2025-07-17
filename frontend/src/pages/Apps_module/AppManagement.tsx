import React from 'react';
import Page from '@components/global/Page';
import PageHeader from '@components/global/PageHeader';
import ApplicationSetup from '@pages/Apps_module/components/ApplicationSetup';
import AccessControl from '@pages/Apps_module/components/AccessControl';
import BrandPersonalization from '@pages/Apps_module/components/BrandPersonalization';
import FeatureSelection from '@pages/Apps_module/components/FeatureSelection';
import FinalizeAndDeploy from '@pages/Apps_module/components/FinalizeAndDeploy';
import StepNavigation from '@pages/Apps_module/components/StepNavigation';
import { useStepState } from '@pages/Apps_module/hooks/useStepState';
import { useStepNavigation } from '@pages/Apps_module/hooks/useStepNavigation';

const AppManagement: React.FC = () => {
  // Custom hooks for state and navigation management
  const {
    appBasicsData,
    adminAccessData,
    brandingData,
    moduleData,
    appBasicsErrors,
    adminAccessErrors,
    brandingErrors,
    moduleErrors,
    handleAppBasicsInputChange,
    handleAppBasicsArrayChange,
    handleAdminInputChange,
    handleAdminDropdownChange,
    handleBrandingInputChange,
    handleModuleToggle,
    getAllStepData,
    resetAllData,
  } = useStepState();

  const {
    currentStep,
    loading,
    handleBack,
    handleEditStep,
    handleAppBasicsSubmit,
    handleAdminSubmit,
    handleBrandingSubmit,
    handleModuleSubmit,
    handleFinalSubmit,
    getHeaderConfig,
  } = useStepNavigation(getAllStepData(), resetAllData);

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ApplicationSetup
            formData={appBasicsData}
            errors={appBasicsErrors}
            onInputChange={handleAppBasicsInputChange}
            onArrayChange={handleAppBasicsArrayChange}
            onNext={handleAppBasicsSubmit}
            currentStep={currentStep}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <AccessControl
            formData={adminAccessData}
            errors={adminAccessErrors}
            onInputChange={handleAdminInputChange}
            onDropdownChange={handleAdminDropdownChange}
            loading={loading}
            onSubmit={handleAdminSubmit}
            currentStep={currentStep}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <BrandPersonalization
            formData={brandingData}
            errors={brandingErrors}
            onInputChange={handleBrandingInputChange}
            onNext={handleBrandingSubmit}
            currentStep={currentStep}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <FeatureSelection
            formData={moduleData}
            errors={moduleErrors}
            onModuleToggle={handleModuleToggle}
            onNext={handleModuleSubmit}
            currentStep={currentStep}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <FinalizeAndDeploy
            formData={{
              ...appBasicsData,
              ...adminAccessData,
              ...brandingData,
              ...moduleData,
            }}
            onEditStep={handleEditStep}
            onSubmit={handleFinalSubmit}
            isSubmitting={loading}
            currentStep={currentStep}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const sections = [
    {
      id: 'main',
      component: renderStepContent(),
    },
  ];

  return (
    <main className=" dark:bg-primary-dark-light flex flex-col items-center justify-start w-full">
      <div className="w-full flex flex-col gap-4">
        {/* Page Header */}
        <div className="">
          <PageHeader {...getHeaderConfig()} />
        </div>
        
        {/* Step Navigation */}
        <div className="">
          <StepNavigation currentStep={currentStep} onBack={handleBack} />
        </div>
        
        {/* Main Content */}
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