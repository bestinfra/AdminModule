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

const FinalizeAndDeploy: React.FC<FinalizeAndDeployProps> = ({ formData, onEditStep, onSubmit, isSubmitting = false, onInputChange, currentStep = 1, onBack }) => {
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
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Contact Email:</span> {formData.contactEmail || 'Not specified'}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Contact Phone:</span> {formData.contactPhone || 'Not specified'}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">App Description:</span> {formData.appDescription || 'Not specified'}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Timezone:</span> {formData.timezone || 'Not specified'}</p>
                <p><span className="font-medium text-gray-700 dark:text-gray-300">Currency:</span> {formData.currency || 'Not specified'}</p>
                
                {/* Custom Colors Section */}
                <div className="mt-4">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Colors:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Main Page Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Main Page Background:</span> 
                      {formData.colorPrimaryBg ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorPrimaryBg }}
                          />
                          {formData.colorPrimaryBg}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Card/Panel Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Card/Panel Background:</span> 
                      {formData.colorPrimaryBgLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorPrimaryBgLight }}
                          />
                          {formData.colorPrimaryBgLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Section Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Section Background:</span> 
                      {formData.colorPrimaryLightest ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorPrimaryLightest }}
                          />
                          {formData.colorPrimaryLightest}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Success Button Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Success Button Background:</span> 
                      {formData.colorSecondary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorSecondary }}
                          />
                          {formData.colorSecondary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Success Button Hover */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Success Button Hover:</span> 
                      {formData.colorSecondaryLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorSecondaryLight }}
                          />
                          {formData.colorSecondaryLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Success State Highlight */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Success State Highlight:</span> 
                      {formData.colorSecondaryPositive ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorSecondaryPositive }}
                          />
                          {formData.colorSecondaryPositive}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Success State Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Success State Background:</span> 
                      {formData.colorSecondaryPositiveLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorSecondaryPositiveLight }}
                          />
                          {formData.colorSecondaryPositiveLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Main Text Color */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Main Text Color:</span> 
                      {formData.colorTextPrimary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorTextPrimary }}
                          />
                          {formData.colorTextPrimary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Description Text Color */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Description Text Color:</span> 
                      {formData.colorTextSecondary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorTextSecondary }}
                          />
                          {formData.colorTextSecondary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Card/Section Border */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Card/Section Border:</span> 
                      {formData.colorPrimaryBorder ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorPrimaryBorder }}
                          />
                          {formData.colorPrimaryBorder}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Warning/Alert Icon */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Warning/Alert Icon:</span> 
                      {formData.colorWarning ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorWarning }}
                          />
                          {formData.colorWarning}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Warning/Alert Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Warning/Alert Background:</span> 
                      {formData.colorWarningAlt ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorWarningAlt }}
                          />
                          {formData.colorWarningAlt}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Warning/Alert Highlight */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Warning/Alert Highlight:</span> 
                      {formData.colorWarningLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorWarningLight }}
                          />
                          {formData.colorWarningLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Error/Remove Button */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Error/Remove Button:</span> 
                      {formData.colorDanger ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorDanger }}
                          />
                          {formData.colorDanger}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Error/Remove Hover */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Error/Remove Hover:</span> 
                      {formData.colorDangerAlt ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorDangerAlt }}
                          />
                          {formData.colorDangerAlt}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Error/Remove Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Error/Remove Background:</span> 
                      {formData.colorDangerLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorDangerLight }}
                          />
                          {formData.colorDangerLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Info/Notification Icon */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Info/Notification Icon:</span> 
                      {formData.colorInfo ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorInfo }}
                          />
                          {formData.colorInfo}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Neutral Text */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Neutral Text:</span> 
                      {formData.colorNeutralDark ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorNeutralDark }}
                          />
                          {formData.colorNeutralDark}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Neutral Subtext */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Neutral Subtext:</span> 
                      {formData.colorNeutralDarker ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorNeutralDarker }}
                          />
                          {formData.colorNeutralDarker}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Page/Panel Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Page/Panel Background:</span> 
                      {formData.colorNeutralLightest ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorNeutralLightest }}
                          />
                          {formData.colorNeutralLightest}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Highlight/Selection Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Highlight/Selection Background:</span> 
                      {formData.colorAccentLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorAccentLight }}
                          />
                          {formData.colorAccentLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Card Shadow */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Card Shadow:</span> 
                      {formData.colorShadowPrimary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorShadowPrimary }}
                          />
                          {formData.colorShadowPrimary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Panel Shadow */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Panel Shadow:</span> 
                      {formData.colorShadowSecondary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorShadowSecondary }}
                          />
                          {formData.colorShadowSecondary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Main Background (Dark Mode) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Main Background (Dark Mode):</span> 
                      {formData.colorPrimaryDark ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorPrimaryDark }}
                          />
                          {formData.colorPrimaryDark}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Card/Panel Background (Dark) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Card/Panel Background (Dark):</span> 
                      {formData.colorPrimaryDarkLight ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorPrimaryDarkLight }}
                          />
                          {formData.colorPrimaryDarkLight}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Main Text (Dark) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Main Text (Dark):</span> 
                      {formData.colorDarkPrimary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorDarkPrimary }}
                          />
                          {formData.colorDarkPrimary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Subtext (Dark) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Subtext (Dark):</span> 
                      {formData.colorDarkSecondary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorDarkSecondary }}
                          />
                          {formData.colorDarkSecondary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Border (Dark Mode) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Border (Dark Mode):</span> 
                      {formData.colorDarkBorder ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ backgroundColor: formData.colorDarkBorder }}
                          />
                          {formData.colorDarkBorder}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Main Gradient Background */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Main Gradient Background:</span> 
                      {formData.colorPrimaryGradient ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ background: formData.colorPrimaryGradient }}
                          />
                          {formData.colorPrimaryGradient}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Main Gradient (Dark) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Main Gradient (Dark):</span> 
                      {formData.colorPrimaryDarkGradient ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ background: formData.colorPrimaryDarkGradient }}
                          />
                          {formData.colorPrimaryDarkGradient}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Panel Gradient (Dark) */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Panel Gradient (Dark):</span> 
                      {formData.colorGradientSecondary ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ background: formData.colorGradientSecondary }}
                          />
                          {formData.colorGradientSecondary}
                        </span>
                      ) : 'Not specified'}
                    </p>
                    {/* Statistics Icon Gradient */}
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Statistics Icon Gradient:</span> 
                      {formData.colorStatIconGradient ? (
                        <span className="inline-flex items-center gap-2 ml-2 px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-sm font-mono">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 dark:border-dark-border" 
                            style={{ background: formData.colorStatIconGradient }}
                          />
                          {formData.colorStatIconGradient}
                        </span>
                      ) : 'Not specified'}
                    </p>
                  </div>
                </div>
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
              onClick={onBack}
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