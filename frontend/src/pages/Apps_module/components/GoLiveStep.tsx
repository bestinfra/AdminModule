import React from 'react';
import Button from '../../../components/global/Button';

interface GoLiveStepProps {
  formData: any;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onInputChange?: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
}

const GoLiveStep: React.FC<GoLiveStepProps> = ({ formData, onEditStep, onSubmit, isSubmitting = false, onInputChange }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-primary-dark rounded-xl shadow p-6 md:p-8">
      <h2 className="text-2xl font-bold text-main dark:text-white mb-1">Terms & Conditions</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Please review and accept the terms before completing your app configuration</p>
      
      <div className="space-y-6">
        {/* App Basics Review */}
        <div className="bg-gray-50 dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-main dark:text-white mb-4">App Basics</h3>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> {formData.appName || 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Location:</span> {formData.city && formData.state && formData.country ? `${formData.city}, ${formData.state}, ${formData.country}` : 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Categories:</span> {(formData.categories || []).length > 0 ? formData.categories.join(', ') : 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Subdomain:</span> {formData.subdomain || 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Tariff Plans:</span> {(formData.tariffPlans || []).length > 0 ? formData.tariffPlans.join(', ') : 'Not specified'}</p>
          </div>
        </div>

        {/* Admin Access Review */}
        <div className="bg-gray-50 dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-main dark:text-white mb-4">Admin Access</h3>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Name:</span> {formData.adminFirstName && formData.adminLastName ? `${formData.adminFirstName} ${formData.adminLastName}` : 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Email:</span> {formData.adminEmail || 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span> {formData.adminPhone || 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Role:</span> {formData.adminRole || 'Not specified'}</p>
          </div>
        </div>

        {/* Branding Review */}
        <div className="bg-gray-50 dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-main dark:text-white mb-4">Branding</h3>
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
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Timezone:</span> {formData.timezone || 'Not specified'}</p>
            <p><span className="font-medium text-gray-700 dark:text-gray-300">Currency:</span> {formData.currency || 'Not specified'}</p>
          </div>
        </div>

        {/* Modules Review */}
        <div className="bg-gray-50 dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-main dark:text-white mb-4">Modules</h3>
          <p>{(formData.modules || []).length > 0 ? formData.modules.join(', ') : 'No modules selected'}</p>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-50 dark:bg-primary-dark-light border border-gray-200 dark:border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-main dark:text-white mb-4">Terms & Conditions</h3>
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

        {/* Edit Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            type="button" 
            onClick={() => onEditStep(0)} 
            className="px-4 py-2 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-dark-light transition-colors"
          >
            Edit Basics
          </button>
          <button 
            type="button" 
            onClick={() => onEditStep(1)} 
            className="px-4 py-2 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-dark-light transition-colors"
          >
            Edit Admin
          </button>
          <button 
            type="button" 
            onClick={() => onEditStep(2)} 
            className="px-4 py-2 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-dark-light transition-colors"
          >
            Edit Branding
          </button>
          <button 
            type="button" 
            onClick={() => onEditStep(3)} 
            className="px-4 py-2 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary-dark-light transition-colors"
          >
            Edit Modules
          </button>
        </div>



        {/* Complete Configuration Button */}
        <div className="flex justify-center pt-6">
          <Button
            label={isSubmitting ? 'Completing...' : 'Complete Configuration'}
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default GoLiveStep; 