import React from 'react';
import Button from '@components/global/Button';

interface FinalizeAndDeployProps {
  formData: any;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onInputChange?: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
  currentStep?: number;
  onBack?: () => void;
}

const FinalizeAndDeploy: React.FC<FinalizeAndDeployProps> = ({ formData, onEditStep, onSubmit, isSubmitting = false, onInputChange, currentStep = 1 }) => {
  return (
    <div className=" bg-white dark:bg-primary-dark rounded-xl shadow p-6 md:p-8">
      <h2 className="text-2xl font-bold text-main dark:text-white mb-1">Terms & Conditions</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Please review and accept the terms before completing your app configuration</p>
      <div className="space-y-6">
        {/* App Basics & Admin Access in 2 columns */}
        <div className=" dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* App Basics Column */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-4 w-full">
                  <h3 className="text-sm font-semibold text-primary">App Basics</h3>
                  <div className="space-y-2">
                    <div  className='flex flex-row justify-between w-full'>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Categories:</span> {(formData.categories || []).length > 0 ? formData.categories.join(', ') : 'Not specified'}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Subdomain:</span> {formData.subdomain || 'Not specified'}</p>
                    </div>


                    <div className='flex flex-row justify-between w-full'>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> {formData.appName || 'Not specified'}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> {formData.city && formData.state && formData.country ? `${formData.city}, ${formData.state}, ${formData.country}` : 'Not specified'}</p>
                    </div>
                    
                  
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Tariff Plans:</span> {(formData.tariffPlans || []).length > 0 ? formData.tariffPlans.join(', ') : 'Not specified'}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => onEditStep(0)} 
                  className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Edit Basics"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Admin Access Column */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-4 w-full">
                  <h3 className="text-sm font-semibold text-primary">Admin Access</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> {formData.adminFirstName && formData.adminLastName ? `${formData.adminFirstName} ${formData.adminLastName}` : 'Not specified'}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Email:</span> {formData.adminEmail || 'Not specified'}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span> {formData.adminPhone || 'Not specified'}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">Role:</span> {formData.adminRole || 'Not specified'}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => onEditStep(1)} 
                  className=" p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Edit Admin"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Review */}
        <div className=" dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-primary">Branding</h3>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Company:</span> {formData.companyName || 'Not specified'}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Website:</span> {formData.companyWebsite || 'Not specified'}</p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Primary Color:</span> 
                  {formData.primaryColor ? (
                    <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      {formData.primaryColor}
                    </span>
                  ) : 'Not specified'}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Secondary Color:</span> 
                  {formData.secondaryColor ? (
                    <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      {formData.secondaryColor}
                    </span>
                  ) : 'Not specified'}
                </p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Timezone:</span> {formData.timezone || 'Not specified'}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Currency:</span> {formData.currency || 'Not specified'}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => onEditStep(2)} 
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Edit Branding"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modules Review */}
        <div className="dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-sm font-semibold text-primary">Modules</h3>
              <p>{(formData.modules || []).length > 0 ? formData.modules.join(', ') : 'No modules selected'}</p>
            </div>


            <button 
              type="button" 
              onClick={() => onEditStep(3)} 
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Edit Modules"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>

                {/* Terms & Conditions */}
                <div className="dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-primary">Terms & Conditions</h3>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-main dark:text-white">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={onInputChange}
                className="w-4 h-4 accent-primary border-gray-300 dark:border-dark-border"
              />
              I accept the Terms & Conditions and Privacy Policy <span className="text-error">*</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">By checking this box, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>



        {/* Complete Configuration Button */}
        <div className="flex justify-between items-center pt-6">
          {currentStep > 1 && (
            <Button
              label="Previous"
              variant="secondary"
            />
          )}
          <div className="ml-auto">
            <Button
              label={isSubmitting ? 'Completing...' : 'Complete Configuration'}
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalizeAndDeploy; 