import React, { memo, useMemo, useCallback, useRef } from "react";
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
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    name,
    type,
    label,
    placeholder,
    required,
    options,
    className: inputClassName,
    icon,
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

  const commonProps: CommonInputProps = useMemo(() => ({
    id: name,
    name,
    required,
    disabled,
    className: `w-full flex items-center justify-between border px-4 py-3.5 rounded-full cursor-pointer bg-white dark:bg-gray-800 border-primary-border dark:border-dark-border text-base font-medium focus:border-primary-border focus:outline-none [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:dark:bg-gray-800 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_#1f2937_inset] ${
      showError ? "border-red-500" : "border-gray-300"
    } ${inputClassName || ""}`,
    onChange: handleInputChange,
    "aria-invalid": showError ? "true" : "false",
    "aria-describedby": showError
      ? errorId
      : description
      ? descriptionId
      : undefined,
    "aria-required": required ? "true" : "false",
  }), [name, required, disabled, showError, inputClassName, handleInputChange, errorId, description, descriptionId]);

  const renderInput = useMemo(() => {
    const stringValue = value === null ? "" : (value as string);
    const booleanValue = value === null ? false : (value as boolean);
    const fileValue = value === null ? null : (value as FileList);
    const fileSingleValue = value === null ? null : (value as File);

    const finalClassName = `${commonProps.className} ${icon ? "pr-12" : ""} ${
      showError ? "border-red-500" : ""
    }`.trim();

    switch (type) {
      case "textarea":
        return (
          <TextareaInput
            {...commonProps}
            className={finalClassName}
            value={stringValue}
            placeholder={placeholder || label}
          />
        );
      case "select":
        return (
          <SelectInput
            {...commonProps}
            className={finalClassName}
            value={stringValue}
            placeholder={placeholder || `Select ${label}`}
            options={options}
          />
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

      default:
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
            ref={inputRef}
            key={name}
            type={textInputType}
            value={stringValue}
            placeholder={placeholder || label}
            className={finalClassName}
          />
        );
    }
  }, [type, value, commonProps, placeholder, label, options, icon, fileInputRefs, description, name, onInputChange, input, showError, error, required, disabled, inputClassName, showError]);

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
          ].includes(type) && (
            <label htmlFor={name} className="label">
              {label}
            </label>
          )}
        <div className="relative">
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
          {renderInput}
        </div>
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
