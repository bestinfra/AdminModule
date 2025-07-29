import React, { useState, useRef, useMemo, useEffect } from "react";
import FormInput from "@components/Form/FormInput";
import Button from "@components/global/Button";

import ColorPicker from "@/components/Form/FormTypes/ColorPicker";
import type { FormInputValue } from "@components/Form/types";
import { validateBrandPersonalization } from "@pages/Apps_module/utils";
import RemarksPanel from "@pages/Apps_module/components/RemarksPanel";
import DragDropFileUpload from "@components/global/DragDropFileUpload";
import TimeRangeSelector from "@/components/global/TimeRangeSelector";

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
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>(
        {}
    );

    // Individual preview states for each upload area
    const [darkModeLogo1Preview, setDarkModeLogo1Preview] = useState<
        string | null
    >(null);
    const [darkModeLogo2Preview, setDarkModeLogo2Preview] = useState<
        string | null
    >(null);
    const [lightModeLogo1Preview, setLightModeLogo1Preview] = useState<
        string | null
    >(null);
    const [lightModeLogo2Preview, setLightModeLogo2Preview] = useState<
        string | null
    >(null);

  // Log form data changes
  useEffect(() => {
    console.log('BrandPersonalization - Form Data Updated:', {
      formData,
      currentStep,
      hasSubmitted
    });
  }, [formData, currentStep, hasSubmitted]);

  // Log color values whenever they change
  useEffect(() => {
    const colorKeys = Object.keys(formData).filter(key => key.startsWith('color'));
    const colorValues = colorKeys.reduce((acc, key) => {
      acc[key] = formData[key];
      return acc;
    }, {} as Record<string, any>);
    console.log('BrandPersonalization - Current Color Values:', colorValues);
  }, [
    formData.colorPrimaryBg,
    formData.colorPrimaryBgLight,
    formData.colorPrimaryLightest,
    formData.colorSecondary,
    formData.colorSecondaryLight,
    formData.colorSecondaryPositive,
    formData.colorSecondaryPositiveLight,
    formData.colorTextPrimary,
    formData.colorTextSecondary,
    formData.colorPrimaryBorder,
    formData.colorWarning,
    formData.colorWarningAlt,
    formData.colorWarningLight,
    formData.colorDanger,
    formData.colorDangerAlt,
    formData.colorDangerLight,
    formData.colorInfo,
    formData.colorNeutralDark,
    formData.colorNeutralDarker,
    formData.colorNeutralLightest,
    formData.colorAccentLight,
    formData.colorShadowPrimary,
    formData.colorShadowSecondary,
    formData.colorPrimaryDark,
    formData.colorPrimaryDarkLight,
    formData.colorDarkPrimary,
    formData.colorDarkSecondary,
    formData.colorDarkBorder,
    formData.colorPrimaryGradient,
    formData.colorPrimaryDarkGradient,
    formData.colorGradientSecondary,
    formData.colorStatIconGradient
  ]);

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
            formDataKeys: Object.keys(formData),
        });
        return validationResult;
    }, [formData]);

    // Only show validation errors if form has been submitted
    const allErrors = hasSubmitted
        ? { ...errors, ...validationErrors }
        : errors;

    const handleFileUpload = (
        file: File,
        type: 'logo' | 'favicon',
        uploadArea?: string
    ) => {
        console.log('BrandPersonalization - File Upload:', {
            type,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadArea,
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
                files: [file],
            },
        } as any;
        onInputChange(syntheticEvent);
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
    let imageFile;
    
    if (type === 'favicon') {
      // For favicon, only accept PNG files
      imageFile = files.find(file => file.type === 'image/png');
    } else {
      // For logo, accept any image type
      imageFile = files.find(file => file.type.startsWith('image/'));
    }
    
    if (imageFile) {
      handleFileUpload(imageFile, type, uploadArea);
    }
  };

  const [selectedMode, setSelectedMode] = useState<"Light" | "Dark">("Light");

  const handleModeChange = (mode: string) => {
    if (mode === "Light" || mode === "Dark") {
      setSelectedMode(mode);
    }
  };

  // Build color options for gradient dropdowns
  const lightModeColors = [
    { value: formData.colorPrimaryBg || "#efefef", label: "Main Page Background", color: formData.colorPrimaryBg || "#efefef" },
    { value: formData.colorPrimaryBgLight || "#dce7ec", label: "Card/Panel Background", color: formData.colorPrimaryBgLight || "#dce7ec" },
    { value: formData.colorPrimaryLightest || "#f5f8fc", label: "Section Background", color: formData.colorPrimaryLightest || "#f5f8fc" },
    { value: formData.colorSecondary || "#55b56c", label: "Success Button Background", color: formData.colorSecondary || "#55b56c" },
    { value: formData.colorSecondaryLight || "#bbe1c4", label: "Success Button Hover", color: formData.colorSecondaryLight || "#bbe1c4" },
    { value: formData.colorSecondaryPositive || "#029447", label: "Success State Highlight", color: formData.colorSecondaryPositive || "#029447" },
    { value: formData.colorSecondaryPositiveLight || "rgba(52, 199, 89, 0.15)", label: "Success State Background", color: formData.colorSecondaryPositiveLight || "rgba(52, 199, 89, 0.15)" },
    { value: formData.colorTextPrimary || "#262626", label: "Main Text Color", color: formData.colorTextPrimary || "#262626" },
    { value: formData.colorTextSecondary || "#7e7e7e", label: "Description Text Color", color: formData.colorTextSecondary || "#7e7e7e" },
    { value: formData.colorPrimaryBorder || "#e9efff", label: "Card/Section Border", color: formData.colorPrimaryBorder || "#e9efff" },
    { value: formData.colorWarning || "#ed8c22", label: "Warning/Alert Icon", color: formData.colorWarning || "#ed8c22" },
    { value: formData.colorWarningAlt || "#ffd108", label: "Warning/Alert Background", color: formData.colorWarningAlt || "#ffd108" },
    { value: formData.colorWarningLight || "rgba(255, 180, 0, 0.15)", label: "Warning/Alert Highlight", color: formData.colorWarningLight || "rgba(255, 180, 0, 0.15)" },
    { value: formData.colorDanger || "#dc272c", label: "Error/Remove Button", color: formData.colorDanger || "#dc272c" },
    { value: formData.colorDangerAlt || "#ff7c5c", label: "Error/Remove Hover", color: formData.colorDangerAlt || "#ff7c5c" },
    { value: formData.colorDangerLight || "rgba(231, 45, 63, 0.1)", label: "Error/Remove Background", color: formData.colorDangerLight || "rgba(231, 45, 63, 0.1)" },
    { value: formData.colorInfo || "none", label: "Info/Notification Icon", color: formData.colorInfo || "none" },
    { value: formData.colorNeutralDark || "#3c3c3c", label: "Neutral Text", color: formData.colorNeutralDark || "#3c3c3c" },
    { value: formData.colorNeutralDarker || "#262626", label: "Neutral Subtext", color: formData.colorNeutralDarker || "#262626" },
    { value: formData.colorNeutralLightest || "#ffffff", label: "Page/Panel Background", color: formData.colorNeutralLightest || "#ffffff" },
    { value: formData.colorAccentLight || "rgba(0, 209, 178, 0.05)", label: "Highlight/Selection Background", color: formData.colorAccentLight || "rgba(0, 209, 178, 0.05)" },
    { value: formData.colorShadowPrimary || "#dce4ef", label: "Card Shadow", color: formData.colorShadowPrimary || "#dce4ef" },
    { value: formData.colorShadowSecondary || "#dce4ef", label: "Panel Shadow", color: formData.colorShadowSecondary || "#dce4ef" },
  ];
  const darkModeColors = [
    { value: formData.colorPrimaryDark || "#041328", label: "Main Background (Dark Mode)", color: formData.colorPrimaryDark || "#041328" },
    { value: formData.colorPrimaryDarkLight || "#06152d", label: "Card/Panel Background (Dark)", color: formData.colorPrimaryDarkLight || "#06152d" },
    { value: formData.colorDarkPrimary || "#476189", label: "Main Text (Dark)", color: formData.colorDarkPrimary || "#476189" },
    { value: formData.colorDarkSecondary || "#476189", label: "Subtext (Dark)", color: formData.colorDarkSecondary || "#476189" },
    { value: formData.colorDarkBorder || "#091b3b", label: "Border (Dark Mode)", color: formData.colorDarkBorder || "#091b3b" },
    { value: formData.colorPrimaryGradient || "linear-gradient(135deg, var(--colorSecondaryLight), var(--colorSecondaryLightestTransperent))", label: "Main Gradient Background", color: formData.colorPrimaryGradient || "#163b7c" },
    { value: formData.colorPrimaryDarkGradient || "linear-gradient(135deg, var(--colorPrimaryLight), var(--colorSecondaryLightestTransperent))", label: "Main Gradient (Dark)", color: formData.colorPrimaryDarkGradient || "#041328" },
    { value: formData.colorGradientSecondary || "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))", label: "Panel Gradient (Dark)", color: formData.colorGradientSecondary || "#bbe1c4" },
    { value: formData.colorStatIconGradient || "linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))", label: "Statistics Icon Gradient", color: formData.colorStatIconGradient || "#bbe1c4" },
  ];


  return (
    <>
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
                <div className="mt-6">
                  <FormInput
                    input={{
                      name: "appDescription",
                      type: "textarea",
                      placeholder: "Enter app description",
                      required: true,
                    }}
                    value={formData.appDescription}
                    error={allErrors.appDescription}
                    showError={!!allErrors.appDescription}
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
                      <DragDropFileUpload
                        id="appLogo"
                        name="appLogo"
                        label="Dark Mode"
                        preview={darkModeLogo1Preview}
                        isDragOver={isLogoDragOver}
                        onFileChange={(file) => handleFileUpload(file, 'logo', 'darkMode1')}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo', 'darkMode1')}
                        accept="image/*"
                        browseLabel="browse"
                        helperText="PNG, SVG up to 5MB"
                        previewOnClick={() => document.getElementById('appLogo')?.click()}
                      />

                      <DragDropFileUpload
                        id="appLogo2"
                        name="appLogo"
                        label=""
                        preview={darkModeLogo2Preview}
                        isDragOver={isLogoDragOver}
                        onFileChange={(file) => handleFileUpload(file, 'logo', 'darkMode2')}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo', 'darkMode2')}
                        accept="image/*"
                        browseLabel="browse"
                        helperText="PNG, SVG up to 5MB"
                        previewOnClick={() => document.getElementById('appLogo2')?.click()}
                      />
                    </div>
                    <div className="div2 w-full flex flex-col gap-4">
                      <DragDropFileUpload
                        id="appLogo3"
                        name="appLogo"
                        label="Light Mode"
                        preview={lightModeLogo1Preview}
                        isDragOver={isLogoDragOver}
                        onFileChange={(file) => handleFileUpload(file, 'logo', 'lightMode1')}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo', 'lightMode1')}
                        accept="image/*"
                        browseLabel="browse"
                        helperText="PNG, SVG up to 5MB"
                        previewOnClick={() => document.getElementById('appLogo3')?.click()}
                      />

                      <DragDropFileUpload
                        id="appLogo4"
                        name="appLogo"
                        label=""
                        preview={lightModeLogo2Preview}
                        isDragOver={isLogoDragOver}
                        onFileChange={(file) => handleFileUpload(file, 'logo', 'lightMode2')}
                        onDragOver={(e) => handleDragOver(e, 'logo')}
                        onDragLeave={(e) => handleDragLeave(e, 'logo')}
                        onDrop={(e) => handleDrop(e, 'logo', 'lightMode2')}
                        accept="image/*"
                        browseLabel="browse"
                        helperText="PNG, SVG up to 5MB"
                        previewOnClick={() => document.getElementById('appLogo4')?.click()}
                      />
                    </div>
                  </div>
                  {/* Favicon Section - Right Side */}
                  <div className="div1 flex justify-between w-full gap-4">
                    <div className="div2 w-full flex flex-col gap-4">
                      <DragDropFileUpload
                        id="appFavicon"
                        name="appFavicon"
                        label="Favicon"
                        preview={faviconPreview}
                        isDragOver={isFaviconDragOver}
                        onFileChange={(file) => handleFileUpload(file, 'favicon')}
                        onDragOver={(e) => handleDragOver(e, 'favicon')}
                        onDragLeave={(e) => handleDragLeave(e, 'favicon')}
                        onDrop={(e) => handleDrop(e, 'favicon')}
                        accept="image/png"
                        browseLabel="browse"
                        helperText="PNG format only, up to 1MB"
                        imgClassName="w-24 h-24 dark:border-dark-border rounded object-contain dark:bg-primary-dark-light p-1"
                        previewOnClick={() => document.getElementById('appFavicon')?.click()}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Color Section */}
              <div className="p-4 border border-primary-border rounded-xl">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-primary">Brand Colors</h3>
                  <TimeRangeSelector
                    availableTimeRanges={["Light", "Dark"]}
                    selectedTimeRange={selectedMode}
                    handleTimeRangeChange={handleModeChange}
                    timeRangeLabels={{ Light: "Light Mode", Dark: "Dark Mode" }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-h-96 overflow-y-auto scrollbar-hide justify-start items-center place-items-start">
                  {/* Light Mode Colors */}
                  {selectedMode === "Light" && <>
                    {/* Primary Colors */}
                    <ColorPicker label="Main Page Background" name="colorPrimaryBg" value={formData.colorPrimaryBg || "#efefef"} onChange={onInputChange} options={[{ value: "#efefef", label: "Main Page Background", color: "#efefef" }]} width={48} />
                    <ColorPicker label="Card/Panel Background" name="colorPrimaryBgLight" value={formData.colorPrimaryBgLight || "#dce7ec"} onChange={onInputChange} options={[{ value: "#dce7ec", label: "Card/Panel Background", color: "#dce7ec" }]} width={48} />
                    <ColorPicker label="Section Background" name="colorPrimaryLightest" value={formData.colorPrimaryLightest || "#f5f8fc"} onChange={onInputChange} options={[{ value: "#f5f8fc", label: "Section Background", color: "#f5f8fc" }]} width={48} />
                    {/* Secondary Colors */}
                    <ColorPicker label="Success Button Background" name="colorSecondary" value={formData.colorSecondary || "#55b56c"} onChange={onInputChange} options={[{ value: "#55b56c", label: "Success Button Background", color: "#55b56c" }]} width={48} />
                    <ColorPicker label="Success Button Hover" name="colorSecondaryLight" value={formData.colorSecondaryLight || "#bbe1c4"} onChange={onInputChange} options={[{ value: "#bbe1c4", label: "Success Button Hover", color: "#bbe1c4" }]} width={48} />
                    <ColorPicker label="Success State Highlight" name="colorSecondaryPositive" value={formData.colorSecondaryPositive || "#029447"} onChange={onInputChange} options={[{ value: "#029447", label: "Success State Highlight", color: "#029447" }]} width={48} />
                    <ColorPicker label="Success State Background" name="colorSecondaryPositiveLight" value={formData.colorSecondaryPositiveLight || "rgba(52, 199, 89, 0.15)"} onChange={onInputChange} options={[{ value: "rgba(52, 199, 89, 0.15)", label: "Success State Background", color: "rgba(52, 199, 89, 0.15)" }]} allowGradient={true} width={48} gradientColorOptions={{ light: lightModeColors, dark: darkModeColors }} currentMode={selectedMode.toLowerCase() === 'light' ? 'light' : 'dark'} />
                    {/* Text Colors */}
                    <ColorPicker label="Main Text Color" name="colorTextPrimary" value={formData.colorTextPrimary || "#262626"} onChange={onInputChange} options={[{ value: "#262626", label: "Main Text Color", color: "#262626" }]} width={48} />
                    <ColorPicker label="Description Text Color" name="colorTextSecondary" value={formData.colorTextSecondary || "#7e7e7e"} onChange={onInputChange} options={[{ value: "#7e7e7e", label: "Description Text Color", color: "#7e7e7e" }]} width={48} />
                    {/* Border Colors */}
                    <ColorPicker label="Card/Section Border" name="colorPrimaryBorder" value={formData.colorPrimaryBorder || "#e9efff"} onChange={onInputChange} options={[{ value: "#e9efff", label: "Card/Section Border", color: "#e9efff" }]} width={48} />
                    {/* Status Colors */}
                    <ColorPicker label="Warning/Alert Icon" name="colorWarning" value={formData.colorWarning || "#ed8c22"} onChange={onInputChange} options={[{ value: "#ed8c22", label: "Warning/Alert Icon", color: "#ed8c22" }]} width={48} />
                    <ColorPicker label="Warning/Alert Background" name="colorWarningAlt" value={formData.colorWarningAlt || "#ffd108"} onChange={onInputChange} options={[{ value: "#ffd108", label: "Warning/Alert Background", color: "#ffd108" }]} width={48} />
                    <ColorPicker label="Warning/Alert Highlight" name="colorWarningLight" value={formData.colorWarningLight || "rgba(255, 180, 0, 0.15)"} onChange={onInputChange} options={[{ value: "rgba(255, 180, 0, 0.15)", label: "Warning/Alert Highlight", color: "rgba(255, 180, 0, 0.15)" }]} allowGradient={true} width={48} />
                    <ColorPicker label="Error/Remove Button" name="colorDanger" value={formData.colorDanger || "#dc272c"} onChange={onInputChange} options={[{ value: "#dc272c", label: "Error/Remove Button", color: "#dc272c" }]} width={48} />
                    <ColorPicker label="Error/Remove Hover" name="colorDangerAlt" value={formData.colorDangerAlt || "#ff7c5c"} onChange={onInputChange} options={[{ value: "#ff7c5c", label: "Error/Remove Hover", color: "#ff7c5c" }]} width={48} />
                    <ColorPicker label="Error/Remove Background" name="colorDangerLight" value={formData.colorDangerLight || "rgba(231, 45, 63, 0.1)"} onChange={onInputChange} options={[{ value: "rgba(231, 45, 63, 0.1)", label: "Error/Remove Background", color: "rgba(231, 45, 63, 0.1)" }]} allowGradient={true} width={48} />
                    <ColorPicker label="Info/Notification Icon" name="colorInfo" value={formData.colorInfo || "none"} onChange={onInputChange} options={[{ value: "none", label: "Info/Notification Icon", color: "none" }]} width={48} />
                    {/* Neutral Colors */}
                    <ColorPicker label="Neutral Text" name="colorNeutralDark" value={formData.colorNeutralDark || "#3c3c3c"} onChange={onInputChange} options={[{ value: "#3c3c3c", label: "Neutral Text", color: "#3c3c3c" }]} width={48} />
                    <ColorPicker label="Neutral Subtext" name="colorNeutralDarker" value={formData.colorNeutralDarker || "#262626"} onChange={onInputChange} options={[{ value: "#262626", label: "Neutral Subtext", color: "#262626" }]} width={48} />
                    <ColorPicker label="Page/Panel Background" name="colorNeutralLightest" value={formData.colorNeutralLightest || "#ffffff"} onChange={onInputChange} options={[{ value: "#ffffff", label: "Page/Panel Background", color: "#ffffff" }]} width={48} />
                    {/* Accent Colors */}
                    <ColorPicker label="Highlight/Selection Background" name="colorAccentLight" value={formData.colorAccentLight || "rgba(0, 209, 178, 0.05)"} onChange={onInputChange} options={[{ value: "rgba(0, 209, 178, 0.05)", label: "Highlight/Selection Background", color: "rgba(0, 209, 178, 0.05)" }]} allowGradient={true} width={48} />
                    {/* Shadow Colors */}
                    <ColorPicker label="Card Shadow" name="colorShadowPrimary" value={formData.colorShadowPrimary || "#dce4ef"} onChange={onInputChange} options={[{ value: "#dce4ef", label: "Card Shadow", color: "#dce4ef" }]} width={48} />
                    <ColorPicker label="Panel Shadow" name="colorShadowSecondary" value={formData.colorShadowSecondary || "#dce4ef"} onChange={onInputChange} options={[{ value: "#dce4ef", label: "Panel Shadow", color: "#dce4ef" }]} width={48} />
                  </>}
                  {/* Dark Mode Colors */}
                  {selectedMode === "Dark" && <>
                    <ColorPicker label="Main Background (Dark Mode)" name="colorPrimaryDark" value={formData.colorPrimaryDark || "#041328"} onChange={onInputChange} options={[{ value: "#041328", label: "Main Background (Dark Mode)", color: "#041328" }]} width={48} />
                    <ColorPicker label="Card/Panel Background (Dark)" name="colorPrimaryDarkLight" value={formData.colorPrimaryDarkLight || "#06152d"} onChange={onInputChange} options={[{ value: "#06152d", label: "Card/Panel Background (Dark)", color: "#06152d" }]} width={48} />
                    <ColorPicker label="Main Text (Dark)" name="colorDarkPrimary" value={formData.colorDarkPrimary || "#476189"} onChange={onInputChange} options={[{ value: "#476189", label: "Main Text (Dark)", color: "#476189" }]} width={48} />
                    <ColorPicker label="Border (Dark Mode)" name="colorDarkBorder" value={formData.colorDarkBorder || "#091b3b"} onChange={onInputChange} options={[{ value: "#091b3b", label: "Border (Dark Mode)", color: "#091b3b" }]} width={48} />
                    {/* Gradients (optional, can be removed if not needed) */}
                    <ColorPicker label="Main Gradient Background" name="colorPrimaryGradient" value={formData.colorPrimaryGradient || "linear-gradient(135deg, var(--colorSecondaryLight), var(--colorSecondaryLightestTransperent))"} onChange={onInputChange} options={[{ value: "linear-gradient(135deg, var(--colorSecondaryLight), var(--colorSecondaryLightestTransperent))", label: "Main Gradient Background", color: "#163b7c" }]} allowGradient={true} gradientInputWidth="full" gradientColorOptions={{ light: lightModeColors, dark: darkModeColors }} currentMode={selectedMode.toLowerCase() === 'light' ? 'light' : 'dark'} />
                    <ColorPicker label="Main Gradient (Dark)" name="colorPrimaryDarkGradient" value={formData.colorPrimaryDarkGradient || "linear-gradient(135deg, var(--colorPrimaryLight), var(--colorSecondaryLightestTransperent))"} onChange={onInputChange} options={[{ value: "linear-gradient(135deg, var(--colorPrimaryLight), var(--colorSecondaryLightestTransperent))", label: "Main Gradient (Dark)", color: "#041328" }]} allowGradient={true} width={48} gradientInputWidth="full" gradientColorOptions={{ light: lightModeColors, dark: darkModeColors }} currentMode={selectedMode.toLowerCase() === 'light' ? 'light' : 'dark'} />
                    <ColorPicker label="Panel Gradient (Dark)" name="colorGradientSecondary" value={formData.colorGradientSecondary || "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))"} onChange={onInputChange} options={[{ value: "linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))", label: "Panel Gradient (Dark)", color: "#bbe1c4" }]} allowGradient={true} width={48}  gradientInputWidth="full" gradientColorOptions={{ light: lightModeColors, dark: darkModeColors }} currentMode={selectedMode.toLowerCase() === 'light' ? 'light' : 'dark'} />
                    <ColorPicker label="Statistics Icon Gradient" name="colorStatIconGradient" value={formData.colorStatIconGradient || "linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))"} onChange={onInputChange} options={[{ value: "linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))", label: "Statistics Icon Gradient", color: "#bbe1c4" }]} allowGradient={true} width={48}  gradientInputWidth="full" gradientColorOptions={{ light: lightModeColors, dark: darkModeColors }} currentMode={selectedMode.toLowerCase() === 'light' ? 'light' : 'dark'}/>
                  </>}
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
    </>
  );
}

export default BrandPersonalization;