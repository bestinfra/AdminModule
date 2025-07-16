import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {
    theme: {
        colorBorder: string;
        colorDarkBorder: string;
        colorBackgroundSecondary: string;
        colorBrandBlue: string;
        colorGrey: string;
        colorAccent: string;
        colorIconHover: string;
        colorTextPrimary: string;
        colorTextSecondary: string;
        colorTextTertiary: string;
        colorTextQuaternary: string;
        colorPrimary: string;
        colorPrimaryDark: string;
        colorPrimaryLight: string;
        colorPrimaryBg: string;
        colorPrimaryDeep: string;
        colorPrimaryDeepLight: string;
        colorPrimaryBgLight: string;
        colorPrimaryLightest: string;
        colorPrimaryDarkLight: string;
        colorSecondary: string;
        colorSecondaryLight: string;
        colorPositive: string;
        colorWarning: string;
        colorWarningAlt: string;
        colorDanger: string;
        colorDangerAlt: string;
        colorDangerLight: string;
        colorAccentLight: string;
        colorNeutral: string;
        colorNeutralDark: string;
        colorNeutralDarker: string;
        colorNeutralLight: string;
        colorSurface: string;
        colorInfo: string;
        colorSubinfo: string;
        colorPrimaryBorder: string;
        colorDarkBorder2: string;
        colorGradientPrimary: string;
        colorGradientSecondary: string;
        colorPrimaryTransparent: string;
        colorTest: string;
        colorCustomPrimary: string;
        colorCustomSecondary: string;
        colorCustomWarning: string;
        colorCustomDanger: string;
        colorCustomAccent: string;
        colorCustomNeutral: string;
        colorCustomSurface: string;
        colorCustomPrimaryLight: string;
        colorCustomSecondaryLight: string;
        colorCustomWarningLight: string;
        colorCustomDangerLight: string;
        colorCustomAccentLight: string;
        colorCustomNeutralLight: string;
        colorCustomSurfaceLight: string;
        colorShadowPrimary: string;
        colorShadowSecondary: string;
        colorStatIconGradient: string;
    };
    updateTheme: (newTheme: Partial<ThemeContextType['theme']>) => void;
}

const defaultTheme = {
    colorBorder: 'rgba(233, 239, 255, 1)',
    colorDarkBorder: 'rgba(9, 27, 59, 1)',
    colorBackgroundSecondary: 'rgba(245, 248, 252, 1)',
    colorBrandBlue: 'rgba(22, 59, 124, 1)',
    colorGrey: 'rgba(126, 126, 126, 1)',
    colorAccent: 'rgba(71, 97, 137, 1)',
    colorIconHover:
        'brightness(0) saturate(100%) invert(15%) sepia(80%) saturate(1705%)hue-rotate(190deg) brightness(90%) contrast(105%)',
    colorTextPrimary: 'rgba(38, 38, 38, 1)',
    colorTextSecondary: 'rgba(126, 126, 126, 1)',
    colorTextTertiary: 'rgba(71, 97, 137, 1)',
    colorTextQuaternary: 'rgba(9, 27, 59, 1)',
    colorPrimary: 'rgba(22, 59, 124, 1)',
    colorPrimaryDark: 'rgba(4, 19, 40, 1)',
    colorPrimaryLight: 'rgba(0, 92, 142, 1)',
    colorPrimaryBg: 'rgba(239, 239, 239, 1)',
    colorPrimaryDeep: 'rgba(32, 45, 89, 1)',
    colorPrimaryDeepLight: 'rgba(32, 45, 89, 0.05)',
    colorPrimaryBgLight: 'rgba(220, 231, 236, 1)',
    colorPrimaryLightest: 'rgba(245, 248, 252, 1)',
    colorPrimaryDarkLight: 'rgba(6, 21, 45, 1)',
    colorSecondary: 'rgba(85, 181, 108, 1)',
    colorSecondaryLight: 'rgba(187, 225, 196, 1)',
    colorPositive: 'rgba(2, 148, 71, 1)',
    colorWarning: 'rgba(237, 140, 34, 1)',
    colorWarningAlt: 'rgba(255, 209, 8, 1)',
    colorDanger: 'rgba(220, 39, 44, 1)',
    colorDangerAlt: 'rgba(255, 124, 92, 1)',
    colorDangerLight: 'rgba(255, 124, 92, 0.05)',
    colorAccentLight: 'rgba(0, 209, 178, 0.05)',
    colorNeutral: 'rgba(126, 126, 126, 1)',
    colorNeutralDark: 'rgba(60, 60, 60, 1)',
    colorNeutralDarker: 'rgba(38, 38, 38, 1)',
    colorNeutralLight: 'rgba(174, 189, 209, 1)',
    colorSurface: 'rgba(255, 255, 255, 1)',
    colorInfo: 'none',
    colorSubinfo: 'rgba(71, 97, 137, 1)',
    colorPrimaryBorder: 'rgb(233, 239, 255)',
    colorDarkBorder2: 'rgba(9, 27, 59, 1)',
    colorGradientPrimary:
        'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
    colorGradientSecondary:
        'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))',
    colorPrimaryTransparent: 'rgba(85, 181, 108, 0)',
    colorTest: 'rgba(63, 104, 178, 1)',
    colorCustomPrimary: 'rgba(32, 45, 89, 1)',
    colorCustomSecondary: 'rgba(85, 181, 108, 1)',
    colorCustomWarning: 'rgba(237, 140, 34, 1)',
    colorCustomDanger: 'rgba(220, 39, 44, 1)',
    colorCustomAccent: 'rgba(0, 209, 178, 1)',
    colorCustomNeutral: 'rgba(126, 126, 126, 1)',
    colorCustomSurface: 'rgba(255, 255, 255, 1)',
    colorCustomPrimaryLight: 'rgba(32, 45, 89, 0.8)',
    colorCustomSecondaryLight: 'rgba(85, 181, 108, 0.8)',
    colorCustomWarningLight: 'rgba(237, 140, 34, 0.8)',
    colorCustomDangerLight: 'rgba(220, 39, 44, 0.8)',
    colorCustomAccentLight: 'rgba(0, 209, 178, 0.8)',
    colorCustomNeutralLight: 'rgba(126, 126, 126, 0.8)',
    colorCustomSurfaceLight: 'rgba(255, 255, 255, 0.8)',
    colorShadowPrimary: 'rgba(220, 228, 239, 1)',
    colorShadowSecondary: 'rgba(220, 228, 239, 1)',
    colorStatIconGradient:
        'linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))',
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
