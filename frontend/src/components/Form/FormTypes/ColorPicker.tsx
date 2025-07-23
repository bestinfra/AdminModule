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
  allowGradient?: boolean; // NEW PROP
  width?: number; // NEW PROP for preview circle width in px
  gradientInputWidth?: number | string; // Accept number (px) or 'full'/'100%'
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
  allowGradient = false, // NEW PROP
  width = 48, // Default width 48px
  gradientInputWidth = 160, // Default input width for gradient/rgba/hex
}) => {
  const defaultColor = options[0]?.value || '#55b56c';
  const [selectedColor, setSelectedColor] = useState(value || defaultColor);
  const [hexValue, setHexValue] = useState(value || defaultColor);
  const [rgbaValues, setRgbaValues] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [validationError, setValidationError] = useState<string | null>(null);
  // Remove isGradient and toggle logic. Use allowGradient prop to determine mode.
  // Remove: const [isGradient, setIsGradient] = useState(false);
  // Remove: const [gradientValue, setGradientValue] = useState(...);

  // Default validation rules
  const defaultValidation = {
    pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    custom: (value: string) => {
      if (required && (!value || value.trim() === '')) {
        return `${label} is required`;
      }
      if (value && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        return `${label} must be a valid hex color (e.g., #064db9)`;
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
    if (allowGradient) {
      // Basic validation for gradient string or rgba/hex
      if (
        colorValue.startsWith('linear-gradient') ||
        colorValue.startsWith('radial-gradient') ||
        colorValue.startsWith('rgba(')
      ) {
        return null;
      }
      // Accept hex as well for allowGradient
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
        return null;
      }
      return 'Enter a valid CSS gradient, rgba, or hex color string';
    }
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
    // Only update RGBA if not gradient/rgba
    if (!allowGradient && selectedColor) {
      const rgba = hexToRgba(selectedColor);
      setRgbaValues(rgba);
    }
  }, [selectedColor, allowGradient]);

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

  const handleGradientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGradient = e.target.value;
    setSelectedColor(newGradient);
    setHexValue(newGradient);
    // Validate the new gradient
    const validationError = validateColor(newGradient);
    setValidationError(validationError);
    onChange({
      target: {
        name,
        value: newGradient
      }
    } as any);
  };

  const handleColorCircleClick = () => {
    if (!disabled && !allowGradient) {
      const colorInput = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (colorInput) {
        colorInput.click();
      }
    }
  };

  // Show either prop error or validation error
  const displayError = error || validationError;

  // Compute input style and class for gradient input
  let gradientInputStyle = {};
  let gradientInputClass = "px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium text-center";
  if (gradientInputWidth === 'full' || gradientInputWidth === '100%') {
    gradientInputStyle = { width: '100%' };
    gradientInputClass += ' w-full';
  } else if (typeof gradientInputWidth === 'number') {
    gradientInputStyle = { width: gradientInputWidth };
  }

  return (
    <div className='w-full'>
      <div className="flex flex-col gap-2 w-full">
        {showLabel && (
          <label className="block text-sm font-medium text-main dark:text-white">
            {label} {required && <span className="text-error">*</span>}
          </label>
        )}
        <div className="flex items-end gap-4">
          <div className="relative" style={{ width, height: width }}>
            {!disabled && !allowGradient && (
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
              style={{ background: allowGradient ? selectedColor : selectedColor, width, height: width }}
              onClick={handleColorCircleClick}
            />
          </div>
          {!allowGradient && (
            <div >
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 w-full">
                HEX {required && <span className="text-error">*</span>}
              </label>
              <div className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium w-23 text-center">
                {hexValue}
              </div>
            </div>
          )}
          {allowGradient && (
            <div className='w-full'>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 w-full">
                Gradient / RGBA / HEX
              </label>
              <input
                type="text"
                value={selectedColor}
                onChange={handleGradientChange}
                className={gradientInputClass}
                placeholder="linear-gradient(...) or rgba(...) or #..."
                disabled={disabled}
                style={gradientInputStyle}
              />
            </div>
          )}
          {!allowGradient && (
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
          )}
        </div>
      </div>
      {displayError && <span className="text-danger text-xs mt-1 block">{displayError}</span>}
    </div>
  );
};

export default ColorPicker; 