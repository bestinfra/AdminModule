import React from 'react';
import ResponsiveBarChart from './ResponsiveBarChart';

// Example data shapes for each period
const exampleData = {
    daily: {
        dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [120, 200, 150, 80, 70, 110, 130]
    },
    monthly: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [3200, 2800, 3500, 4200, 3800, 4500, 5200, 4800, 4100, 3900, 3600, 4400]
    },
    yearly: {
        years: ['2020', '2021', '2022', '2023', '2024'],
        values: [45000, 52000, 48000, 61000, 58000]
    }
};

const ResponsiveBarChartExample: React.FC = () => {
    const handlePeriodChange = (period: 'daily' | 'monthly' | 'yearly') => {
        console.log(`Period changed to: ${period}`);
        // Here you would typically fetch new data or update your data source
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-neutral-darker dark:text-surface mb-6">
                Responsive Bar Chart Example
            </h1>
            
            <div className="space-y-6">
                <ResponsiveBarChart
                    data={exampleData}
                    title="Consumption Metrics"
                    height={400}
                    seriesColors={['var(--color-primary)', 'var(--color-secondary)']}
                    onPeriodChange={handlePeriodChange}
                    ariaLabel="Example consumption data chart"
                    className="shadow-lg"
                />
                
                <div className="bg-gray-50 dark:bg-primary-dark-light rounded-lg p-4">
                    <h3 className="font-medium text-neutral-darker dark:text-surface mb-2">
                        Data Structure Example:
                    </h3>
                    <pre className="text-sm text-neutral-dark dark:text-surface overflow-x-auto">
{`const data = {
    daily: {
        dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [120, 200, 150, 80, 70, 110, 130]
    },
    monthly: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [3200, 2800, 3500, 4200, 3800, 4500]
    },
    yearly: {
        years: ['2020', '2021', '2022', '2023', '2024'],
        values: [45000, 52000, 48000, 61000, 58000]
    }
};`}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveBarChartExample;
