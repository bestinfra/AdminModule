import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
    theme: {
        primary: string;
        'primary-50': string;
        'primary-100': string;
        'primary-200': string;
        'primary-300': string;
        'primary-400': string;
        'primary-500': string;
        'primary-600': string;
        'primary-700': string;
        'primary-800': string;
        'primary-900': string;
        'primary-950': string;

        secondary: string;
        'secondary-50': string;
        'secondary-100': string;
        'secondary-200': string;
        'secondary-300': string;
        'secondary-400': string;
        'secondary-500': string;
        'secondary-600': string;
        'secondary-700': string;
        'secondary-800': string;
        'secondary-900': string;
        'secondary-950': string;

        success: string;
        warning: string;
        error: string;
        info: string;
        muted: string;
        default: string;
        danger: string;
        skeleton: string;
    };
    updateTheme: (newTheme: Partial<ThemeContextType['theme']>) => void;
}

const defaultTheme = {
    primary: 'rgba(0, 51, 102, 1)',
    'primary-50': 'rgba(240, 245, 250, 1)',
    'primary-100': 'rgba(224, 235, 245, 1)',
    'primary-200': 'rgba(192, 215, 235, 1)',
    'primary-300': 'rgba(160, 195, 225, 1)',
    'primary-400': 'rgba(128, 175, 215, 1)',
    'primary-500': 'rgba(0, 51, 102, 1)',
    'primary-600': 'rgba(0, 41, 82, 1)',
    'primary-700': 'rgba(0, 31, 62, 1)',
    'primary-800': 'rgba(0, 21, 42, 1)',
    'primary-900': 'rgba(0, 11, 22, 1)',
    'primary-950': 'rgba(0, 5, 10, 1)',

    secondary: 'rgba(51, 51, 51, 1)',
    'secondary-50': 'rgba(250, 250, 250, 1)',
    'secondary-100': 'rgba(230, 230, 230, 1)',
    'secondary-200': 'rgba(180, 180, 180, 1)',
    'secondary-300': 'rgba(128, 128, 128, 1)',
    'secondary-400': 'rgba(77, 77, 77, 1)',
    'secondary-500': 'rgba(51, 51, 51, 1)',
    'secondary-600': 'rgba(38, 38, 38, 1)',
    'secondary-700': 'rgba(26, 26, 26, 1)',
    'secondary-800': 'rgba(18, 18, 18, 1)',
    'secondary-900': 'rgba(13, 13, 13, 1)',
    'secondary-950': 'rgba(8, 8, 8, 1)',

    success: 'rgba(46, 213, 115, 1)',
    warning: 'rgba(255, 171, 0, 1)',
    error: 'rgba(255, 71, 87, 1)',
    info: 'rgba(0, 122, 255, 1)',
    muted: 'rgb(239 239 239)',
    default: 'rgba(51, 51, 51, 1)',
    danger: 'rgba(255, 71, 87, 1)',
    skeleton: 'rgb(239 239 245)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: Partial<ThemeContextType['theme']>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    initialTheme = {},
}) => {
    const [theme, setTheme] = useState({
        ...defaultTheme,
        ...initialTheme,
    });

    const updateTheme = (newTheme: Partial<ThemeContextType['theme']>) => {
        const synchronizedTheme = { ...newTheme };

        if ('primary' in newTheme) {
            synchronizedTheme['primary-500'] = newTheme.primary;
        }
        if ('primary-500' in newTheme) {
            synchronizedTheme.primary = newTheme['primary-500'];
        }

        if ('secondary' in newTheme) {
            synchronizedTheme['secondary-500'] = newTheme.secondary;
        }
        if ('secondary-500' in newTheme) {
            synchronizedTheme.secondary = newTheme['secondary-500'];
        }

        setTheme((prev) => ({
            ...prev,
            ...synchronizedTheme,
        }));

        Object.entries(synchronizedTheme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--color-${key}`, value);
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
