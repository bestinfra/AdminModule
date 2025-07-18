import React, { useState, useCallback, useRef, useMemo, memo } from "react";
import Button from "@components/global/Button";
import FormInput from "./FormInput";
import type {
  FormProps,
  FormInputConfig,
  FormInputValue,
} from "@components/Form/types";
import {
  getDefaultValue,
  formatPhone,
  validateField,
} from "@components/Form/utils";

// Custom hook for form state management
const useFormState = (
  inputs: FormInputConfig[],
  initialData?: Record<string, FormInputValue>,
  initialErrorMessages?: Record<string, string>,
  initialTouchedFields?: Set<string>,
  initialSubmitted?: boolean
) => {
  const defaultFormValues = useMemo(
    () =>
      inputs.reduce(
        (formValues: Record<string, FormInputValue>, inputConfig) => ({
          ...formValues,
          [inputConfig.name]: getDefaultValue(
            inputConfig.type,
            inputConfig.defaultValue
          ),
        }),
        {}
      ),
    [inputs]
  );

  const [formValues, setFormValues] = useState<Record<string, FormInputValue>>(
    initialData || defaultFormValues
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >(initialErrorMessages || {});
  const [touchedInputs, setTouchedInputs] = useState<Set<string>>(
    initialTouchedFields || new Set()
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(
    initialSubmitted || false
  );

  const resetForm = useCallback(() => {
    setFormValues(initialData || defaultFormValues);
    setValidationErrors(initialErrorMessages || {});
    setTouchedInputs(initialTouchedFields || new Set());
    setIsFormSubmitted(initialSubmitted || false);
  }, [
    initialData,
    defaultFormValues,
    initialErrorMessages,
    initialTouchedFields,
    initialSubmitted,
  ]);

  return {
    formValues,
    setFormValues,
    validationErrors,
    setValidationErrors,
    touchedInputs,
    setTouchedInputs,
    isFormSubmitted,
    setIsFormSubmitted,
    resetForm,
  };
};

// Custom hook for form validation
const useFormValidation = (
  formValues: Record<string, FormInputValue>,
  inputs: FormInputConfig[],
  touchedInputs: Set<string>,
  isFormSubmitted: boolean,
  validations: boolean = true,
  customValidation?: (value: FormInputValue, input: FormInputConfig) => string | null | undefined
) => {
  const validateAllFields = useCallback(() => {
    const errors: Record<string, string> = {};
    let hasErrors = false;

    inputs.forEach((inputConfig) => {
      const fieldError = validateSingleField(
        inputConfig.name,
        formValues[inputConfig.name],
        inputConfig
      );
      if (fieldError) {
        errors[inputConfig.name] = fieldError;
        hasErrors = true;
      }
    });

    return { errors, hasErrors };
  }, [formValues, inputs]);

  const validateSingleField = useCallback(
    (
      _inputName: string,
      inputValue: FormInputValue,
      inputConfig: FormInputConfig
    ) => {
      let validationError: string | null = null;
      
      // Run built-in validations if enabled
      if (validations) {
        validationError = validateField(inputValue, inputConfig);
      }
      
      // Run custom validation if provided and no built-in error
      if (!validationError && typeof customValidation === 'function') {
        validationError = customValidation(inputValue, inputConfig) || null;
      }
      
      return validationError;
    },
    [validations, customValidation]
  );

  const shouldShowError = useCallback(
    (inputName: string, error: string) => {
      return !!(error && (touchedInputs.has(inputName) || isFormSubmitted));
    },
    [touchedInputs, isFormSubmitted]
  );

  return {
    validateAllFields,
    validateSingleField,
    shouldShowError,
  };
};

const Form: React.FC<FormProps> = ({
  inputs,
  onSubmit,
  submitLabel,
  cancelLabel,
  className,
  gridCols,
  rowLayout,
  showCancel,
  isLoading,
  onCancel,
  formId,
  initialData,
  errorMessages: initialErrorMessages,
  touchedFields: initialTouchedFields,
  submitted: initialSubmitted,
  validations = true,
  customValidation,
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Use custom hooks for state management
  const {
    formValues,
    setFormValues,
    validationErrors,
    setValidationErrors,
    touchedInputs,
    setTouchedInputs,
    isFormSubmitted,
    setIsFormSubmitted,
    resetForm,
  } = useFormState(
    inputs,
    initialData,
    initialErrorMessages,
    initialTouchedFields,
    initialSubmitted
  );

  const { validateAllFields, validateSingleField, shouldShowError } =
    useFormValidation(formValues, inputs, touchedInputs, isFormSubmitted, validations, customValidation);

  // Input change handler
  const handleInputValueChange = useCallback(
    (
      inputName: string,
      inputValue: FormInputValue,
      inputConfig: FormInputConfig
    ) => {
      const formattedInputValue =
        (inputConfig.name === "phone" || inputConfig.name === "mobile") &&
        typeof inputValue === "string"
          ? formatPhone(inputValue)
          : inputValue;

      setFormValues((prev) => ({ ...prev, [inputName]: formattedInputValue }));

      if (touchedInputs.has(inputName)) {
        const fieldError = validateSingleField(
          inputName,
          formattedInputValue,
          inputConfig
        );
        setValidationErrors((prev) => ({
          ...prev,
          [inputName]: fieldError || "",
        }));
      }
    },
    [touchedInputs, setFormValues, setValidationErrors, validateSingleField]
  );

  // Input blur handler
  const handleInputBlur = useCallback(
    (
      inputName: string,
      inputValue: FormInputValue,
      inputConfig: FormInputConfig
    ) => {
      setTouchedInputs((prev) => new Set(prev).add(inputName));
      const fieldError = validateSingleField(
        inputName,
        inputValue,
        inputConfig
      );
      setValidationErrors((prev) => ({
        ...prev,
        [inputName]: fieldError || "",
      }));
    },
    [setTouchedInputs, setValidationErrors, validateSingleField]
  );

  // Form submission handler
  const handleFormSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setIsFormSubmitted(true);

      const { errors, hasErrors } = validateAllFields();
      setValidationErrors(errors);

      if (!hasErrors) {
        onSubmit(formValues);
      }
    },
    [
      validateAllFields,
      setValidationErrors,
      setIsFormSubmitted,
      onSubmit,
      formValues,
    ]
  );

  // Form cancel handler
  const handleFormCancel = useCallback(() => {
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  // Layout rendering functions
  const renderGridLayout = useCallback(() => {
    const gridColumnsClass = `grid-cols-${gridCols || 3}`;
    return (
      <div className={`grid gap-6 ${gridColumnsClass}`}>
        {inputs.map((inputConfig) => (
          <FormInput
            key={inputConfig.name}
            input={inputConfig}
            value={formValues[inputConfig.name]}
            error={validationErrors[inputConfig.name]}
            showError={shouldShowError(
              inputConfig.name,
              validationErrors[inputConfig.name]
            )}
            disabled={false}
            onInputChange={handleInputValueChange}
            onInputBlur={handleInputBlur}
            fileInputRefs={fileInputRefs}
            validations={validations}
            customValidation={customValidation}
          />
        ))}
      </div>
    );
  }, [
    inputs,
    gridCols,
    formValues,
    validationErrors,
    shouldShowError,
    handleInputValueChange,
    handleInputBlur,
    fileInputRefs,
    validations,
    customValidation,
  ]);

  const renderRowLayout = useCallback(() => {
    if (!rowLayout) return null;

    const {
      rows: rowConfigurations,
      defaultGap = "gap-6",
      defaultClassName = "",
    } = rowLayout;

    // Group inputs by row
    const inputsGroupedByRow = inputs.reduce((acc, inputConfig) => {
      const rowNumber = inputConfig.row || 1;
      if (!acc[rowNumber]) acc[rowNumber] = [];
      acc[rowNumber].push(inputConfig);
      return acc;
    }, {} as Record<number, FormInputConfig[]>);

    return rowConfigurations.map((rowConfig) => {
      const {
        row: rowNumber,
        columns,
        gap = defaultGap,
        className = defaultClassName,
        autoFullWidth = true,
      } = rowConfig;

      const inputsInThisRow = inputsGroupedByRow[rowNumber] || [];
      const sortedRowInputs = inputsInThisRow.sort(
        (a, b) => (a.col || 1) - (b.col || 1)
      );
      const shouldSpanFullWidth = autoFullWidth && sortedRowInputs.length === 1;
      const dynamicColumnCount = Math.max(columns, sortedRowInputs.length);
      const gridColumnsClass = `grid-cols-${dynamicColumnCount}`;

      return (
        <div
          key={rowNumber}
          className={`grid ${gap} ${gridColumnsClass} ${className}`}
        >
          {sortedRowInputs.map((inputConfig) => {
            const shouldBeFullWidth =
              inputConfig.fullWidth || shouldSpanFullWidth;
            const columnSpan = shouldBeFullWidth
              ? dynamicColumnCount
              : Math.ceil(dynamicColumnCount / sortedRowInputs.length);

            return (
              <div key={inputConfig.name} className={`col-span-${columnSpan}`}>
                <FormInput
                  input={inputConfig}
                  value={formValues[inputConfig.name]}
                  error={validationErrors[inputConfig.name]}
                  showError={shouldShowError(
                    inputConfig.name,
                    validationErrors[inputConfig.name]
                  )}
                  disabled={false}
                  onInputChange={handleInputValueChange}
                  onInputBlur={handleInputBlur}
                  fileInputRefs={fileInputRefs}
                  validations={validations}
                  customValidation={customValidation}
                />
              </div>
            );
          })}
        </div>
      );
    });
  }, [
    rowLayout,
    inputs,
    formValues,
    validationErrors,
    shouldShowError,
    handleInputValueChange,
    handleInputBlur,
    fileInputRefs,
    validations,
    customValidation,
  ]);

  // Error summary for accessibility
  const allErrorMessages = Object.values(validationErrors).filter(Boolean);
  const hasValidationErrors = allErrorMessages.length > 0;

  const formContainerClasses = `bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`;

  return (
    <div className={`w-full ${formContainerClasses}`}>
      <form
        id={formId}
        onSubmit={handleFormSubmit}
        className="w-full"
        noValidate
        aria-label="Form"
      >
        {/* Accessibility: Error summary */}
        {hasValidationErrors && isFormSubmitted && (
          <div className="sr-only" role="alert" aria-live="assertive">
            Form has {allErrorMessages.length} error
            {allErrorMessages.length > 1 ? "s" : ""}:{" "}
            {allErrorMessages.join(". ")}
          </div>
        )}

        {/* Form inputs */}
        <div className="space-y-6">
          {rowLayout ? renderRowLayout() : renderGridLayout()}
        </div>

        {/* Form actions */}
        <div className="flex items-center justify-end space-x-4 dark:border-gray-700">
          {showCancel && (
            <Button
              onClick={handleFormCancel}
              disabled={isLoading}
              label={cancelLabel || "Cancel"}
              variant="secondary"
              type="button"
            />
          )}
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            label={isLoading ? "Loading..." : submitLabel || "Submit"}
            aria-describedby={
              hasValidationErrors ? `${formId}-errors` : undefined
            }
          />
        </div>
      </form>
    </div>
  );
};

export default memo(Form);
