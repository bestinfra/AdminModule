import React from 'react';
import ReactECharts from 'echarts-for-react';

interface LineChartProps {
    title?: string;
    data?: any[];
    xAxisData?: string[];
    showXAxisLabel?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
    title = 'Line Chart',
    data = [150, 230, 224, 218, 135, 147, 260],
    xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    showXAxisLabel = true,
}) => {
    const option = {
        title: {
            text: title,
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
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
