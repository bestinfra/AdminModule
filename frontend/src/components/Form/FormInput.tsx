import React, { memo } from "react";
import type {
  FormInputProps,
  FormInputEvent,
  FormBlurEvent,
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
import ColorPicker from "@pages/Apps_module/components/ColorPicker";
import Dropdown from "@components/global/Dropdown";
import DragDropFileUpload from "@components/global/DragDropFileUpload";

const FormInput: React.FC<FormInputProps> = ({
  input,
  value,
  error,
  showError,
  disabled,
  onInputChange,
  onInputBlur,
  fileInputRefs,
  validations = true,
  customValidation,
}) => {
  const {
    name,
    type,
    label,
    placeholder,
    required,
    options,
    className: inputClassName,
    colSpan = 1,
    icon,
    description,
  } = input;

  const gridSpanClass = `col-span-${colSpan}`;
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;

  // Helper function to extract value from event based on input type
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

  // Helper function to extract value from blur event
  const extractValueFromBlurEvent = (event: FormBlurEvent): FormInputValue => {
    const target = event.target;

    if (target.type === "checkbox") {
      return (target as HTMLInputElement).checked;
    }

    if (target.type === "file") {
      return (target as HTMLInputElement).files;
    }

    return target.value;
  };

  const handleInputChange = (event: FormInputEvent) => {
    const extractedValue = extractValueFromEvent(event);
    onInputChange(name, extractedValue, input);
    input.onChange?.(extractedValue);
  };

  const handleInputBlur = (event: FormBlurEvent) => {
    const extractedValue = extractValueFromBlurEvent(event);
    onInputBlur(name, extractedValue, input);
  };

  const commonProps: CommonInputProps = {
    id: name,
    name,
    required,
    disabled,
    className: `w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer bg-white dark:bg-gray-800 border-primary-border dark:border-dark-border text-base font-medium focus:border-primary-border focus:outline-none [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:dark:bg-gray-800 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#1f2937_inset] ${
      showError ? "border-red-500" : "border-gray-300"
    } ${inputClassName || ""}`,
    onChange: handleInputChange,
    onBlur: handleInputBlur,
    // Add ARIA attributes for accessibility
    "aria-invalid": showError ? "true" : "false",
    "aria-describedby": showError
      ? errorId
      : description
      ? descriptionId
      : undefined,
    "aria-required": required ? "true" : "false",
  };

  const renderInput = () => {
    // Convert null values to empty strings for string inputs
    const stringValue = value === null ? "" : (value as string);
    const booleanValue = value === null ? false : (value as boolean);
    const fileValue = value === null ? null : (value as FileList);
    const fileSingleValue = value === null ? null : (value as File);

    switch (type) {
      case "textarea":
        return (
          <TextareaInput
            {...commonProps}
            value={stringValue}
            placeholder={placeholder || label}
          />
        );

      case "select":
        return (
          <SelectInput
            {...commonProps}
            value={stringValue}
            placeholder={placeholder || `Select ${label}`}
            options={options}
          />
        );

      case "file":
        return (
          <FileInput
            {...commonProps}
            value={fileValue}
            icon={icon}
            fileInputRefs={fileInputRefs}
          />
        );

      case "checkbox":
        return (
          <CheckboxInput
            {...commonProps}
            value={booleanValue}
            label={label || ""}
            description={description}
          />
        );

      case "radio":
        return (
          <RadioInput
            {...commonProps}
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
        return (
          <Dropdown
            name={name}
            value={value as string | string[]}
            onChange={(e) => {
              // If multi-select, pass array, else string
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
            value={stringValue}
            label={label}
            placeholder={placeholder}
            description={description}
          />
        );

      default:
        // Only allow valid types for text-like input
        const allowedTextInputTypes = [
          "text",
          "email",
          "password",
          "number",
          "date",
          "tel",
          "url",
        ] as const;
        const textInputType = allowedTextInputTypes.includes(type as any)
          ? type
          : "text";
        return (
          <input
            {...commonProps}
            type={textInputType}
            value={stringValue}
            placeholder={placeholder || label}
            className={`${commonProps.className} ${icon ? "pr-12" : ""}`}
          />
        );
    }
  };

  return (
    <div className={`w-full ${gridSpanClass}`}>
      <div className="flex flex-col gap-2">
        {label &&
          ![
            "chosenfile",
            "textareafield",
            "radio",
            "switch",
            "checkbox",
          ].includes(type) && (
            <label htmlFor={name} className="label">
              {label}
            </label>
          )}
        <div className="relative">
          {/* Floating error message */}
          {showError && error && !["colorpicker"].includes(type) && (
            <span
              id={errorId}
              className="absolute top-0 left-6 -translate-y-1/2 px-1 z-20  bg-white text-red-500 text-sm font-medium"
              role="alert"
              aria-live="polite"
            >
              {error}
            </span>
          )}
          {/* Input with red border if error */}
          {React.cloneElement(renderInput(), {
            className: `${renderInput().props.className || ""} ${
              showError ? "border-red-500" : ""
            }`.trim(),
          })}
        </div>
        {/* Accessible description */}
        {description && !showError && (
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
