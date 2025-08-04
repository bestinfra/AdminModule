import { useTheme } from '@/providers/ThemeProvider';
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ThemeProps {
    children: ReactNode;
}

export const Theme: React.FC<ThemeProps> = ({ children }) => {
    const { theme, updateTheme } = useTheme();
    console.log('theme', theme);
    useEffect(() => {
        updateTheme({
        });
    }, []);

    return <div>{children}</div>;
}; 