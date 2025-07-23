import React, { useState, useRef, useMemo, useEffect } from 'react';
import FormInput from '@components/Form/FormInput';
import Button from '@components/global/Button';
import type { FormInputValue } from '@components/Form/types';
import { validateBrandPersonalization } from '@pages/Apps_module/utils';
import RemarksPanel from '@pages/Apps_module/components/RemarksPanel';
import DragDropFileUpload from '@components/global/DragDropFileUpload';

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
            hasSubmitted,
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

    const handleDrop = (
        e: React.DragEvent,
        type: 'logo' | 'favicon',
        uploadArea?: string
    ) => {
        e.preventDefault();
        if (type === 'logo') {
            setIsLogoDragOver(false);
        } else {
            setIsFaviconDragOver(false);
        }

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find((file) => file.type.startsWith('image/'));

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
                            Customize your application's appearance and branding
                            elements
                        </p>
                    </div>

                    <form
                        className="space-y-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setHasSubmitted(true);

                            console.log(
                                ' BrandPersonalization - Form Submission:',
                                {
                                    formData,
                                    isValid,
                                    validationErrors,
                                    remarks,
                                    hasSubmitted: true,
                                }
                            );

                            // Only proceed if validation passes
                            if (isValid) {
                                console.log(
                                    ' BrandPersonalization - Validation passed, proceeding to next step'
                                );
                                onNext(e);
                            } else {
                                console.log(
                                    'BrandPersonalization - Validation failed, showing errors:',
                                    validationErrors
                                );
                            }
                        }}
                        action="#"
                        method="post"
                        noValidate>
                        {/* Company Information Section */}
                        <div className="p-4 border border-primary-border rounded-xl">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-primary">
                                    Company Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    input={{
                                        name: 'companyName',
                                        type: 'text',
                                        placeholder: 'Enter company name',
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
                                        name: 'companyWebsite',
                                        type: 'url',
                                        placeholder: 'https://example.com',
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
                                <h3 className="text-sm font-semibold text-primary">
                                    Company Logo
                                </h3>
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
                                            onFileChange={(file) =>
                                                handleFileUpload(
                                                    file,
                                                    'logo',
                                                    'darkMode1'
                                                )
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, 'logo')
                                            }
                                            onDragLeave={(e) =>
                                                handleDragLeave(e, 'logo')
                                            }
                                            onDrop={(e) =>
                                                handleDrop(
                                                    e,
                                                    'logo',
                                                    'darkMode1'
                                                )
                                            }
                                            accept="image/*"
                                            browseLabel="browse"
                                            helperText="PNG, SVG up to 5MB"
                                            previewOnClick={() =>
                                                document
                                                    .getElementById('appLogo')
                                                    ?.click()
                                            }
                                        />

                                        <DragDropFileUpload
                                            id="appLogo2"
                                            name="appLogo"
                                            label=""
                                            preview={darkModeLogo2Preview}
                                            isDragOver={isLogoDragOver}
                                            onFileChange={(file) =>
                                                handleFileUpload(
                                                    file,
                                                    'logo',
                                                    'darkMode2'
                                                )
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, 'logo')
                                            }
                                            onDragLeave={(e) =>
                                                handleDragLeave(e, 'logo')
                                            }
                                            onDrop={(e) =>
                                                handleDrop(
                                                    e,
                                                    'logo',
                                                    'darkMode2'
                                                )
                                            }
                                            accept="image/*"
                                            browseLabel="browse"
                                            helperText="PNG, SVG up to 5MB"
                                            previewOnClick={() =>
                                                document
                                                    .getElementById('appLogo2')
                                                    ?.click()
                                            }
                                        />
                                    </div>
                                    <div className="div2 w-full flex flex-col gap-4">
                                        <DragDropFileUpload
                                            id="appLogo3"
                                            name="appLogo"
                                            label="Light Mode"
                                            preview={lightModeLogo1Preview}
                                            isDragOver={isLogoDragOver}
                                            onFileChange={(file) =>
                                                handleFileUpload(
                                                    file,
                                                    'logo',
                                                    'lightMode1'
                                                )
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, 'logo')
                                            }
                                            onDragLeave={(e) =>
                                                handleDragLeave(e, 'logo')
                                            }
                                            onDrop={(e) =>
                                                handleDrop(
                                                    e,
                                                    'logo',
                                                    'lightMode1'
                                                )
                                            }
                                            accept="image/*"
                                            browseLabel="browse"
                                            helperText="PNG, SVG up to 5MB"
                                            previewOnClick={() =>
                                                document
                                                    .getElementById('appLogo3')
                                                    ?.click()
                                            }
                                        />

                                        <DragDropFileUpload
                                            id="appLogo4"
                                            name="appLogo"
                                            label=""
                                            preview={lightModeLogo2Preview}
                                            isDragOver={isLogoDragOver}
                                            onFileChange={(file) =>
                                                handleFileUpload(
                                                    file,
                                                    'logo',
                                                    'lightMode2'
                                                )
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, 'logo')
                                            }
                                            onDragLeave={(e) =>
                                                handleDragLeave(e, 'logo')
                                            }
                                            onDrop={(e) =>
                                                handleDrop(
                                                    e,
                                                    'logo',
                                                    'lightMode2'
                                                )
                                            }
                                            accept="image/*"
                                            browseLabel="browse"
                                            helperText="PNG, SVG up to 5MB"
                                            previewOnClick={() =>
                                                document
                                                    .getElementById('appLogo4')
                                                    ?.click()
                                            }
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
                                            onFileChange={(file) =>
                                                handleFileUpload(
                                                    file,
                                                    'favicon'
                                                )
                                            }
                                            onDragOver={(e) =>
                                                handleDragOver(e, 'favicon')
                                            }
                                            onDragLeave={(e) =>
                                                handleDragLeave(e, 'favicon')
                                            }
                                            onDrop={(e) =>
                                                handleDrop(e, 'favicon')
                                            }
                                            accept="image/*"
                                            browseLabel="browse"
                                            helperText="ICO, PNG up to 1MB"
                                            imgClassName="w-24 h-24 dark:border-dark-border rounded object-contain dark:bg-primary-dark-light p-1"
                                            previewOnClick={() =>
                                                document
                                                    .getElementById(
                                                        'appFavicon'
                                                    )
                                                    ?.click()
                                            }
                                        />
                                    </div>
                                </div>
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
                                <Button
                                    label="Next"
                                    type="submit"
                                    variant="primary"
                                />
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
