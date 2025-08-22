import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '@/components/global/PageC';
import BACKEND_URL from '@/config';

const MeterDetails: React.FC = () => {
    const navigate = useNavigate();
    const { meterSlNo } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [_meterData, setMeterData] = useState<any>(null);

    // Meter cards data - Show N/A initially
    const [summaryCards, setSummaryCards] = useState([
        {
            title: 'Current Reading',
            value: 'N/A',
            icon: '/icons/current-reading.svg',
            subtitle1: 'N/A',
            subtitle2: 'N/A',
        },
        {
            title: 'Status',
            value: 'N/A',
            icon: '/icons/status.svg',
            subtitle1: 'N/A',
            subtitle2: 'N/A',
        },
        {
            title: 'Meter Type',
            value: 'N/A',
            icon: '/icons/units.svg',
            subtitle1: 'N/A',
            subtitle2: 'N/A',
        },
        {
            title: 'Location',
            value: 'N/A',
            icon: '/icons/location.svg',
            subtitle1: 'N/A',
            subtitle2: 'N/A',
        },
    ]);

    // Meter information data - Show N/A initially
    const [meterInfoRow1, setMeterInfoRow1] = useState([
        { title: 'Meter Sl No.', value: 'N/A' },
        { title: 'Modem Sl No', value: 'N/A' },
        { title: 'UID', value: 'N/A' },
        { title: 'Assigned To', value: 'N/A' },
        { title: 'Meter Make', value: 'N/A' },
    ]);

    const [meterInfoRow2, setMeterInfoRow2] = useState([
        { title: 'Meter CT Ratio', value: 'N/A' },
        { title: 'Meter PT Ratio', value: 'N/A' },
        { title: 'External CT Ratio', value: 'N/A' },
        { title: 'External PT Ratio', value: 'N/A' },
        { title: 'Multiplication Factor', value: 'N/A' },
    ]);

    // Table data - Empty initially
    const [meterInfoData, setMeterInfoData] = useState<any[]>([]);

    const meterDetailAction = [
        {
            label: "View",
            icon: "/icons/eye.svg",
        },
        {
            label: 'edit',
            icon: '/icons/edit.svg'
        },
        {
            label: 'delete',
            icon: '/icons/delete.svg'
        }
    ];

    // Fetch meter data from API
    useEffect(() => {
        const fetchMeterData = async () => {
            if (!meterSlNo) return;
            
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(`${BACKEND_URL}/meters/${meterSlNo}`);
                const data = await response.json();
                
                if (data.success) {
                    const meter = data.data;
                    setMeterData(meter);
                    
                    // Update summary cards with real data
                    setSummaryCards([
                        {
                            title: 'Current Reading',
                            value: meter.currentReading ? `${meter.currentReading} kWh` : 'N/A',
                            icon: '/icons/current-reading.svg',
                            subtitle1: meter.lastReadingDate ? `Last Reading: ${meter.lastReadingDate}` : 'No readings available',
                            subtitle2: meter.consumption ? `Consumption: ${meter.consumption} kWh` : '',
                        },
                        {
                            title: 'Status',
                            value: meter.status || 'N/A',
                            icon: '/icons/status.svg',
                            subtitle1: meter.lastCommunication ? `Last Communication: ${new Date(meter.lastCommunication).toLocaleString()}` : 'No communication data',
                            subtitle2: '',
                        },
                        {
                            title: 'Meter Type',
                            value: meter.meterType || 'N/A',
                            icon: '/icons/units.svg',
                            subtitle1: meter.phase ? `Phase Type: ${meter.phase}` : 'Phase info not available',
                            subtitle2: '',
                        },
                        {
                            title: 'Location',
                            value: meter.location || 'N/A',
                            icon: '/icons/location.svg',
                            subtitle1: meter.installationDate ? `Installation Date: ${new Date(meter.installationDate).toLocaleDateString()}` : 'Installation date not available',
                            subtitle2: '',
                        },
                    ]);

                    // Update meter information rows
                    setMeterInfoRow1([
                        { title: 'Meter Sl No.', value: meter.meterSerialNumber || 'N/A' },
                        { title: 'Modem Sl No', value: meter.modemSerialNumber || 'N/A' },
                        { title: 'UID', value: meter.uid || 'N/A' },
                        { title: 'Assigned To', value: meter.consumerName || 'N/A' },
                        { title: 'Meter Make', value: meter.meterMake || 'N/A' },
                    ]);

                    setMeterInfoRow2([
                        { title: 'Meter CT Ratio', value: meter.meterCTRatio || 'N/A' },
                        { title: 'Meter PT Ratio', value: meter.meterPTRatio || 'N/A' },
                        { title: 'External CT Ratio', value: meter.externalCTRatio || 'N/A' },
                        { title: 'External PT Ratio', value: meter.externalPTRatio || 'N/A' },
                        { title: 'Multiplication Factor', value: meter.multiplicationFactor || 'N/A' },
                    ]);

                    // Update table data
                    if (meter.history && meter.history.length > 0) {
                        setMeterInfoData(meter.history.map((item: any, index: number) => ({
                            slNo: index + 1,
                            meterSlNo: item.meterSerialNumber || 'N/A',
                            modemSlNo: item.modemSerialNumber || 'N/A',
                            meterType: item.meterType || 'N/A',
                            meterMake: item.meterMake || 'N/A',
                            consumerName: item.consumerName || 'N/A',
                            location: item.location || 'N/A',
                            installationDate: item.installationDate ? new Date(item.installationDate).toLocaleDateString() : 'N/A',
                        })));
                    } else {
                        setMeterInfoData([]);
                    }
                } else {
                    throw new Error(data.message || 'Failed to fetch meter data');
                }
            } catch (error) {
                console.error('Error fetching meter data:', error);
                setError('Failed to fetch meter details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchMeterData();
    }, [meterSlNo]);

    const handleRetry = () => {
        setError(null);
        window.location.reload();
    };

    const meterInfoColumns = [
        { key: 'slNo', label: 'Sl No' },
        { key: 'meterSlNo', label: 'Meter SI No' },
        { key: 'modemSlNo', label: 'Modem SI No' },
        { key: 'meterType', label: 'Meter Type' },
        { key: 'meterMake', label: 'Meter Make' },
        { key: 'consumerName', label: 'Consumer Name' },
        { key: 'location', label: 'Location' },
        { key: 'installationDate', label: 'Installation Date' },
    ];

    return (
        <div className="min-h-screen">
            <Page
                sections={[
                    // Error section
                    ...(error ? [{
                        layout: {
                            type: 'column' as const,
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'Error',
                                props: {
                                    visibleErrors: [error],
                                    onRetry: handleRetry,
                                    showRetry: true,
                                    maxVisibleErrors: 1,
                                },
                            },
                        ],
                    }] : []),
                    // Meter Details Header
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'PageHeader',
                                props: {
                                    title: 'Meter Details',
                                    onBackClick: () => navigate('/meters'),
                                    backButtonText: 'Back to Meters',
                                },
                            },
                        ],
                    },
                    // Meter Summary Cards
                    {
                        layout: {
                            type: 'grid',
                            columns: 4,
                            gap: 'gap-4',
                        },
                        components: summaryCards.map((cardData) => ({
                            name: 'Card',
                            props: {
                                ...cardData,
                                icon: cardData.icon || '/icons/default.svg',
                                bg: "bg-stat-icon-gradient",
                                loading: isLoading,
                            },
                        })),
                    },
                    // Feeder Information Section (with meter config ratios inside)
                    {
                        layout: {
                            type: 'grid',
                            columns: 3,
                            className: 'border border-primary-border rounded-3xl bg-white p-4',
                            rows: [
                                {
                                    layout: 'row' as const,
                                    className: 'justify-between w-full',
                                    span: { col: 3, row: 1 },
                                    columns: [
                                        {   
                                           name: 'PageInformation',
                                           props: {
                                            title: 'Meter Information',
                                            isSectionHeader: true,
                                            layout: 'row',
                                            align: 'between',
                                            gap: 'gap-4',
                                            className: 'text-lg font-semibold'
                                           }
                                        }
                                    ]
                                },
                                // First Row - Basic Meter Information
                                {
                                    layout: 'row' as const,
                                    className: 'justify-between w-full mb-4',
                                    span: { col: 3, row: 1 },
                                    columns: [
                                        {   
                                           name: 'PageInformation',
                                           props: {
                                            gridColumns: 5,
                                            rows: [
                                                {
                                                    layout: 'row',
                                                    className: 'justify-between w-full',
                                                    span: { col: 5, row: 1 },
                                                    items: meterInfoRow1.map(item => ({
                                                        title: item.title,
                                                        value: item.value,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    }))
                                                }
                                            ]
                                           }
                                        }
                                    ]
                                },
                                // Second Row - Meter Configuration
                                {
                                    layout: 'row' as const,
                                    className: 'justify-between w-full',
                                    span: { col: 3, row: 1 },
                                    columns: [
                                        {   
                                           name: 'PageInformation',
                                           props: {
                                            gridColumns: 5,
                                            rows: [
                                                {
                                                    layout: 'row',
                                                    className: 'justify-between w-full',
                                                    span: { col: 5, row: 1 },
                                                    items: meterInfoRow2.map(item => ({
                                                        title: item.title,
                                                        value: item.value,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    }))
                                                }
                                            ]
                                           }
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    // Meter Readings Chart Section
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                        },
                        components: [
                            {
                                name: 'BarChart',
                                props: {
                                    showHeader: true,
                                    headerTitle: 'Meter Readings',
                                    dateRange: '',
                                    availableTimeRanges: ['Daily', 'Weekly', 'Monthly'],
                                    initialTimeRange: 'Daily',
                                    showDownloadButton: true,
                                    height: '400px',
                                    xAxisData: [],
                                    seriesData: [],
                                    seriesColors: ['var(--color-primary)', 'var(--color-secondary)'],
                                    showXAxisLabel: true,
                                    xAxisLabel: 'kWh',
                                    onTimeRangeChange: (range: string) => {
                                        console.log('Time range changed:', range);
                                    },
                                    onViewTypeChange: (viewType: string) => {
                                        console.log('View type changed:', viewType);
                                    },
                                    onDownload: (timeRange: string, viewType: string) => {
                                        console.log('Download requested:', timeRange, viewType);
                                    }
                                }
                            }
                        ]
                    },
                    // Meter History Section
                    {
                        layout:{
                            type:"column" as const,
                            gap:"gap-4"
                        },
                        components:[
                            {
                                name:'Table',
                                props:{
                                    data: meterInfoData,
                                    columns: meterInfoColumns,
                                    actions: meterDetailAction,
                                    showActions: false,
                                    showHeader: true,
                                    headerTitle: 'Meter History',
                                    searchable: true,
                                    pagination: true,
                                    initialRowsPerPage: 10,
                                    className:"[&_.relative]:mt-0",
                                    emptyMessage: "No data available",
                                    loading: isLoading,
                                    availableTimeRanges: [],                                        
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
};

export default MeterDetails;
