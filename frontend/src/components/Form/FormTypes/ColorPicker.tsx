import React, { useState, useEffect, useRef } from 'react';

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
  gradientColorOptions?: { light: ColorOption[]; dark: ColorOption[] }; // NEW PROP
  currentMode?: 'light' | 'dark'; // NEW PROP
}

// Helper to extract and update degree in linear-gradient string
function getGradientDegree(gradient: string): number {
  const match = gradient.match(/linear-gradient\((\d+)deg/);
  return match ? parseInt(match[1], 10) : 90;
}
function setGradientDegree(gradient: string, degree: number): string {
  return gradient.replace(/linear-gradient\((\d+)deg/, `linear-gradient(${degree}deg`);
}
function getGradientColors(gradient: string): [string, string] {
  // Matches: linear-gradient(135deg, #color1, #color2)
  const match = gradient.match(/linear-gradient\([^,]+,\s*([^,]+),\s*([^\)]+)\)/);
  if (match) return [match[1].trim(), match[2].trim()];
  return ['#ffffff', '#000000'];
}
function setGradientColors(gradient: string, color1: string, color2: string): string {
  return gradient.replace(/(linear-gradient\([^,]+,\s*)([^,]+)(,\s*)([^\)]+)(\))/, `$1${color1}$3${color2}$5`);
}

const CircularDegreePicker: React.FC<{
  degree: number;
  onChange: (deg: number) => void;
  size?: number;
}> = ({ degree, onChange, size = 48 }) => {
  const circleRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const getAngleFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = circleRef.current?.getBoundingClientRect();
    if (!rect) return degree;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 450) % 360; // 0deg is up
    return Math.round(angle);
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    onChange(getAngleFromEvent(e));
    e.preventDefault();
  };
  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    let angle = 0;
    if ('touches' in e && e.touches.length > 0) {
      angle = getAngleFromEvent(e as any);
    } else if ('clientX' in e) {
      angle = getAngleFromEvent(e as any);
    }
    onChange(angle);
  };
  const handlePointerUp = () => setDragging(false);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: any) => handlePointerMove(e);
    const up = () => handlePointerUp();
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  // Knob position
  const r = size / 2 - 8;
  const rad = ((degree - 90) * Math.PI) / 180;
  const x = size / 2 + r * Math.cos(rad);
  const y = size / 2 + r * Math.sin(rad);

  return (
    <svg
      ref={circleRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="#f3f4f6" stroke="#ccc" strokeWidth="2" />
      <line x1={size / 2} y1={size / 2} x2={x} y2={y} stroke="#007bff" strokeWidth="3" />
      <circle cx={x} cy={y} r="6" fill="#007bff" />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="14" fill="#222">{degree}°</text>
    </svg>
  );
};

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
  gradientColorOptions = { light: [], dark: [] }, // NEW PROP
  currentMode = 'light', // NEW PROP
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

  // For gradient color dropdowns
  const isLinearGradient = allowGradient && value.startsWith('linear-gradient');
  const [color1, color2] = isLinearGradient ? getGradientColors(value) : ['#ffffff', '#000000'];

  return (
    <div className='w-full'>
      <div className="flex flex-col gap-2 w-full">
        {showLabel && (
          <label className="block text-sm font-medium text-main dark:text-white">
            {isLinearGradient ? 'Linear-Gradient / RGBA / HEX' : label} {required && <span className="text-error">*</span>}
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
          {allowGradient && isLinearGradient && (
            <div className='w-full flex flex-row items-center gap-4'>
              <div className="flex flex-col items-center justify-between min-h-[56px]" style={{ minWidth: 64, maxWidth: 100 }}>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 text-center mb-1">Angle</label>
                <div className="flex-1 flex items-center justify-center">
                  <CircularDegreePicker
                    degree={getGradientDegree(selectedColor)}
                    onChange={deg => {
                      const newGradient = setGradientDegree(selectedColor, deg);
                      setSelectedColor(newGradient);
                      setHexValue(newGradient);
                      setValidationError(validateColor(newGradient));
                      onChange({ target: { name, value: newGradient } } as any);
                    }}
                    size={40}
                  />
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Color 1</label>
                <select
                  className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium min-w-[64px] max-w-[100px]"
                  value={color1}
                  onChange={e => {
                    const newGradient = setGradientColors(selectedColor, e.target.value, color2);
                    setSelectedColor(newGradient);
                    setHexValue(newGradient);
                    setValidationError(validateColor(newGradient));
                    onChange({ target: { name, value: newGradient } } as any);
                  }}
                  disabled={disabled}
                >
                  {gradientColorOptions[currentMode].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col gap-1'>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">Color 2</label>
                <select
                  className="px-2 py-1 bg-white dark:bg-primary-dark border border-gray-300 dark:border-dark-border rounded text-base font-medium min-w-[64px] max-w-[100px]"
                  value={color2}
                  onChange={e => {
                    const newGradient = setGradientColors(selectedColor, color1, e.target.value);
                    setSelectedColor(newGradient);
                    setHexValue(newGradient);
                    setValidationError(validateColor(newGradient));
                    onChange({ target: { name, value: newGradient } } as any);
                  }}
                  disabled={disabled}
                >
                  {gradientColorOptions[currentMode].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {allowGradient && !isLinearGradient && (
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