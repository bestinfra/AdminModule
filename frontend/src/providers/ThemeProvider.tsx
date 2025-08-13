import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ThemeContextType {  /*Total 38 colors*/
    theme: {
        // Primary brand colors
      
        colorPrimary: string;              // Main brand color (blue)
        colorPrimaryAlt: string;           // Alternative primary color
        colorPrimaryLight: string;         // Lighter shade of primary
        colorPrimaryDeep: string;          // Deep/dark primary variant
        colorPrimaryDeepLight: string;     // Light version of deep primary c
        colorPrimaryTransparent: string;   // Transparent primary for overlays
        colorPrimaryBg: string;            // Primary background color
        colorPrimaryBgLight: string;       // Light primary background
        colorPrimaryLightest: string;      // Lightest primary shade
        
        // Secondary green brand colors
        colorSecondary: string;            // Secondary brand color (green)
        colorSecondaryLight: string;       // Light secondary color
        colorSecondaryPositive: string;    // Positive action color
        colorSecondaryLightestTransperent:string;
        
        // Text colors
        colorTextPrimary: string;          // Main text color
        colorTextSecondary: string;        // Secondary text color
       
        
        // Border colors
        colorPrimaryBorder: string;        // Primary border color
    
        
        // Status colors
        colorWarning: string;              // Warning/alert color
        colorWarningAlt: string;           // Alternative warning color
        colorDanger: string;               // Error/danger color
        colorDangerAlt: string;            // Alternative danger color
        colorDangerLight: string;          // Light danger color
        colorInfo: string;                 // Information color
        
        // Neutral colors
        colorNeutralDark: string;          // Dark neutral color
        colorNeutralDarker: string;        // Darker neutral color
        colorNeutralLightest: string;      // Lightest neutral color
        
        // Accent and special colors
        colorAccentLight: string;          // Light accent color
        colorIconHover: string;            // Icon hover filter
      
        
        // Shadow colors
        colorShadowPrimary: string;        // Primary shadow color
        colorShadowSecondary: string;      // Secondary shadow color

       // gradient light theme 
       colorPrimaryGradient: string;      // Primary gradient
       colorGradientSecondary: string;    // Secondary gradient
       colorStatIconGradient: string;     // Statistics icon gradient

        // Dark mode  color 

        // Primary dark mode color
        colorPrimaryDark: string;          // Darker shade of primary for emphasis
        colorPrimaryDarkLight: string;     // Light version of dark primary
        
        // text color
        colorDarkPrimary: string;         // Primary dark text color
        colorDarkSecondary: string;         // Secondary dark text color

        // border
        colorDarkBorder: string;           // Dark border color
        // gradient dark mode
        colorPrimaryDarkGradient: string;      // Primary gradient

        colorBackgroundSecondary: string;

    };
    updateTheme: (newTheme: Partial<ThemeContextType['theme']>) => void;
}

const defaultTheme = {
    colorPrimary: 'rgba(22, 59, 124, 1)',
    colorPrimaryAlt: 'rgba(22, 59, 124, 1)',
    colorPrimaryLight: 'rgba(0, 92, 142, 1)',
    colorPrimaryDeep: 'rgba(32, 45, 89, 1)',
    colorPrimaryDeepLight: 'rgba(32, 45, 89, 0.05)',
    colorPrimaryDarkLight: 'rgba(6, 21, 45, 1)',
    colorPrimaryTransparent: 'rgba(22, 59, 124, 0.411)',
    colorPrimaryBg: 'rgba(239, 239, 239, 1)',
    colorPrimaryBgLight: 'rgba(220, 231, 236, 1)',
    colorPrimaryLightest: 'rgba(245, 248, 252, 1)',
    colorSecondary: 'rgba(85, 181, 108, 1)',
    colorTextPrimary: 'rgba(38, 38, 38, 1)',
    colorTextSecondary: 'rgba(126, 126, 126, 1)',
    colorDarkSecondary: 'rgba(71, 97, 137, )',
    colorSecondaryLightestTransperent: 'rgba(85, 181, 108, 0)',
    colorDarkPrimary: 'rgba(71, 97, 137, 1)',
    colorPrimaryBorder: 'rgb(233, 239, 255)',
    colorDarkBorder: 'rgba(9, 27, 59, 1)',
    colorSecondaryPositive: 'rgba(2, 148, 71, 1)',
    colorSecondaryPositiveLight: 'rgba(52, 199, 89, 0.15)', /*changed*/
    colorWarning: 'rgba(237, 140, 34, 1)',
    colorWarningAlt: 'rgba(255, 209, 8, 1)',
    colorWarningLight: 'rgba(255, 180, 0, 0.15)', /*changed*/
    colorDanger: 'rgba(220, 39, 44, 1)',
    colorDangerAlt: 'rgba(255, 124, 92, 1)',
    colorDangerLight: 'rgba(231, 45, 63, 0.1)',  /*changed*/
    colorInfo: 'none',
    colorNeutralDark: 'rgba(60, 60, 60, 1)',
    colorNeutralDarker: 'rgba(38, 38, 38, 1)',
    colorNeutralLightest: ' rgba(255, 255, 255, 1)',
    colorAccentLight: 'rgba(0, 209, 178, 0.05)',
    colorSecondaryLight: 'rgba(187, 225, 196, 1)',
    colorIconHover:
        'brightness(0) saturate(100%) invert(15%) sepia(80%) saturate(1705%)hue-rotate(190deg) brightness(90%) contrast(105%)',
    colorPrimaryGradient:
        'linear-gradient(135deg, rgba(187, 225, 196, 1),rgba(85, 181, 108, 0) )',
    colorPrimaryDarkGradient:
        'linear-gradient(135deg, rgba(0, 92, 142, 1), rgba(85, 181, 108, 0))',
    colorGradientSecondary: 
        'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light))',
    colorStatIconGradient:
        'linear-gradient(0deg, rgb(187 225 196), rgba(22, 59, 124, 0))',
    colorShadowPrimary: 'rgba(220, 228, 239, 1)',
    colorShadowSecondary: 'rgba(220, 228, 239, 1)',
    colorBackgroundSecondary: 'rgb(0, 106, 255)',



        // dark mode colors
        // Primry dark
        colorPrimaryDark: 'rgba(4, 19, 40, 1)',
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