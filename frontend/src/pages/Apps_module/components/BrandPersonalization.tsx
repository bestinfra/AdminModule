import React, { useState, useRef, useMemo } from "react";
import FormInput from "@components/forms/FormInput";
import Dropdown from "@components/global/Dropdown";
import Button from "@components/global/Button";
import TimeRangeSelector from "@components/global/TimeRangeSelector";
import type { FormInputValue } from "@components/forms/types";
import { validateBrandPersonalization } from "../utils";
import RemarksPanel from "./RemarksPanel";

interface BrandPersonalizationProps {
  formData: any;
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<any> | { target: { name: string; value: any } }
  ) => void;
  onNext: (e: React.FormEvent<HTMLFormElement>) => void;
  currentStep?: number;
  onBack?: () => void;
}

const BrandPersonalization: React.FC<BrandPersonalizationProps> = ({
  formData,
  errors,
  onInputChange,
  onNext,
  currentStep = 1,
  onBack,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLogoDragOver, setIsLogoDragOver] = useState(false);
  const [isFaviconDragOver, setIsFaviconDragOver] = useState(false);
  const [colorMode, setColorMode] = useState("brand");
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFormInputChange = (name: string, value: FormInputValue) => {
    onInputChange({ target: { name, value } } as any);
    if (hasSubmitted) setHasSubmitted(false);
  };

  const handleFormInputBlur = () => {
    // Handle blur if needed
  };

  // Validate form data and generate remarks
  const {
    isValid,
    errors: validationErrors,
    remarks,
  } = useMemo(() => {
    return validateBrandPersonalization(formData);
  }, [formData]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  const handleFileUpload = (file: File, type: 'logo' | 'favicon') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setLogoPreview(e.target?.result as string);
      } else {
        setFaviconPreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Create a synthetic event for the form handler
    const syntheticEvent = {
      target: {
        name: type === 'logo' ? 'appLogo' : 'appFavicon',
        files: [file]
      }
    } as any;
    onInputChange(syntheticEvent);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'logo');
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'favicon');
    }
  };

  const handleDragOver = (e: React.DragEvent, type: 'logo' | 'favicon') => {
    e.preventDefault();
    if (type === 'logo') {
      setIsLogoDragOver(true);
    } else {
      setIsFaviconDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, type: 'logo' | 'favicon') => {
    e.preventDefault();
    if (type === 'logo') {
      setIsLogoDragOver(false);
    } else {
      setIsFaviconDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'favicon') => {
    e.preventDefault();
    if (type === 'logo') {
      setIsLogoDragOver(false);
    } else {
      setIsFaviconDragOver(false);
    }
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile, type);
    }
  };

  const colorOptions = [
    { value: "#0066cc", label: "Blue", color: "#0066cc" },
    { value: "#28a745", label: "Green", color: "#28a745" },
    { value: "#dc3545", label: "Red", color: "#dc3545" },
    { value: "#ffc107", label: "Yellow", color: "#ffc107" },
    { value: "#6f42c1", label: "Purple", color: "#6f42c1" },
    { value: "#fd7e14", label: "Orange", color: "#fd7e14" },
    { value: "#20c997", label: "Teal", color: "#20c997" },
    { value: "#6c757d", label: "Gray", color: "#6c757d" },
  ];

  const timezoneOptions = [
    { value: "", label: "Select timezone" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Shanghai", label: "China (CST)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
  ];

  const currencyOptions = [
    { value: "", label: "Select currency" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "AED", label: "AED - UAE Dirham" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
  ];

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-xl border border-primary-border p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 p-4 flex flex-col gap-4">
          <div className="">
            <h2 className="text-base font-semibold text-primary">
              Branding & Customization
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Customize your application's appearance and branding elements
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setHasSubmitted(true);

              // Only proceed if validation passes
              if (isValid) {
                onNext(e);
              }
            }}
            action="#"
            method="post"
            noValidate
          >
            {/* Company Information Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-primary">Company Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  input={{
                    name: "companyName",
                    type: "text",
                    label: "Company Name",
                    placeholder: "Enter company name",
                    required: true,
                  }}
                  value={formData.companyName}
                  error={allErrors.companyName}
                  showError={!!allErrors.companyName}
                  disabled={false}
                  onInputChange={handleFormInputChange}
                  onInputBlur={handleFormInputBlur}
                  fileInputRefs={fileInputRefs}
                />
                <FormInput
                  input={{
                    name: "companyWebsite",
                    type: "url",
                    label: "Company Website",
                    placeholder: "https://example.com",
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
            </div>

            {/* Branding Assets Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-primary">Branding Assets</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl">
                <div className="div1 flex justify-between w-full gap-4">
                  <div className="div2 w-full flex flex-col gap-4">
                    <label
                      htmlFor="appLogo"
                      className="block text-sm font-medium text-main dark:text-white "
                    >
                      Dark Mode
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          isLogoDragOver
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 dark:border-dark-border hover:border-primary"
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo')}
                      >
                        <input
                          type="file"
                          id="appLogo"
                          name="appLogo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/icons/cloud-upload-alt.svg"
                            alt="Upload"
                            className="w-8 h-8 filter dark:invert opacity-60"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag & drop logo here or{" "}
                            <label
                              htmlFor="appLogo"
                              className="text-primary cursor-pointer hover:underline"
                            >
                              browse
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, SVG up to 5MB
                          </p>
                        </div>
                      </div>
                      {logoPreview && (
                        <div className="mt-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-w-[200px] max-h-[100px] border border-gray-300 dark:border-dark-border rounded-lg object-contain bg-gray-50 dark:bg-primary-dark-light p-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          isLogoDragOver
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 dark:border-dark-border hover:border-primary"
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo')}
                      >
                        <input
                          type="file"
                          id="appLogo2"
                          name="appLogo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/icons/cloud-upload-alt.svg"
                            alt="Upload"
                            className="w-8 h-8 filter dark:invert opacity-60"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag & drop logo here or{" "}
                            <label
                              htmlFor="appLogo2"
                              className="text-primary cursor-pointer hover:underline"
                            >
                              browse
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, SVG up to 5MB
                          </p>
                        </div>
                      </div>
                      {logoPreview && (
                        <div className="mt-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-w-[200px] max-h-[100px] border border-gray-300 dark:border-dark-border rounded-lg object-contain bg-gray-50 dark:bg-primary-dark-light p-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="div2 w-full flex flex-col gap-4">
                    <label
                      htmlFor="appLogo3"
                      className="block text-sm font-medium text-main dark:text-white "
                    >
                      Light Mode
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          isLogoDragOver
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 dark:border-dark-border hover:border-primary"
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo')}
                      >
                        <input
                          type="file"
                          id="appLogo3"
                          name="appLogo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/icons/cloud-upload-alt.svg"
                            alt="Upload"
                            className="w-8 h-8 filter dark:invert opacity-60"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag & drop logo here or{" "}
                            <label
                              htmlFor="appLogo3"
                              className="text-primary cursor-pointer hover:underline"
                            >
                              browse
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, SVG up to 5MB
                          </p>
                        </div>
                      </div>
                      {logoPreview && (
                        <div className="mt-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-w-[200px] max-h-[100px] border border-gray-300 dark:border-dark-border rounded-lg object-contain bg-gray-50 dark:bg-primary-dark-light p-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          isLogoDragOver
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 dark:border-dark-border hover:border-primary"
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo')}
                      >
                        <input
                          type="file"
                          id="appLogo4"
                          name="appLogo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/icons/cloud-upload-alt.svg"
                            alt="Upload"
                            className="w-8 h-8 filter dark:invert opacity-60"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag & drop logo here or{" "}
                            <label
                              htmlFor="appLogo4"
                              className="text-primary cursor-pointer hover:underline"
                            >
                              browse
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG,  SVG up to 5MB
                          </p>
                        </div>
                      </div>
                      {logoPreview && (
                        <div className="mt-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-w-[200px] max-h-[100px] border border-gray-300 dark:border-dark-border rounded-lg object-contain bg-gray-50 dark:bg-primary-dark-light p-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Favicon Section */}
                <div className="div1 flex justify-between w-full gap-4 ">
                  <div className="div2 w-full flex flex-col gap-4">
                    <label
                      htmlFor="appFavicon"
                      className="block text-sm font-medium text-main dark:text-white "
                    >
                      Favicon
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                          isFaviconDragOver
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 dark:border-dark-border hover:border-primary"
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'favicon')}
                        onDragLeave={(e) => handleDragLeave(e, 'favicon')}
                        onDrop={(e) => handleDrop(e, 'favicon')}
                      >
                        <input
                          type="file"
                          id="appFavicon"
                          name="appFavicon"
                          accept="image/*"
                          onChange={handleFaviconChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src="/icons/cloud-upload-alt.svg"
                            alt="Upload"
                            className="w-6 h-6 filter dark:invert opacity-60"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag & drop favicon here or{" "}
                            <label
                              htmlFor="appFavicon"
                              className="text-primary cursor-pointer hover:underline"
                            >
                              browse
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ICO, PNG up to 1MB
                          </p>
                        </div>
                      </div>
                      {faviconPreview && (
                        <div className="mt-2">
                          <img
                            src={faviconPreview}
                            alt="Favicon preview"
                            className="w-8 h-8 border border-gray-300 dark:border-dark-border rounded object-contain bg-gray-50 dark:bg-primary-dark-light p-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Color Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Branding Colors</h3>
                <div className="flex items-center justify-between mt-2">
                  <TimeRangeSelector
                    availableTimeRanges={["brand", "custom"]}
                    selectedTimeRange={colorMode}
                    handleTimeRangeChange={setColorMode}
                    timeRangeLabels={{
                      brand: "Brand Colors",
                      custom: "Custom Colors"
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-main dark:text-white mb-2">
                  Primary Color <span className="text-error">*</span>
                </label>
                
                {colorMode === "brand" ? (
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
                              ? "border-main dark:border-white ring-2 ring-primary"
                              : "border-gray-300 dark:border-dark-border"
                          }`}
                          style={{ backgroundColor: option.color }}
                          title={option.label}
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-primary-dark-light rounded-lg border border-gray-200 dark:border-dark-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            name="customPrimaryColor"
                            value={formData.customPrimaryColor || "#163b7c"}
                            onChange={onInputChange}
                            className="w-12 h-10 rounded border border-gray-300 dark:border-dark-border cursor-pointer"
                          />
                          <input
                            type="text"
                            name="customPrimaryColor"
                            value={formData.customPrimaryColor || "#163b7c"}
                            onChange={onInputChange}
                            placeholder="#163b7c"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-primary-dark text-main dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            name="customSecondaryColor"
                            value={formData.customSecondaryColor || "#55b56c"}
                            onChange={onInputChange}
                            className="w-12 h-10 rounded border border-gray-300 dark:border-dark-border cursor-pointer"
                          />
                          <input
                            type="text"
                            name="customSecondaryColor"
                            value={formData.customSecondaryColor || "#55b56c"}
                            onChange={onInputChange}
                            placeholder="#55b56c"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-primary-dark text-main dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Warning Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            name="customWarningColor"
                            value={formData.customWarningColor || "#ed8c22"}
                            onChange={onInputChange}
                            className="w-12 h-10 rounded border border-gray-300 dark:border-dark-border cursor-pointer"
                          />
                          <input
                            type="text"
                            name="customWarningColor"
                            value={formData.customWarningColor || "#ed8c22"}
                            onChange={onInputChange}
                            placeholder="#ed8c22"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-primary-dark text-main dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Danger Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            name="customDangerColor"
                            value={formData.customDangerColor || "#dc272c"}
                            onChange={onInputChange}
                            className="w-12 h-10 rounded border border-gray-300 dark:border-dark-border cursor-pointer"
                          />
                          <input
                            type="text"
                            name="customDangerColor"
                            value={formData.customDangerColor || "#dc272c"}
                            onChange={onInputChange}
                            placeholder="#dc272c"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-primary-dark text-main dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            name="customAccentColor"
                            value={formData.customAccentColor || "#00d1b2"}
                            onChange={onInputChange}
                            className="w-12 h-10 rounded border border-gray-300 dark:border-dark-border cursor-pointer"
                          />
                          <input
                            type="text"
                            name="customAccentColor"
                            value={formData.customAccentColor || "#00d1b2"}
                            onChange={onInputChange}
                            placeholder="#00d1b2"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-primary-dark text-main dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Neutral Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            name="customNeutralColor"
                            value={formData.customNeutralColor || "#7e7e7e"}
                            onChange={onInputChange}
                            className="w-12 h-10 rounded border border-gray-300 dark:border-dark-border cursor-pointer"
                          />
                          <input
                            type="text"
                            name="customNeutralColor"
                            value={formData.customNeutralColor || "#7e7e7e"}
                            onChange={onInputChange}
                            placeholder="#7e7e7e"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-primary-dark text-main dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {allErrors.primaryColor && (
                  <span className="text-error text-xs mt-1 block">
                    {allErrors.primaryColor}
                  </span>
                )}
              </div>
            </div>

            {/* App Description Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-primary">App Description</h3>
              </div>
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

            {/* Contact Information Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-primary">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  input={{
                    name: "contactEmail",
                    type: "email",
                    label: "Contact Email",
                    placeholder: "contact@company.com",
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
                    name: "contactPhone",
                    type: "tel",
                    label: "Contact Phone",
                    placeholder: "+1-234-567-8900",
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
            </div>

            {/* Preferences Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-primary">Preferences</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Dropdown
                    name="timezone"
                    value={formData.timezone}
                    onChange={onInputChange}
                    options={timezoneOptions}
                    placeholder="Select timezone"
                    required
                    error={allErrors.timezone}
                  />
                </div>
                <div>
                  <Dropdown
                    name="currency"
                    value={formData.currency}
                    onChange={onInputChange}
                    options={currencyOptions}
                    placeholder="Select currency"
                    required
                    error={allErrors.currency}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-primary-dark-light rounded-lg border border-gray-200 dark:border-dark-border">
                  <input
                    type="checkbox"
                    name="enableDarkMode"
                    checked={formData.enableDarkMode}
                    onChange={onInputChange}
                    className="w-5 h-5 accent-primary border-gray-300 dark:border-dark-border mt-0.5"
                  />
                  <div>
                    <label className="text-sm font-medium text-main dark:text-white">
                      Enable Dark Mode
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Users can switch between light and dark themes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {currentStep > 1 && (
                <span
                  className="flex items-center gap-2 p-2 px-4 rounded-3xl border border-primary-border dark:border-dark-border bg-white dark:bg-primary-dark cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={onBack}
                >
                  <img
                    src={"/icons/arrow-back.svg"}
                    alt="arrow-left"
                    className="w-5 h-5 filter dark:invert"
                  />
                  <span className="text-neutral dark:text-gray-300 font-medium">
                    Previous
                  </span>
                </span>
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

export default BrandPersonalization;
