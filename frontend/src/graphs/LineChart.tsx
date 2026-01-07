import React from 'react';
import ReactECharts from 'echarts-for-react';
import ChartSkeleton from '@components/skeletons/ChartSkeleton';

interface LineChartProps {
    title?: string;
    data?: any[];
    xAxisData?: string[];
    showXAxisLabel?: boolean;
    height?: string | number;
    isLoading?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
    title = 'Line Chart',
    data = [150, 230, 224, 218, 135, 147, 260],
    xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    showXAxisLabel = true,
    height = '100%',
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
            trigger: 'axis',
            textStyle: {
                fontFamily: 'Manrope, sans-serif',
            },
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                show: showXAxisLabel
            }
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: data,
                type: 'line',
                smooth: true,
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
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
};

export default LineChart;
