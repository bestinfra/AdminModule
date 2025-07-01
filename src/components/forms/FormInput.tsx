import React from 'react';

interface FormInputProps {
    label?: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    icon?: React.ReactNode;
    error?: string;
    name?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    className = '',
    icon,
    error,
    name
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="text-gray-400">
                            {icon}
                        </div>
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={e => {
                        console.log('FormInput onChange:', e.target.name, e.target.value);
                        onChange && onChange(e);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    name={name}
                    className={`
                        w-full px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${icon ? 'pl-10' : ''}
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                        ${error ? 'border-red-500' : 'border-gray-300'}
                        ${className}
                    `}
                />
            </div>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormInput; 