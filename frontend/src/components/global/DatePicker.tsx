import React, { useRef, type ChangeEvent, useState } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string | null;
    name?: string;
    label?: string;
    min?: string;
    max?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder = 'Select Date',
    className = '',
    disabled = false,
    required = false,
    error = null,
    name = 'date',
    label,
    min,
    max
}) => {
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const [errorState] = useState<string | null>(error);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
    };



    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-neutral dark:text-neutral-light mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={dateInputRef}
                    type="date"
                    name={name}
                    value={value}
                    onChange={handleDateChange}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    className={`w-full py-3 px-4 border border-primary-border dark:border-dark-border rounded-full shadow-sm text-base dark:text-white placeholder-dark-border dark:placeholder-white focus:outline-none focus:ring-2 dark:focus:ring-blue-500 dark:bg-primary-dark ${errorState ? 'border-red-300' : 'border-gray-300'} ${disabled ? 'bg-gray-100 text-gray-400' : ''}`}
                    disabled={disabled}
                    required={required}
                />
            </div>
            
            {/* Error message */}
            {errorState && (
                <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errorState}
                </div>
            )}
        </div>
    );
};

export default DatePicker; 