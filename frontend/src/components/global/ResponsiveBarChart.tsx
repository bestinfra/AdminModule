import React, { useState, useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApp } from '@context/AppContext';

// Data shape interfaces
interface DailyData {
    dates: string[];
    values: number[];
}

interface MonthlyData {
    months: string[];
    values: number[];
}

interface YearlyData {
    years: string[];
    values: number[];
}

interface BarChartData {
    daily: DailyData;
    monthly: MonthlyData;
    yearly: YearlyData;
}

interface ResponsiveBarChartProps {
    data: BarChartData;
    title?: string;
    height?: string | number;
    seriesColors?: string[];
    onPeriodChange?: (period: 'daily' | 'monthly' | 'yearly') => void;
    ariaLabel?: string;
    className?: string;
}

type PeriodType = 'daily' | 'monthly' | 'yearly';

const ResponsiveBarChart: React.FC<ResponsiveBarChartProps> = ({
    data,
    title = 'Chart Metrics',
    height = '400px',
    seriesColors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'],
    onPeriodChange,
    ariaLabel = 'Responsive bar chart with period selection',
    className = '',
}) => {
    const { isDarkMode } = useApp();
    
    // useState hook for period selection
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('daily');

    // Handle period change
    const handlePeriodChange = useCallback((period: PeriodType) => {
        setSelectedPeriod(period);
        onPeriodChange?.(period);
    }, [onPeriodChange]);

    // Get current data based on selected period
    const currentData = useMemo(() => {
        switch (selectedPeriod) {
            case 'daily':
                return {
                    xAxisData: data.daily.dates,
                    seriesData: [{ name: 'Daily Values', data: data.daily.values }]
                };
            case 'monthly':
                return {
                    xAxisData: data.monthly.months,
                    seriesData: [{ name: 'Monthly Values', data: data.monthly.values }]
                };
            case 'yearly':
                return {
                    xAxisData: data.yearly.years,
                    seriesData: [{ name: 'Yearly Values', data: data.yearly.values }]
                };
            default:
                return {
                    xAxisData: data.daily.dates,
                    seriesData: [{ name: 'Daily Values', data: data.daily.values }]
                };
        }
    }, [selectedPeriod, data]);

    // Get axis colors based on theme
    const getAxisColor = useCallback((lightVar: string, darkVar: string) =>
        isDarkMode ? `var(${darkVar})` : `var(${lightVar})`,
        [isDarkMode]
    );

    // Format tooltip
    const formatTooltip = useCallback((params: Array<{
        axisValue: string;
        color: string;
        seriesName: string;
        value: number;
    }>) => {
        const date = params[0].axisValue;
        return [
            `<div class="m-0 leading-none">${date}</div>`,
            ...params.map((param) =>
                `<div class="mt-2.5 leading-none">
                    <span class="inline-block mr-1.5 rounded-full w-2.5 h-2.5" style="background-color:${param.color};"></span>
                    ${param.seriesName}: ${param.value}
                </div>`
            ),
        ].join('');
    }, []);

    // ECharts configuration
    const option = useMemo(() => ({
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
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
            formatter: formatTooltip,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: currentData.xAxisData,
            axisLabel: {
                fontSize: '0.75rem',
                color: getAxisColor('--color-neutral-dark', '--color-surface'),
                rotate: selectedPeriod === 'daily' ? 45 : selectedPeriod === 'monthly' ? 30 : 0,
                margin: 20,
                letterSpacing: '-1',
            },
            axisTick: { show: true, alignWithLabel: true },
            axisLine: {
                show: true,
                lineStyle: {
                    color: getAxisColor('--color-neutral-dark', '--color-surface'),
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: '0.75rem',
                color: getAxisColor('--color-neutral-dark', '--color-surface'),
                letterSpacing: '-1',
                margin: 20,
            },
            axisTick: { show: true },
            axisLine: {
                show: true,
                lineStyle: {
                    color: getAxisColor('--color-neutral-dark', '--color-surface'),
                },
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: getAxisColor('--color-primary-border', '--color-dark-border'),
                    type: 'dashed',
                },
            },
        },
        series: currentData.seriesData.map((item, index) => ({
            name: item.name,
            type: 'bar',
            data: item.data,
            maxBarWidth: '26px',
            barGap: '10%',
            barCategoryGap: '10%',
            itemStyle: {
                color: seriesColors[index % seriesColors.length],
                borderRadius: 4,
                opacity: isDarkMode ? 0.8 : 1,
            },
            emphasis: { focus: 'series', itemStyle: { opacity: 1 } },
            showBackground: true,
            backgroundStyle: {
                color: getAxisColor('--color-secondary-light', '--color-primary-dark-light'),
                opacity: isDarkMode ? 0.01 : 0.5,
            },
        })),
    }), [
        currentData,
        selectedPeriod,
        seriesColors,
        isDarkMode,
        getAxisColor,
        formatTooltip,
    ]);

    return (
        <div 
            className={`bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl font-manrope ${className}`}
            style={{ fontFamily: 'Manrope, sans-serif' }}
        >
            {/* Header with Period Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--color-primary-lightest)] dark:bg-primary-dark-light rounded-t-3xl p-4">
                <h3 className="font-medium text-neutral-darker dark:text-surface text-lg">
                    {title}
                </h3>
                
                {/* Period Selector - Segmented Control */}
                <div className="inline-flex bg-white dark:bg-primary-dark rounded-3xl p-1 relative overflow-hidden border border-primary-border shadow-sm">
                    {(['daily', 'monthly', 'yearly'] as PeriodType[]).map((period, index) => (
                        <button
                            key={period}
                            onClick={() => handlePeriodChange(period)}
                            className={`
                                relative z-10 border-none px-4 py-2 rounded-3xl font-normal text-sm cursor-pointer transition-all duration-200
                                ${selectedPeriod === period
                                    ? 'text-colorPrimaryDark font-medium bg-background-secondary dark:bg-primary-dark-light shadow-sm'
                                    : 'text-text-secondary hover:text-neutral-dark dark:hover:text-surface hover:bg-gray-50 dark:hover:bg-primary-dark-light'
                                }
                                ${index === 0 ? 'rounded-l-3xl' : ''}
                                ${index === 2 ? 'rounded-r-3xl' : ''}
                            `}
                            aria-pressed={selectedPeriod === period}
                            aria-label={`View ${period} data`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Content */}
            <div className="p-4">
                <div 
                    className="w-full" 
                    role="img" 
                    aria-label={`${ariaLabel} - ${selectedPeriod} view`}
                    style={{
                        height: typeof height === 'number' ? `${height}px` : height,
                    }}
                >
                    <ReactECharts
                        option={option}
                        className="w-full h-full"
                        opts={{ renderer: 'svg' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResponsiveBarChart;
