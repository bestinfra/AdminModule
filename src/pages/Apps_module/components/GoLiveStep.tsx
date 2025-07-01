import React from 'react';
import Button from '../../../components/global/Button';

interface GoLiveStepProps {
  formData: any;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const GoLiveStep: React.FC<GoLiveStepProps> = ({ formData, onEditStep, onSubmit, isSubmitting = false }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-primary-dark rounded-xl shadow p-6 md:p-8">
      <h2 className="text-2xl font-bold text-main dark:text-white mb-1">Generate React Project</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Review your app details and generate a downloadable React project</p>
      
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

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">What will be generated?</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                A complete React project with TypeScript, Vite, Tailwind CSS, and React Router. 
                The project will include your app configuration, admin details, and selected modules.
                You can run it immediately with <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npm install && npm run dev</code>
              </p>
            </div>
          </div>
        </div>

        {/* Generate Project Button */}
        <div className="flex justify-center pt-6">
          <Button
            label={isSubmitting ? 'Generating Project...' : 'Generate React Project'}
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