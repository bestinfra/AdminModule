import Ticket from './pages/ticket_module/Ticket';
import { useEffect, useState } from 'react';
import type { Column } from './components/global/Table';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageBuilder from './pages/PageBuilder/PageBuilder';
import ModuleSelection from './pages/ModuleSelection';
import MainLayout from './components/layout/MainLayout';
import Card from './components/global/Card';
import CardSkeleton from './components/skeletons/CardSkeleton';
import NotFound from './pages/NotFound';
import { AppProvider } from './context/AppContext';
import Holder from './components/global/Holder';
import { BarChart } from './graphs';

interface TableData {
    [key: string]: string | number | boolean | null | undefined;
}

interface TicketData extends TableData {
    id: number;
    ticketNumber: string;
    subject: string;
    status: string;
    priority: string;
    assignedTo: string;
    createdAt: string;
}

interface CardData {
    title: string;
    value: string;
    icon: string;
    showTrend: boolean;
    comparisonValue: number;
    subtitle1: string;
    subtitle2: string;
}

interface TableConfig {
    data: TicketData[];
    columns: Column[];
    heading: string;
}

interface TicketModuleData {
    loading: boolean;
    cards: {
        data: CardData[];
        heading: string;
    };
    tables: TableConfig[];
}

const App: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [ticketData, setTicketData] = useState<TicketData[]>([
        {
            id: 1,
            ticketNumber: 'TICK-001',
            subject: 'System Access Issue',
            status: 'Open',
            priority: 'High',
            assignedTo: 'John Doe',
            createdAt: '2024-03-20',
        },
        {
            id: 2,
            ticketNumber: 'TICK-002',
            subject: 'Email Configuration',
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
            createdAt: '2024-03-19',
        },
        {
            id: 3,
            ticketNumber: 'TICK-003',
            subject: 'Software Update',
            status: 'Resolved',
            priority: 'Low',
            assignedTo: 'Mike Johnson',
            createdAt: '2024-03-18',
        },
    ]);

    const columns: Column[] = [
        { key: 'ticketNumber', label: 'Ticket Number' },
        { key: 'subject', label: 'Subject' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'assignedTo', label: 'Assigned To' },
        { key: 'createdAt', label: 'Created At' },
    ];

    const cardData: CardData[] = [
        {
            title: 'Total Tickets',
            value: ticketData.length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 12,
            subtitle1: 'Last 30 days',
            subtitle2: '+12% from last month',
        },
        {
            title: 'Open Tickets',
            value: ticketData
                .filter((ticket) => ticket.status === 'Open')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: -5,
            subtitle1: 'Active tickets',
            subtitle2: '-5% from last week',
        },
        {
            title: 'Resolved Tickets',
            value: ticketData
                .filter((ticket) => ticket.status === 'Resolved')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 8,
            subtitle1: 'Last 30 days',
            subtitle2: '+8% from last month',
        },
        {
            title: 'In Progress Tickets',
            value: ticketData
                .filter((ticket) => ticket.status === 'In Progress')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 3,
            subtitle1: 'Active tickets',
            subtitle2: '+3% from last week',
        },
        {
            title: 'High Priority Tickets',
            value: ticketData
                .filter((ticket) => ticket.priority === 'High')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 2,
            subtitle1: 'Urgent tickets',
            subtitle2: '+2% from last week',
        },
        {
            title: 'Medium Priority Tickets',
            value: ticketData
                .filter((ticket) => ticket.priority === 'Medium')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 4,
            subtitle1: 'Normal priority',
            subtitle2: '+4% from last week',
        },
        {
            title: 'Low Priority Tickets',
            value: ticketData
                .filter((ticket) => ticket.priority === 'Low')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: -1,
            subtitle1: 'Low priority',
            subtitle2: '-1% from last week',
        },
        {
            title: 'Recently Created',
            value: ticketData
                .filter((ticket) => {
                    const createdDate = new Date(ticket.createdAt);
                    const today = new Date();
                    const diffTime = Math.abs(
                        today.getTime() - createdDate.getTime()
                    );
                    const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7;
                })
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 6,
            subtitle1: 'Last 7 days',
            subtitle2: '+6% from last week',
        },
        {
            title: 'Assigned to Me',
            value: ticketData
                .filter((ticket) => ticket.assignedTo === 'John Doe')
                .length.toString(),
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: 1,
            subtitle1: 'My tickets',
            subtitle2: '+1% from last week',
        },
        {
            title: 'Avg Resolution Time',
            value: '2.5 days',
            icon: 'icons/units.svg',
            showTrend: true,
            comparisonValue: -0.5,
            subtitle1: 'Average time',
            subtitle2: '-0.5 days from last week',
        },
    ];

    const [selectedTimeRange, setSelectedTimeRange] = useState('Daily');
    const [chartData] = useState({
        daily: {
            xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            seriesData: [
                {
                    name: 'Tickets',
                    data: [120, 200, 150, 80, 70, 110, 130],
                },
            ],
        },
        monthly: {
            xAxisData: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            seriesData: [
                {
                    name: 'Tickets',
                    data: [450, 520, 380, 490],
                },
            ],
        },
        yearly: {
            xAxisData: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ],
            seriesData: [
                {
                    name: 'Tickets',
                    data: [
                        1200, 1400, 1100, 1300, 1500, 1600, 1400, 1300, 1200,
                        1100, 1000, 900,
                    ],
                },
            ],
        },
    });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleViewTicket = (ticket: TicketData) => {
        console.log('Viewing ticket:', ticket);
    };

    const handleEditTicket = (ticket: TicketData) => {
        console.log('Editing ticket:', ticket);
    };

    const handleDeleteTicket = (ticket: TicketData) => {
        console.log('Deleting ticket:', ticket);
        setTicketData((prevData) => prevData.filter((t) => t.id !== ticket.id));
    };

    const ticketModuleData: TicketModuleData = {
        loading,
        cards: {
            data: cardData,
            heading: 'Ticket Overview',
        },
        tables: [
            {
                data: ticketData,
                columns: columns,
                heading: 'Active Tickets',
            },
            {
                data: ticketData.filter(
                    (ticket) => ticket.status === 'Resolved'
                ),
                columns: columns,
                heading: 'Resolved Tickets',
            },
            {
                data: ticketData.filter((ticket) => ticket.status === 'Open'),
                columns: columns,
                heading: 'Open Tickets',
            },
        ],
    };

    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route
                            path="/"
                            element={
                                <>
                                    <Card
                                        title="Ticket Overview"
                                        value="100"
                                        icon="icons/units.svg"
                                        showTrend={true}
                                        comparisonValue={10}
                                        subtitle1="Last 30 days"
                                        subtitle2="+10% from last month"
                                    />
                                    <div className="h-2"></div>
                                    <CardSkeleton />
                                    <div className="h-2"></div>
                                    <Holder
                                        title="Daily Consumption Metrics"
                                        DateRange="(21 Apr, 2025 - 10 Jun, 2025)"
                                        availableTimeRanges={[
                                            'Daily',
                                            'Monthly',
                                            'Yearly',
                                        ]}
                                        selectedTimeRange={selectedTimeRange}
                                        handleTimeRangeChange={(range) => {
                                            setSelectedTimeRange(range);
                                        }}
                                        handleDownload={() => {
                                            /* handle download */
                                        }}
                                        loading={true}>
                                        <BarChart
                                            timeRange={
                                                selectedTimeRange as
                                                    | 'Daily'
                                                    | 'Monthly'
                                                    | 'Yearly'
                                            }
                                            xAxisData={
                                                chartData[
                                                    selectedTimeRange.toLowerCase() as keyof typeof chartData
                                                ].xAxisData
                                            }
                                            seriesData={
                                                chartData[
                                                    selectedTimeRange.toLowerCase() as keyof typeof chartData
                                                ].seriesData
                                            }
                                        />
                                    </Holder>
                                    <div className="h-2"></div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <Holder
                                            title="Daily Consumption Metrics"
                                            DateRange="(21 Apr, 2025 - 10 Jun, 2025)"
                                            availableTimeRanges={[
                                                'Daily',
                                                'Monthly',
                                                'Yearly',
                                            ]}
                                            selectedTimeRange={
                                                selectedTimeRange
                                            }
                                            handleDownload={() => {
                                                console.log('Downloading chart data...');
                                            }}
                                            loading={loading}
                                            handleTimeRangeChange={(range) => {
                                                setSelectedTimeRange(range);
                                            }}>
                                            <BarChart
                                                timeRange={
                                                    selectedTimeRange as
                                                        | 'Daily'
                                                        | 'Monthly'
                                                        | 'Yearly'
                                                }
                                                xAxisData={
                                                    chartData[
                                                        selectedTimeRange.toLowerCase() as keyof typeof chartData
                                                    ].xAxisData
                                                }
                                                seriesData={
                                                    chartData[
                                                        selectedTimeRange.toLowerCase() as keyof typeof chartData
                                                    ].seriesData
                                                }
                                            />
                                        </Holder>
                                    </div>
                                </>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    <Route path="/page-builder" element={<PageBuilder />} />
                    <Route
                        path="/module-selection"
                        element={<ModuleSelection />}
                    />
                </Routes>
            </Router>
        </AppProvider>
    );
};

export default App;
