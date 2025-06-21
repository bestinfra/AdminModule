import React from 'react';
import ReactECharts from 'echarts-for-react';

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
}

const BarChart: React.FC<BarChartProps> = ({
    data = [120, 200, 150, 80, 70, 110, 130],
    xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isDarkMode = false,
    timeRange = 'Daily',
    seriesData = [{ name: 'Data', data }],
    seriesColors = ['#5470c6'],
    showXAxisLabel = false,
    xAxisLabel = '',
}) => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            backgroundColor: isDarkMode
                ? 'rgba(45, 45, 45, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode ? '#424242' : '#E5E5E5',
            borderWidth: 1,
            borderRadius: 8,
            padding: [12, 16],
            textStyle: {
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                color: isDarkMode ? '#ffffff' : '#424242',
            },
            extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);',

            formatter: (
                params: Array<{
                    axisValue: string;
                    dataIndex: number;
                    color: string;
                    seriesName: string;
                    value: number;
                }>
            ) => {
                const date = params[0].axisValue;
                let result = `<div class="m-0 leading-none">${date}</div>`;
                params.forEach((param) => {
                    result += `<div class="mt-2.5 leading-none">
                        <span class="inline-block mr-1.5 rounded-full w-2.5 h-2.5" style="background-color:${param.color};"></span>
                        ${param.seriesName}: ${param.value}
                    </div>`;
                });
                return result;
            },
        },
        legend: {
            show: seriesData?.length > 1,
            data: seriesData?.map((series) => series.name),
            top: 0,
            textStyle: {
                // fontFamily: 'Manrope, sans-serif',
                fontSize: '0.85rem',
                color: isDarkMode ? '#ffffff' : '#424242',
            },
            type: 'scroll',
            orient: 'horizontal',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
        },
        grid: {
            left: '0%',
            right: '0.1%',
            bottom: '0%',
            top: '13%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                // fontFamily: 'Manrope, sans-serif',
                fontSize: '0.75rem',
                color: isDarkMode ? '#ffffff' : '#464646',
                rotate:
                    timeRange === 'Daily'
                        ? 45
                        : timeRange === 'Monthly'
                        ? 30
                        : 0,
                margin: 20,
                letterSpacing: '-1',
            },
            axisTick: {
                show: true,
                alignWithLabel: true,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: isDarkMode ? '#ffffff' : '#464646',
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value: number) {
                    return showXAxisLabel ? `${value} ${xAxisLabel}` : value;
                },
                // fontFamily: 'Manrope, sans-serif',
                fontSize: '0.75rem',
                color: isDarkMode ? '#ffffff' : '#464646',
                letterSpacing: '-1',
                margin: 20,
            },
            axisTick: {
                show: true,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: isDarkMode ? '#ffffff' : '#464646',
                },
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: isDarkMode ? '#424242' : '#E0E0E0',
                    type: 'dashed',
                },
            },
        },
        series: seriesData?.map((item, index) => ({
            name: item.name,
            type: 'bar',
            data: item.data,
            maxBarWidth: '26px',
            itemStyle: {
                color: seriesColors[index],
                borderRadius: 0,
            },
            emphasis: {
                focus: 'series',
            },
            showBackground: true,
            backgroundStyle: {
                color: '#dff4e3',
                opacity: 0.5,
            },
        })),
    };

    return (
        <div className="w-full h-full">
            <ReactECharts
                option={option}
                className="h-[400px] w-full"
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
};

export default BarChart;
