import React from 'react';
import { useIconFilterStyle } from '@/hooks/useIconFilterStyle';
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';

interface IconProps {
    src: string;
    alt?: string;
    className?: string;
    iconStyle?: keyof typeof FILTER_STYLES | typeof FILTER_STYLES[keyof typeof FILTER_STYLES];
    width?: string;
    height?: string;
}

const Icon: React.FC<IconProps> = ({
    src,
    alt = 'Icon',
    className,
    iconStyle,
    width,
    height,
}) => {
    // Get global icon style (defaults to BRAND_GREEN)
    const globalIconStyle = useIconFilterStyle();
    
    // Determine the final icon style
    let finalIconStyle;
    
    if (iconStyle) {
        // If iconStyle is a string key, get the style from FILTER_STYLES
        if (typeof iconStyle === 'string') {
            finalIconStyle = FILTER_STYLES[iconStyle as keyof typeof FILTER_STYLES];
        } else {
            // If iconStyle is already a style object, use it directly
            finalIconStyle = iconStyle;
        }
    } else {
        // Use global style if no specific style is provided
        finalIconStyle = globalIconStyle;
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={className || 'w-7 h-7 lg:w-6 lg:h-6 md:w-5 md:h-5 sm:w-4 sm:h-4'}
            style={finalIconStyle}
            width={width}
            height={height}
        />
    );
};

export default Icon; 