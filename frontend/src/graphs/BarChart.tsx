import React, { useMemo, useCallback, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApp } from '../context/AppContext';
import TimeRangeSelector from '../components/global/TimeRangeSelector';

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
  // Header functionality props
  showHeader?: boolean;
  headerTitle?: string;
  dateRange?: string;
  availableTimeRanges?: string[];
  initialTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  onDownload?: (timeRange: string, viewType: string) => void;
  showDownloadButton?: boolean;
  // View toggle props
  showViewToggle?: boolean;
  viewToggleOptions?: string[];
  initialViewType?: string;
  onViewTypeChange?: (viewType: string) => void;
  showTableView?: boolean;
  tableData?: any[];
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
  // Header functionality props with defaults
  showHeader = false,
  headerTitle = 'Metrics',
  dateRange = '',
  availableTimeRanges = ['Daily', 'Monthly', 'Yearly'],
  initialTimeRange = 'Daily',
  onTimeRangeChange = () => {},
  onDownload = () => {},
  showDownloadButton = true,
  // View toggle props (not implemented yet)
  // showViewToggle = false,
  // viewToggleOptions = ['Graph', 'Table'],
  // initialViewType = 'Graph',
  // onViewTypeChange = () => {},
  // showTableView = false,
  // tableData = [],
  // tableColumns = [],
}) => {
  const { isDarkMode: contextIsDarkMode } = useApp();
  const isDarkMode = propIsDarkMode ?? contextIsDarkMode;

  // Internal state for time range
  const [selectedTimeRange, setSelectedTimeRange] = useState(initialTimeRange);

  // Helper function to get dynamic title based on selected time range
  const getDynamicTitle = useCallback((timeRange: string) => {
    return headerTitle.includes('Metrics') 
      ? `${timeRange} ${headerTitle}` 
      : `${timeRange} ${headerTitle}`;
  }, [headerTitle]);

  // Handle time range change
  const handleTimeRangeChange = useCallback((range: string) => {
    setSelectedTimeRange(range);
    onTimeRangeChange(range);
  }, [onTimeRangeChange]);

  // Handle download
  const handleDownload = useCallback(() => {
    onDownload(selectedTimeRange, 'Graph');
  }, [onDownload, selectedTimeRange]);

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
    grid: { left: '0%', right: '0.1%', bottom: '0%', top: '3%', containLabel: true },
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

  // Chart content component
  const chartContent = (
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



  // If no header, return simple chart
  if (!showHeader) {
    return chartContent;
  }

  return (
    <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl font-manrope" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header Section */}
      <div className="flex justify-between items-center gap-4 bg-[var(--color-primary-lightest)] dark:bg-primary-dark-light rounded-t-3xl p-4">
        <div className="font-medium text-neutral-darker dark:text-surface font-manrope" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {getDynamicTitle(selectedTimeRange)}
          {dateRange && (
            <span className="text-xs font-normal text-neutral-dark dark:text-surface ml-1 font-manrope" style={{ fontFamily: 'Manrope, sans-serif' }}>
              ({dateRange})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TimeRangeSelector
            availableTimeRanges={availableTimeRanges}
            selectedTimeRange={selectedTimeRange}
            handleTimeRangeChange={handleTimeRangeChange}
          />
          {showDownloadButton && (
            <span 
              className="cursor-pointer w-8 h-8 rounded-full bg-white dark:bg-primary-dark flex justify-center items-center border border-primary-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-primary-dark-light transition-colors"
              onClick={() => handleDownload()}
              role="button"
              aria-label="Download chart"
            >
              <img
                alt="Download chart"
                src="/icons/download-icon.svg"
                className="w-4 h-4 [filter:var(--icon-color)]"
              />
            </span>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="px-4 py-4">
        {chartContent}
      </div>
    </div>
  );
});

export default BarChart;