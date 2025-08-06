import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'outlineSecondary' | 'primarysmall' | 'danger' | 'warning' | 'test' | 'asset';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    children?: React.ReactNode;
    icon?: React.ReactNode;
}

// Memoize the component for better performance
const Button = React.memo<ButtonProps>(({
    label,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
    size = 'medium',
    loading = false,
    className = '',
    children,
    icon,
    ...props
}) => {
    // Base button classes
    const baseClasses = [
        'font-manrope',
        'whitespace-nowrap',
        'text-base',
        'font-bold',
        'px-8',
        'rounded-[2.5rem]',
        'cursor-pointer',
        'transition-all',
        'duration-300',
        'ease-in-out',
        'flex',
        'justify-center',
        'items-center',
        'gap-[0.6rem]',
        'h-[2.917rem]',
        'border-2',
        'w-fit',
        'border-[var(--brand-green)]',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
    ];

    // Size classes
    const sizeClasses = {
        small: [
            'h-8',
            'px-4',
            'text-sm',
            'font-semibold',
            'rounded-[1.5rem]',
        ],
        medium: [],
        large: [],
    };

    // Variant classes
    const variantClasses = {
        primary: [
            'bg-secondary',
            'text-white',
            'border-secondary',
            'hover:bg-white',
            'hover:text-secondary',
            'hover:border-secondary',
        ],
        secondary: [
            'bg-primary',
            'text-white',
            'border-primary',
            'hover:bg-white',
            'hover:text-primary',
            'hover:border-primary',
        ],
        outline: [
            'bg-primary',
            'text-white',
            'border-primary',
            'hover:bg-white',
            'hover:text-primary',
            'hover:border-primary',
        ],
        primarysmall: [
            'bg-[var(--blue-bright)]',
            'text-[var(--white)]',
            'h-8',
            'border-[var(--blue-bright)]',
        ],
        danger: [
            'bg-danger',
            'text-white',
            'px-4',
            'rounded-[2.5rem]',
            'border-danger',
            'hover:bg-danger-alt',
            'hover:border-danger-alt',
            'hover:text-danger',
            'active:bg-danger',
        ],
        warning: [
            'bg-warning',
            'text-white',
            'border-warning',
            'hover:bg-white',
            'hover:text-warning',
            'hover:border-warning',
        ],
        test: [
            'bg-[var(--background-secondary)]',
            'text-[var(--brand-green)]',
            'border-[var(--white)]',
            'hover:bg-[var(--brand-green)]',
            'hover:text-[var(--white)]',
            'hover:border-[var(--brand-green)]',
        ],
        outlineSecondary: [
            'bg-[var(--color-background-secondary)]',
            'text-gray-700',
            'border-primary-border',
            'hover:primary-border',
            'hover:text-gray-800',
            'hover:bg-[var(--color-background-secondary-hover)]',
            'hover:border-primary-border',
        ],
        asset: [
            'bg-[var(--asset-color)]',
            'text-[var(--brand-green)]',
            'border-[var(--asset-color)]',
            'hover:bg-[var(--white)]',
            'hover:text-[var(--brand-green)]',
            'hover:border-[var(--asset-color)]',
        ],
    };

    // Loading state classes
    const loadingClasses = loading ? [
        'relative',
        'text-transparent',
        'after:content-[""]',
        'after:absolute',
        'after:w-4',
        'after:h-4',
        'after:border-2',
        'after:border-transparent',
        'after:border-t-current',
        'after:rounded-full',
        'after:animate-spin',
    ] : [];

    // Combine all classes
    const allClasses = [
        ...baseClasses,
        ...sizeClasses[size],
        ...variantClasses[variant],
        ...loadingClasses,
        className,
    ].filter(Boolean).join(' ');

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            className={allClasses}
            onClick={onClick}
            disabled={isDisabled}
            {...props}
        >
            {icon && (
                <div className="flex justify-center items-center min-w-6">
                    <div className="flex items-center justify-center">
                        {icon}
                    </div>
                </div>
            )}
            {children || label}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
