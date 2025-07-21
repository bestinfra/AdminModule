import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {  /*Total 38 colors*/
    theme: {
        colorPrimary: string;
        colorPrimaryDark: string;
        colorPrimaryAlt: string;
        colorPrimaryLight: string;
        colorPrimaryDeep: string;
        colorPrimaryDeepLight: string;
        colorPrimaryDarkLight: string;
        colorPrimaryTransparent: string;
        colorPrimaryBg: string;
        colorPrimaryBgLight: string;
        colorPrimaryLightest: string;
        colorSecondary: string;
        colorSecondaryLight: string;
        colorTextPrimary: string;
        colorTextSecondary: string;
        colorTextTertiary: string;
        colorTextQuaternary: string;
        colorPrimaryBorder: string;
        colorDarkBorder: string;
        colorSecondaryPositive: string;
        colorWarning: string;
        colorWarningAlt: string;
        colorDanger: string;
        colorDangerAlt: string;
        colorDangerLight: string;
        colorInfo: string;
        colorSubinfo: string;
        colorNeutralDark: string;
        colorNeutralDarker: string;
        colorNeutralLight: string;
        colorNeutralLightest: string;
        colorAccentLight: string;
        colorIconHover: string;
        colorGradientPrimary: string;
        colorGradientSecondary: string;
        colorStatIconGradient: string;  
        colorShadowPrimary: string;
        colorShadowSecondary: string;
    };
    updateTheme: (newTheme: Partial<ThemeContextType['theme']>) => void;
}

const defaultTheme = {
    colorPrimary: 'rgba(22, 59, 124, 1)',
    colorPrimaryDark: 'rgba(4, 19, 40, 1)',
    colorPrimaryAlt: 'rgba(22, 59, 124, 1)',
    colorPrimaryLight: 'rgba(0, 92, 142, 1)',
    colorPrimaryDeep: 'rgba(32, 45, 89, 1)',
    colorPrimaryDeepLight: 'rgba(32, 45, 89, 0.05)',
    colorPrimaryDarkLight: 'rgba(6, 21, 45, 1)',
    colorPrimaryTransparent: 'rgba(85, 181, 108, 0)',
    colorPrimaryBg: 'rgba(239, 239, 239, 1)',
    colorPrimaryBgLight: 'rgba(220, 231, 236, 1)',
    colorPrimaryLightest: 'rgba(245, 248, 252, 1)',
    colorSecondary: 'rgba(85, 181, 108, 1)',
    colorSecondaryLight: 'rgba(187, 225, 196, 1)',
    colorSecondaryPositive: 'rgba(2, 148, 71, 1)',
    colorTextPrimary: 'rgba(38, 38, 38, 1)',
    colorTextSecondary: 'rgba(126, 126, 126, 1)',
    colorTextTertiary: 'rgba(71, 97, 137, 1)',
    colorTextQuaternary: 'rgba(9, 27, 59, 1)',
    colorPrimaryBorder: 'rgb(233, 239, 255)',
    colorDarkBorder: 'rgba(9, 27, 59, 1)',
    colorWarning: 'rgba(237, 140, 34, 1)',
    colorWarningAlt: 'rgba(255, 209, 8, 1)',
    colorDanger: 'rgba(220, 39, 44, 1)',
    colorDangerAlt: 'rgba(255, 124, 92, 1)',
    colorDangerLight: 'rgba(255, 124, 92, 0.05)',
    colorInfo: 'none',
    colorSubinfo: 'rgba(71, 97, 137, 1)',
    colorNeutralDark: 'rgba(60, 60, 60, 1)',
    colorNeutralDarker: 'rgba(38, 38, 38, 1)',
    colorNeutralLight: 'rgba(174, 189, 209, 1)',
    colorNeutralLightest: ' rgba(255, 255, 255, 1)',
    colorAccentLight: 'rgba(0, 209, 178, 0.05)',
    colorIconHover:
        'brightness(0) saturate(100%) invert(15%) sepia(80%) saturate(1705%)hue-rotate(190deg) brightness(90%) contrast(105%)',
    colorGradientPrimary:
        'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
    colorGradientSecondary:
        'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))',
    colorStatIconGradient:
        'linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))',
    colorShadowPrimary: 'rgba(220, 228, 239, 1)',
    colorShadowSecondary: 'rgba(220, 228, 239, 1)',
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
        setTheme((prev) => ({
            ...prev,
            ...newTheme,
        }));
        Object.entries(newTheme).forEach(([key, value]) => {
            console.log(key, value);
            document.documentElement.style.setProperty(
                `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
                value
            );
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
