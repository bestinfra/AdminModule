import React, { useState, useCallback, useRef, useMemo, memo, useImperativeHandle, forwardRef } from "react";
import Button from "@components/global/Button";
import FormInput from "./FormInput";
import type {
  FormProps,
  FormInputConfig,
  FormInputValue,
  FormRef,
} from "@components/Form/types";
import {
  getDefaultValue,
  formatPhone,
} from "@components/Form/utils";
import { validateFormData, validateField as validateFieldZod } from "./zodValidation";
import { z } from 'zod';

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
  showErrorsByDefault: boolean = false,
  customSchema?: import('zod').ZodSchema<any>
) => {
  const validateAllFields = useCallback(() => {
    if (customSchema) {
      try {
        customSchema.parse(formValues);
        return { errors: {}, hasErrors: false };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err: z.ZodIssue) => {
            const fieldName = err.path.join('.');
            errors[fieldName] = err.message;
          });
          return { errors, hasErrors: true };
        }
        return { errors: { general: 'Validation failed' }, hasErrors: true };
      }
    }
    const result = validateFormData(formValues, inputs);
    return {
      errors: result.errors,
      hasErrors: !result.success
    };
  }, [formValues, inputs, customSchema]);

  const validateSingleField = useCallback(
    (
      _inputName: string,
      inputValue: FormInputValue,
      inputConfig: FormInputConfig
    ) => {
      return validateFieldZod(inputValue, inputConfig);
    },
    []
  );

  const shouldShowError = useCallback(
    (inputName: string, error: string) => {
      return !!(error && (showErrorsByDefault || touchedInputs.has(inputName) || isFormSubmitted));
    },
    [touchedInputs, isFormSubmitted, showErrorsByDefault]
  );

  return {
    validateAllFields,
    validateSingleField,
    shouldShowError,
  };
};

// Helper function to format input value
const formatInputValue = (inputName: string, inputValue: FormInputValue): FormInputValue => {
  if ((inputName === "phone" || inputName === "mobile") && typeof inputValue === "string") {
    return formatPhone(inputValue);
  }
  return inputValue;
};

// Helper function to render form input
const renderFormInput = (
  inputConfig: FormInputConfig,
  formValues: Record<string, FormInputValue>,
  validationErrors: Record<string, string>,
  shouldShowError: (name: string, error: string) => boolean,
  handleInputValueChange: (name: string, value: FormInputValue, config: FormInputConfig) => void,
  handleInputBlur: (name: string, value: FormInputValue, config: FormInputConfig) => void,
  fileInputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>
) => (
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
  />
);

