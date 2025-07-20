import React, { useState, useEffect } from 'react';

interface ColorOption {
  value: string;
  label: string;
  color: string;
}

interface ColorPickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  options: ColorOption[];
  required?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: string) => string | null;
  };
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  required = false,
  disabled = false,
  showLabel = true,
  validation,
}) => {
  const defaultColor = options[0]?.value || '#55b56c';
  const [selectedColor, setSelectedColor] = useState(value || defaultColor);
  const [hexValue, setHexValue] = useState(value || defaultColor);
  const [rgbaValues, setRgbaValues] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Default validation rules
  const defaultValidation = {
    pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    custom: (value: string) => {
      if (required && (!value || value.trim() === '')) {
        return `${label} is required`;
      }
      if (value && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        return `${label} must be a valid hex color (e.g.,rgb(6, 77, 185))`;
      }
      return null;
    }
  };

  // Merge custom validation with default validation
  const finalValidation = {
    ...defaultValidation,
    ...validation,
    custom: (value: string) => {
      // Run default validation first
      const defaultError = defaultValidation.custom(value);
      if (defaultError) return defaultError;
      
      // Run custom validation if provided
      if (validation?.custom) {
        return validation.custom(value);
      }
      
      return null;
    }
  };

  // Validate color value
  const validateColor = (colorValue: string): string | null => {
    if (finalValidation.custom) {
      return finalValidation.custom(colorValue);
    }
    return null;
  };

  useEffect(() => {
    if (value) {
      setSelectedColor(value);
      setHexValue(value);
      // Validate on value change
      const error = validateColor(value);
      setValidationError(error);
    }
  }, [value]);

  const hexToRgba = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
      };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
  };

  useEffect(() => {
    const rgba = hexToRgba(selectedColor);
    setRgbaValues(rgba);
  }, [selectedColor]);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    setHexValue(newColor);
    
    // Validate the new color
    const validationError = validateColor(newColor);
    setValidationError(validationError);
    
    onChange({
      target: {
        name,
        value: newColor
      }
    } as any);
  };

  const handleColorCircleClick = () => {
    if (!disabled) {
      const colorInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (colorInput) {
        colorInput.click();
      }
    }
  };

  // Show either prop error or validation error
  const displayError = error || validationError;

  return (
    <div>
      <div className="flex flex-col gap-2">
        {showLabel && (
          <label className="block text-sm font-medium text-main dark:text-white">
            {label} {required && <span className="text-error">*</span>}
          </label>
        )}
        <div className="flex items-end gap-4">
          <div className="relative w-12 h-12">
            {!disabled && (
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorPickerChange}
                className="colorPicker absolute inset-0 w-full h-full opacity-0 cursor-pointer outline-none"
              />
            )}
            <div 
              className={`w-full h-full rounded-full border-2 transition-all duration-200 ${
                displayError 
                  ? 'border-red-500' 
                  : 'border-gray-300 dark:border-dark-border'
              } ${
                !disabled ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-75'
              }`}
              style={{ backgroundColor: selectedColor }}
              onClick={handleColorCircleClick}

            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              HEX {required && <span className="text-error">*</span>}
            </label>
            <div className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium w-23 text-center">
              {hexValue}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400">R</div>
              <div className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium min-w-[40px] text-center">
                {rgbaValues.r}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400">G</div>
              <div className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium min-w-[40px] text-center">
                {rgbaValues.g}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400">B</div>
              <div className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium min-w-[40px] text-center">
                {rgbaValues.b}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400">A</div>
              <div className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium min-w-[40px] text-center">
                {rgbaValues.a}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {displayError && <span className="text-danger text-xs mt-1 block">{displayError}</span>}
    </div>
  );
};

export default ColorPicker; 