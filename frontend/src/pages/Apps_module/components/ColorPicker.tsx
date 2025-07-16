import React from 'react';

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
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-main dark:text-white mb-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="flex gap-3 flex-wrap mt-2 p-4 bg-gray-50 dark:bg-primary-dark-light rounded-lg border border-gray-200 dark:border-dark-border">
        {options.map((option) => (
          <label 
            key={option.value}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white dark:hover:bg-primary-dark transition-colors"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="sr-only"
            />
            <div
              className={`w-10 h-10 rounded-full border-3 transition-all ${
                value === option.value 
                  ? 'border-main dark:border-white ring-2 ring-primary' 
                  : 'border-gray-300 dark:border-dark-border'
              }`}
              style={{ backgroundColor: option.color }}
              title={option.label}
            />
          </label>
        ))}
      </div>
      {error && <span className="text-error text-xs mt-1 block">{error}</span>}
    </div>
  );
};

export default ColorPicker; 