const Form = forwardRef<FormRef, FormProps>(({
  inputs,
  onSubmit,
  submitLabel,
  cancelLabel,
  className,
  formBackground,
  gridLayout,
  formId,
  initialData,
  errorMessages: initialErrorMessages,
  touchedFields: initialTouchedFields,
  submitted: initialSubmitted,
  customSchema,
  showErrorsByDefault = true,
  onChange,
  showFormActions,
  submitAction,
  cancelAction,
  padding,
  border,
  actionsClassName,
}, ref) => {
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
    useFormValidation(formValues, inputs, touchedInputs, isFormSubmitted, showErrorsByDefault, customSchema);

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    getFormValues: () => formValues,
    getValidationErrors: () => validationErrors,
    hasErrors: () => Object.values(validationErrors).some(error => !!error),
    submit: () => {
      setIsFormSubmitted(true);
      const { errors, hasErrors } = validateAllFields();
      setValidationErrors(errors);
      if (!hasErrors) {
        if (submitAction) {
          submitAction();
        } else {
          onSubmit(formValues);
        }
      }
    },
    reset: resetForm,
    validate: () => {
      const { errors, hasErrors } = validateAllFields();
      return { success: !hasErrors, errors };
    },
  }), [formValues, validationErrors, validateAllFields, onSubmit, resetForm, submitAction]);

  // Input change handler
  const handleInputValueChange = useCallback(
    (
      inputName: string,
      inputValue: FormInputValue,
      inputConfig: FormInputConfig
    ) => {
      const formattedInputValue = formatInputValue(inputName, inputValue);

      setFormValues((prev) => {
        const updatedFormValues = { ...prev, [inputName]: formattedInputValue };
        onChange?.(updatedFormValues);
        return updatedFormValues;
      });

      // Mark field as touched and validate
      setTouchedInputs((prev) => new Set([...prev, inputName]));
      const fieldError = validateSingleField(inputName, formattedInputValue, inputConfig);
      setValidationErrors((prev) => ({
        ...prev,
        [inputName]: fieldError || "",
      }));
    },
    [setFormValues, setTouchedInputs, setValidationErrors, validateSingleField, onChange]
  );

  // Input blur handler
  const handleInputBlur = useCallback(
    (
      inputName: string,
      inputValue: FormInputValue,
      inputConfig: FormInputConfig
    ) => {
      setTouchedInputs((prev) => new Set(prev).add(inputName));
      const fieldError = validateSingleField(inputName, inputValue, inputConfig);
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
        if (submitAction) {
          submitAction();
        } else {
          onSubmit(formValues);
        }
      }
    },
    [submitAction, validateAllFields, setValidationErrors, setIsFormSubmitted, onSubmit, formValues]
  );

  // Form cancel handler
  const handleFormCancel = useCallback(() => {
    if (cancelAction) {
      cancelAction();
      return;
    }
    resetForm();
  }, [cancelAction, resetForm]);

  // Layout rendering functions
  const renderDefaultGridLayout = useCallback(() => (
    <div className="grid gap-6 grid-cols-3">
      {inputs.map((inputConfig) => 
        renderFormInput(
          inputConfig,
          formValues,
          validationErrors,
          shouldShowError,
          handleInputValueChange,
          handleInputBlur,
          fileInputRefs
        )
      )}
    </div>
  ), [
    inputs,
    formValues,
    validationErrors,
    shouldShowError,
    handleInputValueChange,
    handleInputBlur,
    fileInputRefs,
  ]);

  const renderDynamicGridLayout = useCallback(() => {
    if (!gridLayout) return null;

    const {
      gridRows,
      gridColumns,
      gap = "gap-4",
      className = "",
    } = gridLayout;

    // Group inputs by row
    const inputsGroupedByRow = inputs.reduce((acc, inputConfig) => {
      const rowNumber = inputConfig.row || 1;
      if (!acc[rowNumber]) acc[rowNumber] = [];
      acc[rowNumber].push(inputConfig);
      return acc;
    }, {} as Record<number, FormInputConfig[]>);

    return (
      <div className={`grid grid-cols-${gridColumns} ${gap} ${className}`}>
        {Array.from({ length: gridRows }, (_, rowIndex) => {
          const rowNumber = rowIndex + 1;
          const inputsInThisRow = inputsGroupedByRow[rowNumber] || [];
          const sortedRowInputs = inputsInThisRow.sort(
            (a, b) => (a.col || 1) - (b.col || 1)
          );

          return (
            <React.Fragment key={rowNumber}>
              {sortedRowInputs.map((inputConfig) => {
                const columnSpan = inputConfig.colSpan || 1;
                const startCol = inputConfig.col || 1;
                
                return (
                  <div 
                    key={inputConfig.name} 
                    className={`col-start-${startCol} col-span-${columnSpan} w-full `}
                  >
                    {renderFormInput(
                      inputConfig,
                      formValues,
                      validationErrors,
                      shouldShowError,
                      handleInputValueChange,
                      handleInputBlur,
                      fileInputRefs
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [
    gridLayout,
    inputs,
    formValues,
    validationErrors,
    shouldShowError,
    handleInputValueChange,
    handleInputBlur,
    fileInputRefs,
  ]);

  // Error summary for accessibility
  const allErrorMessages = Object.values(validationErrors).filter(Boolean);
  const hasValidationErrors = allErrorMessages.length > 0;

  // Form container classes
  const defaultPadding = 'p-4';
  const defaultBorder = 'border border-primary-border dark:border-dark-border';
  const defaultClasses = `bg-white dark:bg-gray-800 rounded-2xl ${border || defaultBorder} ${padding || defaultPadding}`;
  
  // Use formBackground prop if provided, otherwise use default background
  const backgroundClass = formBackground || defaultClasses;
  
  const formContainerClasses = `${backgroundClass}${className ? ' ' + className : ''}`;

  return (
    <div className={`w-full ${formContainerClasses}`}>
      <form
        id={formId}
        onSubmit={handleFormSubmit}
        className="w-full flex flex-col gap-4"
        noValidate
        aria-label="Form"
      >
        {/* Accessibility: Error summary */}
        {hasValidationErrors && isFormSubmitted && (
          <div className="sr-only" role="alert" aria-live="assertive">
            Form has {allErrorMessages.length} error
            {allErrorMessages.length > 1 ? "s" : ""}: {" "}
            {allErrorMessages.join(". ")}
          </div>
        )}

        {/* Form inputs */}
        <div className="space-y-6">
          {gridLayout ? renderDynamicGridLayout() : renderDefaultGridLayout()}
        </div>

        {/* Form actions */}
        {showFormActions && (
          <div className={actionsClassName || "flex items-center justify-end space-x-4 dark:border-gray-700"}>
            {cancelLabel !== "" && cancelLabel !== undefined && (
              <Button
                onClick={handleFormCancel}
                label={cancelLabel || "Cancel"}
                variant="secondary"
                type="button"
              />
            )}
            <Button
              type="submit"
              variant="primary"
              label={submitLabel || "Submit"}
              aria-describedby={
                hasValidationErrors ? `${formId}-errors` : undefined
              }
            />
          </div>
        )}
      </form>
    </div>
  );
});

Form.displayName = 'Form';

export default memo(Form);
