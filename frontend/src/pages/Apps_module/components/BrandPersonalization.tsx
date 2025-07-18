import React, { useState, useRef, useMemo, useEffect } from "react";
import FormInput from "@components/forms/FormInput";
import Button from "@components/global/Button";
import ColorPicker from "@pages/Apps_module/components/ColorPicker";
import type { FormInputValue } from "@components/forms/types";
import { validateBrandPersonalization } from "@pages/Apps_module/utils";
import RemarksPanel from "@pages/Apps_module/components/RemarksPanel";

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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLogoDragOver, setIsLogoDragOver] = useState(false);
  const [isFaviconDragOver, setIsFaviconDragOver] = useState(false);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Individual preview states for each upload area
  const [darkModeLogo1Preview, setDarkModeLogo1Preview] = useState<string | null>(null);
  const [darkModeLogo2Preview, setDarkModeLogo2Preview] = useState<string | null>(null);
  const [lightModeLogo1Preview, setLightModeLogo1Preview] = useState<string | null>(null);
  const [lightModeLogo2Preview, setLightModeLogo2Preview] = useState<string | null>(null);

  // Log form data changes
  useEffect(() => {
    console.log('BrandPersonalization - Form Data Updated:', {
      formData,
      currentStep,
      hasSubmitted
    });
  }, [formData, currentStep, hasSubmitted]);

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
    const validationResult = validateBrandPersonalization(formData);
    console.log(' BrandPersonalization - Validation Result:', {
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      remarks: validationResult.remarks,
      formDataKeys: Object.keys(formData)
    });
    return validationResult;
  }, [formData]);

  // Only show validation errors if form has been submitted
  const allErrors = hasSubmitted ? { ...errors, ...validationErrors } : errors;

  const handleFileUpload = (file: File, type: 'logo' | 'favicon', uploadArea?: string) => {
    console.log('📁 BrandPersonalization - File Upload:', { 
      type, 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type,
      uploadArea
    });
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        // Handle individual logo upload areas
        switch (uploadArea) {
          case 'darkMode1':
            setDarkModeLogo1Preview(e.target?.result as string);
            break;
          case 'darkMode2':
            setDarkModeLogo2Preview(e.target?.result as string);
            break;
          case 'lightMode1':
            setLightModeLogo1Preview(e.target?.result as string);
            break;
          case 'lightMode2':
            setLightModeLogo2Preview(e.target?.result as string);
            break;
        }
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, uploadArea?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'logo', uploadArea);
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

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'favicon', uploadArea?: string) => {
    e.preventDefault();
    if (type === 'logo') {
      setIsLogoDragOver(false);
    } else {
      setIsFaviconDragOver(false);
    }
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile, type, uploadArea);
    }
  };
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

              console.log(' BrandPersonalization - Form Submission:', {
                formData,
                isValid,
                validationErrors,
                remarks,
                hasSubmitted: true
              });

              // Only proceed if validation passes
              if (isValid) {
                console.log(' BrandPersonalization - Validation passed, proceeding to next step');
                onNext(e);
              } else {
                console.log('BrandPersonalization - Validation failed, showing errors:', validationErrors);
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
                <h3 className="text-sm font-semibold text-primary">Company Logo</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl">
                <div className="div1 flex justify-between w-full gap-6">
                  <div className="div2 w-full flex flex-col gap-4">
                    <label
                      htmlFor="appLogo"
                      className="block text-sm font-medium text-main dark:text-white"
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
                        onDrop={(e) => handleDrop(e, 'logo', 'darkMode1')}
                      >
                        <input
                          type="file"
                          id="appLogo"
                          name="appLogo"
                          accept="image/*"
                          onChange={(e) => handleLogoChange(e, 'darkMode1')}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          {darkModeLogo1Preview ? (
                            <div 
                              className="w-full h-full cursor-pointer flex items-center justify-center"
                              onClick={() => document.getElementById('appLogo')?.click()}
                            >
                              <img
                                src={darkModeLogo1Preview}
                                alt="Logo preview"
                                className="w-32 h-32  dark:border-dark-border rounded-lg object-contain dark:bg-primary-dark-light p-2"
                              />
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
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
                        onDrop={(e) => handleDrop(e, 'logo', 'darkMode2')}
                      >
                        <input
                          type="file"
                          id="appLogo2"
                          name="appLogo"
                          accept="image/*"
                          onChange={(e) => handleLogoChange(e, 'darkMode2')}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          {darkModeLogo2Preview ? (
                            <div 
                              className="w-full h-full cursor-pointer flex items-center justify-center"
                              onClick={() => document.getElementById('appLogo2')?.click()}
                            >
                              <img
                                src={darkModeLogo2Preview}
                                alt="Logo preview"
                                className="w-32 h-32  rounded-lg object-contain  dark:bg-primary-dark-light p-2"
                              />
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="div2 w-full flex flex-col gap-4">
                    <label
                      htmlFor="appLogo3"
                      className="block text-sm font-medium text-main dark:text-white"
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
                        onDrop={(e) => handleDrop(e, 'logo', 'lightMode1')}
                      >
                        <input
                          type="file"
                          id="appLogo3"
                          name="appLogo"
                          accept="image/*"
                          onChange={(e) => handleLogoChange(e, 'lightMode1')}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          {lightModeLogo1Preview ? (
                            <div 
                              className="w-full h-full cursor-pointer flex items-center justify-center"
                              onClick={() => document.getElementById('appLogo3')?.click()}
                            >
                              <img
                                src={lightModeLogo1Preview}
                                alt="Logo preview"
                                className="w-32 h-32  dark:border-dark-border rounded-lg object-contain  dark:bg-primary-dark-light p-2"
                              />
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
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
                        onDrop={(e) => handleDrop(e, 'logo', 'lightMode2')}
                      >
                        <input
                          type="file"
                          id="appLogo4"
                          name="appLogo"
                          accept="image/*"
                          onChange={(e) => handleLogoChange(e, 'lightMode2')}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          {lightModeLogo2Preview ? (
                            <div 
                              className="w-full h-full cursor-pointer flex items-center justify-center"
                              onClick={() => document.getElementById('appLogo4')?.click()}
                            >
                              <img
                                src={lightModeLogo2Preview}
                                alt="Logo preview"
                                className="w-32 h-32  dark:border-dark-border rounded-lg object-contain dark:bg-primary-dark-light p-2"
                              />
                            </div>
                          ) : (
                            <>
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
                                PNG, SVG up to 5MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Favicon Section - Right Side */}
                <div className="div1 flex justify-between w-full gap-4">
                  <div className="div2 w-full flex flex-col gap-4">
                    <label
                      htmlFor="appFavicon"
                      className="block text-sm font-medium text-main dark:text-white"
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
                          {faviconPreview ? (
                            <div 
                              className="w-full h-full cursor-pointer flex items-center justify-center"
                              onClick={() => document.getElementById('appFavicon')?.click()}
                            >
                              <img
                                src={faviconPreview}
                                alt="Favicon preview"
                                className="w-24 h-24 dark:border-dark-border rounded object-contain dark:bg-primary-dark-light p-1"
                              />
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Color Section */}
            <div className="p-4 border border-primary-border rounded-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">Brand Colors</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto scrollbar-hide justify-start items-center place-items-start">
                {/* Primary Colors */}
                <ColorPicker
                  label="Primary Color"
                  name="customPrimaryColor"
                  value={formData.customPrimaryColor || "#163b7c"}
                  onChange={onInputChange}
                  options={[
                    { value: "#163b7c", label: "Primary Blue", color: "#163b7c" },
                    { value: "#041328", label: "Primary Dark", color: "#041328" },
                    { value: "#005c8e", label: "Primary Light", color: "#005c8e" },
                    { value: "#202d59", label: "Primary Deep", color: "#202d59" },
                    { value: "#dce7ec", label: "Primary BG Light", color: "#dce7ec" },
                    { value: "#f5f8fc", label: "Primary Lightest", color: "#f5f8fc" }
                  ]}
                />
                
                {/* Secondary Colors */}
                <ColorPicker
                  label="Secondary Color"
                  name="customSecondaryColor"
                  value={formData.customSecondaryColor || "#55b56c"}
                  onChange={onInputChange}
                  options={[
                    { value: "#55b56c", label: "Primary Green", color: "#55b56c" },
                    { value: "#bbe1c4", label: "Secondary Light", color: "#bbe1c4" },
                    { value: "#029447", label: "Positive Green", color: "#029447" },
                    { value: "#6bc47a", label: "Light Green", color: "#6bc47a" },
                    { value: "#81d38a", label: "Bright Green", color: "#81d38a" },
                    { value: "#97e298", label: "Mint Green", color: "#97e298" }
                  ]}
                />
                
                {/* Text Primary Colors */}
                <ColorPicker
                  label="Text Primary Color"
                  name="customTextPrimaryColor"
                  value={formData.customTextPrimaryColor || "#262626"}
                  onChange={onInputChange}
                  options={[
                    { value: "#262626", label: "Text Primary", color: "#262626" },
                    { value: "#7e7e7e", label: "Text Secondary", color: "#7e7e7e" },
                    { value: "#476189", label: "Text Tertiary", color: "#476189" },
                    { value: "#091b3b", label: "Text Quaternary", color: "#091b3b" },
                    { value: "#3c3c3c", label: "Dark Text", color: "#3c3c3c" },
                    { value: "#a0a0a0", label: "Light Text", color: "#a0a0a0" }
                  ]}
                />
                
                {/* Text Secondary Colors */}
                <ColorPicker
                  label="Text Secondary Color"
                  name="customTextSecondaryColor"
                  value={formData.customTextSecondaryColor || "#7e7e7e"}
                  onChange={onInputChange}
                  options={[
                    { value: "#7e7e7e", label: "Text Secondary", color: "#7e7e7e" },
                    { value: "#476189", label: "Text Tertiary", color: "#476189" },
                    { value: "#a0a0a0", label: "Light Text", color: "#a0a0a0" },
                    { value: "#3c3c3c", label: "Dark Text", color: "#3c3c3c" },
                    { value: "#262626", label: "Text Primary", color: "#262626" },
                    { value: "#091b3b", label: "Text Quaternary", color: "#091b3b" }
                  ]}
                />
                
                {/* Background Colors */}
                <ColorPicker
                  label="Background Color"
                  name="customBackgroundColor"
                  value={formData.customBackgroundColor || "#f5f8fc"}
                  onChange={onInputChange}
                  options={[
                    { value: "#f5f8fc", label: "Background Secondary", color: "#f5f8fc" },
                    { value: "#ffffff", label: "Surface White", color: "#ffffff" },
                    { value: "#e9efff", label: "Primary Border", color: "#e9efff" },
                    { value: "#091b3b", label: "Dark Border", color: "#091b3b" },
                    { value: "#dce7ec", label: "Primary BG Light", color: "#dce7ec" },
                    { value: "#f0f0f0", label: "Light Background", color: "#f0f0f0" }
                  ]}
                />
                
                {/* Border Colors */}
                <ColorPicker
                  label="Border Color"
                  name="customBorderColor"
                  value={formData.customBorderColor || "#e9efff"}
                  onChange={onInputChange}
                  options={[
                    { value: "#e9efff", label: "Primary Border", color: "#e9efff" },
                    { value: "#091b3b", label: "Dark Border", color: "#091b3b" },
                    { value: "#dce7ec", label: "Light Border", color: "#dce7ec" },
                    { value: "#aebdd1", label: "Neutral Border", color: "#aebdd1" },
                    { value: "#c8c8c8", label: "Gray Border", color: "#c8c8c8" },
                    { value: "#e0e0e0", label: "Light Gray Border", color: "#e0e0e0" }
                  ]}
                />
                
                {/* Shadow Colors */}
                <ColorPicker
                  label="Shadow Color"
                  name="customShadowColor"
                  value={formData.customShadowColor || "#dce4ef"}
                  onChange={onInputChange}
                  options={[
                    { value: "#dce4ef", label: "Shadow Primary", color: "#dce4ef" },
                    { value: "#dce4ef", label: "Shadow Secondary", color: "#dce4ef" },
                    { value: "#e9efff", label: "Light Shadow", color: "#e9efff" },
                    { value: "#c8d4e0", label: "Dark Shadow", color: "#c8d4e0" },
                    { value: "#f0f4f8", label: "Very Light Shadow", color: "#f0f4f8" },
                    { value: "#b8c4d0", label: "Medium Shadow", color: "#b8c4d0" }
                  ]}
                />
                
                {/* Icon Colors */}
                <ColorPicker
                  label="Icon Color"
                  name="customIconColor"
                  value={formData.customIconColor || "#476189"}
                  onChange={onInputChange}
                  options={[
                    { value: "#476189", label: "Subinfo Color", color: "#476189" },
                    { value: "#163b7c", label: "Primary Icon", color: "#163b7c" },
                    { value: "#55b56c", label: "Success Icon", color: "#55b56c" },
                    { value: "#ed8c22", label: "Warning Icon", color: "#ed8c22" },
                    { value: "#dc272c", label: "Danger Icon", color: "#dc272c" },
                    { value: "#00d1b2", label: "Accent Icon", color: "#00d1b2" }
                  ]}
                />
                
                {/* Gradient Colors */}
                <ColorPicker
                  label="Gradient Color"
                  name="customGradientColor"
                  value={formData.customGradientColor || "#163b7c"}
                  onChange={onInputChange}
                  options={[
                    { value: "#163b7c", label: "Primary Blue", color: "#163b7c" },
                    { value: "#55b56c", label: "Primary Green", color: "#55b56c" },
                    { value: "#ed8c22", label: "Primary Orange", color: "#ed8c22" },
                    { value: "#dc272c", label: "Primary Red", color: "#dc272c" },
                    { value: "#00d1b2", label: "Primary Teal", color: "#00d1b2" },
                    { value: "#7e7e7e", label: "Primary Gray", color: "#7e7e7e" }
                  ]}
                />
              </div>
            </div>



            <div className="flex justify-between items-center">
              {currentStep > 1 && (
                <Button 
                  label="Previous" 
                  type="button" 
                  variant="secondary" 
                  onClick={onBack}
                />
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
