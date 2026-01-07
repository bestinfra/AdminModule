import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartSkeleton from '@components/skeletons/ChartSkeleton';

interface RadarChartProps {
    title?: string;
    indicator?: Array<{ name: string; max: number }>;
    data?: Array<{ value: number[]; name: string }>;
    height?: string | number;
    isLoading?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
    title = 'Radar Chart',
    indicator = [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 },
    ],
    data = [
        {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget',
        },
        {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending',
        },
    ],
    height = '400px',
    isLoading = false,
}) => {
    const option = {
        title: {
            text: title,
            left: 'center',
            textStyle: {
                fontFamily: 'Manrope, sans-serif',
            },
        },
        tooltip: {
            textStyle: {
                fontFamily: 'Manrope, sans-serif',
            },
        },
        legend: {
            data: data.map((item) => item.name),
            bottom: 0,
            textStyle: {
                fontFamily: 'Manrope, sans-serif',
            },
        },
        radar: {
            indicator: indicator,
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: data,
            },
        ],
    };

    if (isLoading) {
        return <ChartSkeleton height={height} />;
    }

    return (
        <div className="w-full h-full">
            <ReactECharts
                option={option}
                style={{ height: height, width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
};

export default RadarChart;
