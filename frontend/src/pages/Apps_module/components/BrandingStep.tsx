import React, { useState, useRef } from 'react';
import FormInput from '../../../components/forms/FormInput';
import Dropdown from '../../../components/global/Dropdown';
import Button from '../../../components/global/Button';
import type { FormInputValue } from '../../../components/forms/types';

interface BrandingStepProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
  onNext: (e: React.FormEvent<HTMLFormElement>) => void;
}

const BrandingStep: React.FC<BrandingStepProps> = ({ formData, errors, onInputChange, onNext }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFormInputChange = (name: string, value: FormInputValue) => {
    onInputChange({ target: { name, value } } as any);
  };

  const handleFormInputBlur = () => {
    // Handle blur if needed
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onInputChange(e);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFaviconPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onInputChange(e);
    }
  };

  const colorOptions = [
    { value: '#0066cc', label: 'Blue', color: '#0066cc' },
    { value: '#28a745', label: 'Green', color: '#28a745' },
    { value: '#dc3545', label: 'Red', color: '#dc3545' },
    { value: '#ffc107', label: 'Yellow', color: '#ffc107' },
    { value: '#6f42c1', label: 'Purple', color: '#6f42c1' },
    { value: '#fd7e14', label: 'Orange', color: '#fd7e14' },
    { value: '#20c997', label: 'Teal', color: '#20c997' },
    { value: '#6c757d', label: 'Gray', color: '#6c757d' },
  ];

  const timezoneOptions = [
    { value: '', label: 'Select timezone' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Shanghai', label: 'China (CST)' },
    { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  ];

  const currencyOptions = [
    { value: '', label: 'Select currency' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
  ];

  return (
    <div className="bg-white dark:bg-primary-dark  ">
      <h2 className="font-bold dark:text-white mb-1">Branding & Customization</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Customize your application's appearance and branding elements</p>
      
      <form className="space-y-6" onSubmit={onNext} action="#" method="post" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            input={{
              name: 'companyName',
              type: 'text',
              placeholder: 'Enter company name',
              required: true
            }}
            value={formData.companyName}
            error={errors.companyName}
            showError={!!errors.companyName}
            disabled={false}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'companyWebsite',
              type: 'url',
              // label: 'Company Website',
              placeholder: 'https://example.com'
            }}
            value={formData.companyWebsite}
            error={undefined}
            showError={false}
            disabled={false}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* <label htmlFor="appLogo" className="block text-sm font-medium text-main dark:text-white mb-1">
              App Logo
            </label> */}
            <input
              type="file"
              id="appLogo"
              name="appLogo"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
            />
            {logoPreview && (
              <div className="mt-2">
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="max-w-[200px] max-h-[100px] border border-gray-300 dark:border-dark-border rounded-lg object-contain bg-gray-50 dark:bg-primary-dark-light p-2"
                />
              </div>
            )}
            {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended size: 200x100px, PNG or JPG format
            </p> */}
          </div>
          <div>
            {/* <label htmlFor="appFavicon" className="block text-sm font-medium text-main dark:text-white mb-1">
              Favicon
            </label> */}
            <input
              type="file"
              id="appFavicon"
              name="appFavicon"
              accept="image/*"
              onChange={handleFaviconChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
            />
            {faviconPreview && (
              <div className="mt-2">
                <img 
                  src={faviconPreview} 
                  alt="Favicon preview" 
                  className="w-8 h-8 border border-gray-300 dark:border-dark-border rounded object-contain bg-gray-50 dark:bg-primary-dark-light p-1"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended size: 32x32px, ICO or PNG format
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-main dark:text-white mb-1">
            Primary Color <span className="text-error">*</span>
          </label>
          <div className="flex gap-3 flex-wrap mt-2 p-4 bg-gray-50 dark:bg-primary-dark-light rounded-lg border border-gray-200 dark:border-dark-border">
            {colorOptions.map((option) => (
              <label 
                key={option.value}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-primary-dark transition-colors"
              >
                <input
                  type="radio"
                  name="primaryColor"
                  value={option.value}
                  checked={formData.primaryColor === option.value}
                  onChange={onInputChange}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-10 rounded-full border-3 transition-all ${
                    formData.primaryColor === option.value 
                      ? 'border-main dark:border-white ring-2 ring-primary' 
                      : 'border-gray-300 dark:border-dark-border'
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.label}
                />
              </label>
            ))}
          </div>
          {errors.primaryColor && <span className="text-error text-xs mt-1 block">{errors.primaryColor}</span>}
        </div>

        <div>
          {/* <label htmlFor="appDescription" className="block text-sm font-medium text-main dark:text-white mb-1">
            App Description
          </label> */}
          <textarea
            id="appDescription"
            name="appDescription"
            value={formData.appDescription}
            onChange={onInputChange}
            placeholder="Describe your application..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-primary-dark text-main dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">
          This description will appear in app listings and documentation
        </p> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            input={{
              name: 'contactEmail',
              type: 'email',
              // label: 'Contact Email',
              placeholder: 'contact@company.com'
            }}
            value={formData.contactEmail}
            error={undefined}
            showError={false}
            disabled={false}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
          <FormInput
            input={{
              name: 'contactPhone',
              type: 'tel',
              // label: 'Contact Phone',
              placeholder: '+1-234-567-8900'
            }}
            value={formData.contactPhone}
            error={undefined}
            showError={false}
            disabled={false}
            onInputChange={handleFormInputChange}
            onInputBlur={handleFormInputBlur}
            fileInputRefs={fileInputRefs}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* <label htmlFor="timezone" className="block text-sm font-medium text-main dark:text-white mb-1">
              Timezone <span className="text-error">*</span>
            </label> */}
            <Dropdown
              name="timezone"
              value={formData.timezone}
              onChange={onInputChange}
              options={timezoneOptions}
              placeholder="Select timezone"
              required
              error={errors.timezone}
            />
          </div>
          <div>
            {/* <label htmlFor="currency" className="block text-sm font-medium text-main dark:text-white mb-1">
              Currency <span className="text-error">*</span>
            </label> */}
            <Dropdown
              name="currency"
              value={formData.currency}
              onChange={onInputChange}
              options={currencyOptions}
              placeholder="Select currency"
              required
              error={errors.currency}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-primary-dark-light rounded-lg border border-gray-200 dark:border-dark-border">
            <input
              type="checkbox"
              name="enableDarkMode"
              checked={formData.enableDarkMode}
              onChange={onInputChange}
              className="w-5 h-5 accent-primary border-gray-300 dark:border-dark-border mt-0.5"
            />
            <div>
              <label className="text-sm font-medium text-main dark:text-white">Enable Dark Mode</label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Users can switch between light and dark themes
              </p>
            </div>
          </div>
         
        </div>

        <div className="flex justify-end">
          <Button label="Next" type="submit" variant="primary" />
        </div>
      </form>
    </div>
  );
};

export default BrandingStep; 