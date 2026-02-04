import React, { useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApp } from '../context/AppContext';
interface SeriesData {
  name: string;
  data: number[];
}
interface BarChartProps {
  data?: number[];
  xAxisData?: string[];
  isDarkMode?: boolean;
  timeRange?: 'Daily' | 'Monthly' | 'Yearly';
  seriesData?: SeriesData[];
  seriesColors?: string[];
  showXAxisLabel?: boolean;
  xAxisLabel?: string;
  height?: string | number;
  showLegendInteractions?: boolean;
  ariaLabel?: string;
  title?: string;
  description?: string;
}
const BarChart: React.FC<BarChartProps> = React.memo(({
  data = [120, 200, 150, 80, 70, 110, 130],
  xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  isDarkMode: propIsDarkMode,
  timeRange = 'Daily',
  seriesData = [{ name: 'Data', data }],
  seriesColors = ['var(--color-primary)'],
  showXAxisLabel = false,
  xAxisLabel = '',
  height = '400px',
  showLegendInteractions = true,
  ariaLabel = 'Bar chart',
  title,
  description,
}) => {
  const { isDarkMode: contextIsDarkMode } = useApp();
  const isDarkMode = propIsDarkMode ?? contextIsDarkMode;
  const getAxisColor = useCallback((lightVar: string, darkVar: string) =>
    isDarkMode ? `var(${darkVar})` : `var(${lightVar})`, [isDarkMode]);
  const defaultColors = [
    'var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)',
    'var(--color-warning)', 'var(--color-danger)', 'var(--color-neutral)',
    'var(--color-primary-light)', 'var(--color-secondary-light)',
    'var(--color-warning-alt)', 'var(--color-danger-alt)',
  ];
  const colors = seriesColors.length ? seriesColors : defaultColors;
  const formatTooltip = useCallback((
    params: Array<{
      axisValue: string;
      color: string;
      seriesName: string;
      value: number;
    }>
  ) => {
    const date = params[0].axisValue;
    return [
      `<div class="m-0 leading-none">${date}</div>`,
      ...params.map(
        (param) =>
          `<div class="mt-2.5 leading-none">
            <span class="inline-block mr-1.5 rounded-full w-2.5 h-2.5" style="background-color:${param.color};"></span>
            ${param.seriesName}: ${param.value}
          </div>`
      ),
    ].join('');
  }, []);
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
    legend: {
      show: seriesData.length > 1,
      data: seriesData.map((s) => s.name),
      top: 0,
      type: 'scroll',
      orient: 'horizontal',
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      selectedMode: showLegendInteractions,
      textStyle: {
        fontSize: '0.85rem',
        color: getAxisColor('--color-neutral-darker', '--color-surface'),
      },
    },
    grid: { left: '0%', right: '0.1%', bottom: '0%', top: '13%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        fontSize: '0.75rem',
        color: getAxisColor('--color-neutral-dark', '--color-surface'),
        rotate: timeRange === 'Daily' ? 45 : timeRange === 'Monthly' ? 30 : 0,
        margin: 20,
        letterSpacing: '-1',
      },
      axisTick: { show: true, alignWithLabel: true },
      axisLine: {
        show: true,
        lineStyle: { color: getAxisColor('--color-neutral-dark', '--color-surface') },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (val: number) => (showXAxisLabel ? `${val} ${xAxisLabel}` : val),
        fontSize: '0.75rem',
        color: getAxisColor('--color-neutral-dark', '--color-surface'),
        letterSpacing: '-1',
        margin: 20,
      },
      axisTick: { show: true },
      axisLine: {
        show: true,
        lineStyle: { color: getAxisColor('--color-neutral-dark', '--color-surface') },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: getAxisColor('--color-primary-border', '--color-dark-border'),
          type: 'dashed',
        },
      },
    },
    series: seriesData.map((item, index) => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      maxBarWidth: '26px',
      itemStyle: {
        color: colors[index % colors.length],
        borderRadius: 0,
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
    colors, xAxisData, seriesData, showXAxisLabel, xAxisLabel, timeRange,
    showLegendInteractions, isDarkMode, getAxisColor, formatTooltip,
  ]);
  return (
    <div className="w-full h-full" role="img" aria-label={ariaLabel}>
      {title && <span className="sr-only">{title}</span>}
      {description && <span className="sr-only">{description}</span>}
      <ReactECharts
        option={option}
        className="w-full"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
});
export default BarChart;