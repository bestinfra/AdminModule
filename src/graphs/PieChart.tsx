import React from 'react';
import ReactECharts from 'echarts-for-react';

interface PieChartProps {
    title?: string;
    data?: Array<{ value: number; name: string }>;
}

const PieChart: React.FC<PieChartProps> = ({
    title = 'Pie Chart',
    data = [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
    ],
}) => {
    const option = {
        title: {
            text: title,
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <ReactECharts
                option={option}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'svg' }}
            />
        </div>
    );
};

export default PieChart;
