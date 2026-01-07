import React, { memo, useMemo, useCallback, useRef, useState } from "react";
import type {
  FormInputProps,
  FormInputEvent, 
  CommonInputProps,
  FormInputValue,
} from "@components/Form/types";
import {
  TextareaInput,
  SelectInput,
  FileInput,
  CheckboxInput,
  RadioInput,
  SwitchInput,
  TextareaField,
} from "@components/Form/index";
import ColorPicker from "@/components/Form/FormTypes/ColorPicker";
import Dropdown from "@components/global/Dropdown";
import DragDropFileUpload from "@components/global/DragDropFileUpload";

const FormInput: React.FC<FormInputProps> = ({
  input,
  value,
  error,
  showError,
  disabled,
  onInputChange,
  fileInputRefs,
  labelClassName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    name,
    type,
    label,
    placeholder,
    required,
    options,
    className: inputClassName,
    icon,
    rightIcon,
    description,
  } = input;

  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;

  const extractValueFromEvent = (event: FormInputEvent): FormInputValue => {
    const target = event.target;

    if (target.type === "checkbox") {
      return (target as HTMLInputElement).checked;
    }

    if (target.type === "file") {
      return (target as HTMLInputElement).files;
    }

    return target.value;
  };

  const handleInputChange = useCallback((event: FormInputEvent) => {
    const extractedValue = extractValueFromEvent(event);
    onInputChange(name, extractedValue, input);
    input.onChange?.(extractedValue);
  }, [onInputChange, name, input]);

  const commonProps: CommonInputProps = useMemo(() => {
    const isTextarea = type === "textarea";
    const baseClassName = `w-full px-4 py-3 bg-white dark:bg-gray-800 text-base font-medium focus:outline-none [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:dark:bg-gray-800 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#1f2937_inset] min-w-0`;
    
    const borderClassName = isTextarea 
      ? `border border-primary-border dark:border-dark-border focus:border-primary-border rounded-lg ${
          showError ? "border-danger" : "border-gray-300"
        }`
      : `border rounded-full cursor-pointer border-primary-border dark:border-dark-border focus:border-primary-border ${
          showError ? "border-red-500" : "border-gray-300"
        }`;

    return {
      id: name,
      name,
      required,
      disabled,
      className: `${baseClassName} ${borderClassName} ${inputClassName || ""}`,
      onChange: handleInputChange,
      "aria-invalid": showError ? "true" : "false",
      "aria-describedby": showError
        ? errorId
        : description
        ? descriptionId
        : undefined,
      "aria-required": required ? "true" : "false",
    };
  }, [name, required, disabled, showError, inputClassName, handleInputChange, errorId, description, descriptionId, type]);

  const renderInput = useMemo(() => {
    const stringValue = value === null ? "" : (value as string);
    const booleanValue = value === null ? false : (value as boolean);
    const fileValue = value === null ? null : (value as FileList);
    const fileSingleValue = value === null ? null : (value as File);

    // Ensure border radius is preserved by adding it to finalClassName if needed
    const borderRadiusClass = type === "textarea" ? "rounded-lg" : "rounded-full";
    const finalClassName = `${commonProps.className} ${icon ? "pl-12" : ""} ${rightIcon ? "pr-12" : ""} ${borderRadiusClass} ${
      showError ? "border-danger" : ""
    }`.trim();

    if (type === 'password' && input.showPasswordToggle) {
      return (
        <div className="relative">
          <input
            {...commonProps}
            ref={inputRef}
            key={name}
            type={showPassword ? 'text' : 'password'}
            value={stringValue}
            placeholder={placeholder || label}
            className={finalClassName}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-neutral hover:text-text-secondary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{ zIndex: 10 }}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                <g id="Layer_16" data-name="Layer 16">
                  <path d="m419.72 419.72-327.46-327.45-.07-.08a19 19 0 0 0 -26.78 27l28.67 28.67a332.64 332.64 0 0 0 -88.19 89 34.22 34.22 0 0 0 0 38.38c59.97 88.76 155.04 140.76 250.11 140.11a271.6 271.6 0 0 0 90.46-15.16l46.41 46.41a19 19 0 0 0 26.94-26.79zm-163.72-55.98a107.78 107.78 0 0 1 -98.17-152.18l29.95 29.95a69.75 69.75 0 0 0 82.71 82.71l29.95 29.95a107.23 107.23 0 0 1 -44.44 9.57z"/>
                  <path d="m506.11 236.81c-59.97-88.81-155.04-140.81-250.11-140.16a271.6 271.6 0 0 0 -90.46 15.16l46 46a107.78 107.78 0 0 1 142.63 142.63l63.74 63.74a332.49 332.49 0 0 0 88.2-89 34.22 34.22 0 0 0 0-38.37z"/>
                  <path d="m256 186.26a69.91 69.74 0 0 0 -14.49 1.52l82.71 82.7a69.74 69.74 0 0 0 -68.22-84.22z"/>
                </g>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 519.643 519.643">
                <circle cx="259.823" cy="259.866" r="80"/>
                <path d="m511.673 237.706c-61.494-74.31-154.579-145.84-251.85-145.84-97.29 0-190.397 71.58-251.85 145.84-10.63 12.84-10.63 31.48 0 44.32 15.45 18.67 47.84 54.71 91.1 86.2 108.949 79.312 212.311 79.487 321.5 0 43.26-31.49 75.65-67.53 91.1-86.2 10.599-12.815 10.654-31.438 0-44.32zm-251.85-89.84c61.76 0 112 50.24 112 112s-50.24 112-112 112-112-50.24-112-112 50.24-112 112-112z"/>
              </svg>
            )}
          </button>
          {rightIcon && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={rightIcon} alt="" className="w-5 h-5 opacity-60" />
            </div>
          )}
        </div>
      );
    }

    switch (type) {
      case "textarea":
        return (
          <div className="relative">
            <TextareaInput
              {...commonProps}
              className={finalClassName}
              value={stringValue}
              placeholder={placeholder || label}
            />
            {rightIcon && (
              <div className="absolute right-3 top-3 pointer-events-none">
                <img src={rightIcon} alt="" className="w-5 h-5 opacity-60" />
              </div>
            )}
          </div>
        );
      case "select":
        return (
          <div className="relative">
            <SelectInput
              {...commonProps}
              className={finalClassName}
              value={stringValue}
              placeholder={placeholder || `Select ${label}`}
              options={options}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <img src={rightIcon} alt="" className="w-5 h-5 opacity-60" />
              </div>
            )}
          </div>
        );
      case "file":
        return (
          <FileInput
            {...commonProps}
            className={finalClassName}
            value={fileValue}
            icon={icon}
            fileInputRefs={fileInputRefs}
          />
        );

      case "checkbox":
        return (
          <CheckboxInput
            {...commonProps}
            className={finalClassName}
            value={booleanValue}
            label={label || ""}
            description={description}
          />
        );

      case "radio":
        return (
          <RadioInput
            {...commonProps}
            className={finalClassName}
            value={stringValue}
            options={options}
            label={label || ""}
            description={description}
          />
        );

      case "switch":
        return (
          <SwitchInput
            {...commonProps}
            className={finalClassName}
            value={!!value}
            label={label || ""}
            description={description}
          />
        );

      case "colorpicker":
        return (
          <ColorPicker
            label={label || ""}
            name={name}
            value={stringValue}
            onChange={(e: React.ChangeEvent<any>) => {
              const newValue = e.target.value;
              onInputChange(name, newValue, input);
              input.onChange?.(newValue);
            }}
            error={showError ? error : undefined}
            options={input.colorOptions || []}
            required={required}
            disabled={disabled}
            showLabel={false}
          />
        );

      case "dropdown":
        const isMultiSelect = (input as any).isMultiSelect || false;
        const searchable = (input as any).searchable !== undefined ? (input as any).searchable : true;
        return (
          <Dropdown
            name={name}
            value={value as string | string[]}
            onChange={(e) => {
              const newValue = isMultiSelect
                ? (e.target.value as string[])
                : (e.target.value as string);
              onInputChange(name, newValue, input);
              input.onChange?.(newValue);
            }}
            options={options || []}
            placeholder={placeholder || label}
            required={required}
            disabled={disabled}
            isMultiSelect={isMultiSelect}
            searchable={searchable}
          />
        );

      case "chosenfile":
        return (
          <DragDropFileUpload
            id={name}
            name={name}
            label={label || "Upload File"}
            preview={
              fileSingleValue instanceof File
                ? URL.createObjectURL(fileSingleValue)
                : null
            }
            isDragOver={false}
            onFileChange={(file: File) => {
              onInputChange(name, file, input);
              input.onChange?.(file);
            }}
            onDragOver={(e: React.DragEvent) => {
              e.preventDefault();
            }}
            onDragLeave={(e: React.DragEvent) => {
              e.preventDefault();
            }}
            onDrop={(e: React.DragEvent) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                onInputChange(name, file, input);
                input.onChange?.(file);
              }
            }}
            onChange={commonProps.onChange}
            accept={input.accept || "image/*,application/pdf"}
            browseLabel="browse"
            helperText="PNG, SVG, PDF up to 5MB"
            containerClassName=""
            imgClassName="w-32 h-32 rounded-lg object-contain p-2"
            iconClassName="w-8 h-8 filter dark:invert opacity-60"
            inputClassName="hidden"
            labelClassName="block text-sm font-medium text-main dark:text-white"
          />
        );

      case "textareafield":
        return (
          <TextareaField
            {...commonProps}
            className={finalClassName}
            value={stringValue}
            label={label}
            placeholder={placeholder}
            description={description}
          />
        );

      case "label":
        return (
          <div className={`w-full `}>
            <div 
              className={`${labelClassName || "flex flex-col gap-2 w-full items-end"}`}
              onClick={input.onClick}
              style={{ cursor: input.onClick ? 'pointer' : 'default' }}
            >
              {label && (
                <div className="text-base font-medium text-gray-900 dark:text-white">
                  {label}
                </div>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400" role="note">
                  {description}
                </p>
              )}
            </div>
          </div>
        );

      default:
        const allowedTextInputTypes = [
          "text",
          "email",
          "password",
          "number",
          "date",
          "url",
        ] as const;
        const textInputType = allowedTextInputTypes.includes(type as any)
          ? type
          : "text";
        
        if (rightIcon) {
          return (
            <div className="relative">
              <input
                {...commonProps}
                ref={inputRef}
                key={name}
                type={textInputType}
                value={stringValue}
                placeholder={placeholder || label}
                className={finalClassName}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none hover:cursor-pointer bg-background-secondary rounded-full p-2">
              <img
                src={rightIcon}
                alt="icon"
                className="w-5 h-5 pointer-events-none"
              />
              </div>
              
            </div>
          );
        }
        
        return (
          <div className="relative">
            <input
              {...commonProps}
              ref={inputRef}
              key={name}
              type={textInputType}
              value={stringValue}
              placeholder={placeholder || label}
              className={finalClassName}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <img src={rightIcon} alt="" className="w-5 h-5 opacity-60" />
              </div>
            )}
          </div>
        );
    }
  }, [type, value, commonProps, placeholder, label, options, icon, rightIcon, fileInputRefs, description, name, onInputChange, input, showError, error, required, disabled, inputClassName, showError, showPassword, setShowPassword]);

  return (
    <div className={`w-full  ${inputClassName || ""}`}>
      <div className="flex flex-col gap-2">
        {label &&
          ![
            "chosenfile",
            "textareafield",
            "radio",
            "switch",
            "checkbox",
            "label",
          ].includes(type) && (
            <label htmlFor={name} className="label">
              {label}
            </label>
          )}
        <div className="relative">
          {showError && error && !["colorpicker", "label"].includes(type) && (
            <span
              id={errorId}
              className="absolute top-0 left-6 -translate-y-1/2 px-1 z-20  bg-white text-red-500 text-sm font-medium"
              role="alert"
              aria-live="polite"
            >
              {error}
            </span>
          )}
          {renderInput}
        </div>
        {description && !showError && !["label"].includes(type) && (
          <p id={descriptionId} className="text-sm text-gray-500" role="note">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

FormInput.displayName = "FormInput";

export default memo(FormInput);
