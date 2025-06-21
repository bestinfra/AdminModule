import React from 'react';
import { LineChart, BarChart, PieChart, RadarChart } from '../graphs';
import Card from '../components/global/Card';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                    <LineChart
                        title="Ticket Trends"
                        data={[150, 230, 224, 218, 135, 147, 260]}
                        xAxisData={[
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat',
                            'Sun',
                        ]}
                    />
                </Card>
                <Card className="p-4">
                    <BarChart
                        title="Ticket Distribution"
                        data={[120, 200, 150, 80, 70, 110, 130]}
                        xAxisData={[
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat',
                            'Sun',
                        ]}
                    />
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                    <PieChart
                        title="Ticket Status Distribution"
                        data={[
                            { value: 1048, name: 'Open' },
                            { value: 735, name: 'In Progress' },
                            { value: 580, name: 'Resolved' },
                            { value: 484, name: 'Closed' },
                            { value: 300, name: 'On Hold' },
                        ]}
                    />
                </Card>
                <Card className="p-4">
                    <RadarChart
                        title="Ticket Performance Metrics"
                        indicator={[
                            { name: 'Response Time', max: 100 },
                            { name: 'Resolution Time', max: 100 },
                            { name: 'Customer Satisfaction', max: 100 },
                            { name: 'First Contact Resolution', max: 100 },
                            { name: 'Ticket Volume', max: 100 },
                            { name: 'Knowledge Base Usage', max: 100 },
                        ]}
                        data={[
                            {
                                value: [85, 75, 90, 80, 70, 65],
                                name: 'Current Performance',
                            },
                            {
                                value: [90, 85, 85, 85, 75, 70],
                                name: 'Target Performance',
                            },
                        ]}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
