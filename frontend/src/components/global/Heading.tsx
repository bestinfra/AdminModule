import React from 'react';

interface HeadingProps {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    size?:
        | 'xs'
        | 'sm'
        | 'base'
        | 'lg'
        | 'xl'
        | '2xl'
        | '3xl'
        | '4xl'
        | '5xl'
        | '6xl';
    variant?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'muted'
        | 'success'
        | 'warning'
        | 'danger';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    align?: 'left' | 'center' | 'right' | 'justify';
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    truncate?: boolean;
    uppercase?: boolean;
    underline?: boolean;
    italic?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
    text,
    level = 1,
    size,
    variant = 'default',
    weight,
    align = 'left',
    className = '',
    children,
    onClick,
    truncate = false,
    uppercase = false,
    underline = false,
    italic = false,
}) => {
    // Default sizes based on heading level
    const defaultSizes = {
        1: 'text-4xl',
        2: 'text-3xl',
        3: 'text-2xl',
        4: 'text-xl',
        5: 'text-lg',
        6: 'text-base',
    };

    // Default weights based on heading level
    const defaultWeights = {
        1: 'font-bold',
        2: 'font-bold',
        3: 'font-semibold',
        4: 'font-semibold',
        5: 'font-medium',
        6: 'font-medium',
    };

    // Size classes
    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
    };

    // Weight classes
    const weightClasses = {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
    };

    // Variant classes
    const variantClasses = {
        default: 'text-gray-900 dark:text-white',
        primary: 'text-primary dark:text-primary-light',
        secondary: 'text-gray-700 dark:text-gray-300',
        muted: 'text-gray-500 dark:text-gray-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        danger: 'text-red-600 dark:text-red-400',
    };

    // Alignment classes
    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
    };

    // Build class names
    const classes = [
        // Size
        size ? sizeClasses[size] : defaultSizes[level],
        // Weight
        weight ? weightClasses[weight] : defaultWeights[level],
        // Variant
        variantClasses[variant],
        // Alignment
        alignClasses[align],
        // Utilities
        truncate && 'truncate',
        uppercase && 'uppercase',
        underline && 'underline',
        italic && 'italic',
        // Interactive
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        // Custom classes
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Heading elements
    const headingElements = {
        1: 'h1',
        2: 'h2',
        3: 'h3',
        4: 'h4',
        5: 'h5',
        6: 'h6',
    };

    const Tag = headingElements[level] as keyof JSX.IntrinsicElements;

    return (
        <Tag className={classes} onClick={onClick}>
            {children || text}
        </Tag>
    );
};

export default Heading;
