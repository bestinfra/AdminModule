import React, { useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApp } from '@context/AppContext';

interface PieChartProps {
    title?: string;
    data?: Array<{ value: number; name: string }>;
    colors?: string[];
    isDarkMode?: boolean;
    height?: string | number;
    ariaLabel?: string;
    description?: string;
    enableAnimation?: boolean;
    showNoDataMessage?: boolean;
    onClick?: (segmentName?: string) => void;
    className?: string; // Add className prop
}

const PieChart: React.FC<PieChartProps> = React.memo(({
    title = 'Pie Chart',
    data = [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
    ],
    colors,
    isDarkMode: propIsDarkMode,
    height = '400px',
    ariaLabel = 'pie chart',
    description,
    enableAnimation = process.env.NODE_ENV === 'production',
    showNoDataMessage = true,
    onClick,
    className, // Add className prop
}) => {
    const { isDarkMode: contextIsDarkMode } = useApp();
    const isDarkMode = propIsDarkMode ?? contextIsDarkMode;

    const getAxisColor = useCallback((lightVar: string, darkVar: string) =>
        isDarkMode ? `var(${darkVar})` : `var(${lightVar})`, [isDarkMode]);

    const defaultColors = colors || [
        'var(--color-positive)', // green
        'var(--color-danger)', // red
    ];

    const option = useMemo(() => ({
        title: {
            text: title,
            left: 'center',
            textStyle: {
                color: getAxisColor('--color-neutral-darker', '--color-surface'),
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'Manrope, sans-serif',
            },
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: getAxisColor('--color-surface', '--color-primary-dark'),
            borderColor: getAxisColor('--color-primary-border', '--color-dark-border'),
            borderWidth: 1,
            borderRadius: 8,
            padding: [12, 16],
            textStyle: {
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                color: getAxisColor('--color-neutral-darker', '--color-surface'),
            },
            extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: getAxisColor('--color-neutral-darker', '--color-surface'),
                fontSize: '0.85rem',
                fontFamily: 'Manrope, sans-serif',
            },
            itemGap: 8,
            itemWidth: 12,
            itemHeight: 12,
        },
        color: defaultColors,
        series: [{
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            center: ['60%', '50%'],
            data,
            label: {
                show: true,
                color: getAxisColor('--color-neutral-darker', '--color-surface'),
                fontSize: 12,
                fontFamily: 'Manrope, sans-serif',
                formatter: '{b}: {d}%',
            },
            labelLine: {
                show: true,
                lineStyle: { color: getAxisColor('--color-neutral-light', '--color-dark-border') },
            },
            itemStyle: {
                borderRadius: 4,
                borderColor: getAxisColor('--color-surface', '--color-primary-dark'),
                borderWidth: 2,
                opacity: isDarkMode ? 0.8 : 1,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 15, shadowOffsetX: 0, shadowOffsetY: 0,
                    shadowColor: 'var(--color-accent)40', scale: true, scaleSize: 5,
                },
                label: { 
                    show: true, 
                    fontSize: 14, 
                    fontWeight: 'bold',
                    fontFamily: 'Manrope, sans-serif',
                },
            },
        }],
        animation: enableAnimation,
    }), [title, data, defaultColors, isDarkMode, enableAnimation, getAxisColor]);

    if (showNoDataMessage && (!data || data.length === 0)) {
        return (
            <div className="w-full h-full flex items-center justify-center rounded-lg" 
                 style={{ backgroundColor: getAxisColor('--color-secondary-light', '--color-primary-dark-light') }}
                 role="img" aria-label={ariaLabel}>
                <div className="text-center">
                    <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">🥧</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full h-full ${className || ''}`} role="img" aria-label={ariaLabel}>
            {title && <span className="sr-only">{title}</span>}
            {description && <span className="sr-only">{description}</span>}
            <ReactECharts
                option={option}
                className="w-full"
                style={{ height: typeof height === 'number' ? `${height}px` : height }}
                opts={{ renderer: 'svg' }}
                onEvents={{
                    click: (params: any) => {
                        if (onClick) {
                            onClick(params.name);
                        }
                    }
                }}
            />
        </div>
    );
});

export default PieChart;