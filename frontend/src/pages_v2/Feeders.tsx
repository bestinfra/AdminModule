import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Page from '@/components/global/PageC';
import { exportChartData } from '@/utils/excelExport';
import { FILTER_STYLES } from '@/contexts/FilterStyleContext';
import BACKEND_URL from '../config';

// Default stats data
const defaultStats = [
    { title: 'R-Phase Voltage', value: '257.686', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8', valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE },
    { title: 'Y-Phase Voltage', value: '255.089', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-warning-alt)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
    { title: 'B-Phase Voltage', value: '254.417', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
    { title: 'Apparent Power', value: '19.527', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
    { title: 'MD-kVA', value: '52.220', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
    { title: 'R-Phase Current', value: '15.892', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
    { title: 'Y-Phase Current', value: '27.644', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-warning-alt)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
    { title: 'B-Phase Current', value: '33.984', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8',valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base' ,iconStyle: FILTER_STYLES.WHITE},
    { title: 'Neutral Current', value: '12.980', icon: '/icons/consumption.svg', subtitle1: 'Amps' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
    { title: 'Frequency', value: '49.980', icon: '/icons/frequency.svg', subtitle1: 'Hz' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
    { title: 'R-Phase PF', value: '1.000', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE}, 
    { title: 'Y-Phase PF', value: '-0.987', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-warning-alt)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
    { title: 'B-Phase PF', value: '0.998', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
    { title: 'Avg PF', value: '-0.999', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
    { title: 'Cummulative kVAh', value: '77902.296', icon: '/icons/consumption.svg', subtitle1: 'kVAh' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
];

const Feeders = () => {
    const { dtrId, feederId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    console.log('Feeders Page - DTR ID:', dtrId, 'Feeder ID:', feederId);
    
    // Get passed data from navigation state
    const passedData = location.state as {
        feederData?: {
            sNo: number;
            feederName: string;
            loadStatus: string;
            rating: string;
            address: string;
        };
        dtrId?: string;
        dtrName?: string;
        dtrNumber?: string;
    } | null;
    
    // Determine if this is an individual feeder page or DTR page
    const isIndividualFeeder = !!feederId;
    const currentFeederId = feederId || dtrId;
    
    // Use passed feeder data if available, otherwise use default
    const feederData = passedData?.feederData;

    // State for API data
    const [instantaneousStatsData, setInstantaneousStatsData] = useState<any>({});
    const [consumptionAnalyticsData, setConsumptionAnalyticsData] = useState<any>({});
    const [feederInfoData, setFeederInfoData] = useState<any>({});
    const [, setLoading] = useState({
        instantaneous: false,
        consumption: false,
        feederInfo: false
    });

    // API Functions
    const fetchInstantaneousStats = async () => {
        // Use numeric ID from passed data or extract from dtrNumber
        const numericDtrId = passedData?.dtrId || (dtrId && dtrId.match(/\d+/)?.[0]) || dtrId;
        if (!numericDtrId) return;

        setLoading(prev => ({ ...prev, instantaneous: true }));
        try {
            const response = await fetch(`${BACKEND_URL}/dtrs/${numericDtrId}/instantaneousStats`);
            const data = await response.json();
            
            if (data.success) {
                setInstantaneousStatsData(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch instantaneous stats');
            }
        } catch (error) {
            console.error('Error fetching instantaneous stats:', error);
            // Fallback to demo data
            setInstantaneousStatsData({});
        } finally {
            setLoading(prev => ({ ...prev, instantaneous: false }));
        }
    };

    const fetchConsumptionAnalytics = async () => {
        // Use numeric ID from passed data or extract from dtrNumber
        const numericDtrId = passedData?.dtrId || (dtrId && dtrId.match(/\d+/)?.[0]) || dtrId;
        if (!numericDtrId) return;

        setLoading(prev => ({ ...prev, consumption: true }));
        try {
            const response = await fetch(`${BACKEND_URL}/dtrs/${numericDtrId}/consumptionAnalytics`);
            const data = await response.json();
            
            if (data.status === 'success') {
                // Transform the data to match frontend expectations
                const transformedData = {
                    xAxisData: data.data.dailyData?.xAxisData || [],
                    seriesData: [{
                        name: 'Consumption',
                        data: data.data.dailyData?.sums?.map((sum: string) => parseFloat(sum)) || []
                    }],
                    monthly: {
                        xAxisData: data.data.monthlyData?.xAxisData || [],
                        seriesData: [{
                            name: 'Consumption',
                            data: data.data.monthlyData?.sums?.map((sum: string) => parseFloat(sum)) || []
                        }]
                    }
                };
                setConsumptionAnalyticsData(transformedData);
            } else {
                throw new Error(data.message || 'Failed to fetch consumption analytics');
            }
        } catch (error) {
            console.error('Error fetching consumption analytics:', error);
            // Fallback to demo data
            setConsumptionAnalyticsData({});
        } finally {
            setLoading(prev => ({ ...prev, consumption: false }));
        }
    };

    const fetchFeederInfo = async () => {
        // Use numeric ID from passed data or extract from dtrNumber
        const numericDtrId = passedData?.dtrId || (dtrId && dtrId.match(/\d+/)?.[0]) || dtrId;
        if (!numericDtrId) return;

        setLoading(prev => ({ ...prev, feederInfo: true }));
        try {
            const response = await fetch(`${BACKEND_URL}/dtrs/${numericDtrId}`);
            const data = await response.json();
            
            if (data.success) {
                setFeederInfoData(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch feeder information');
            }
        } catch (error) {
            console.error('Error fetching feeder information:', error);
            // Fallback to demo data
            setFeederInfoData({});
        } finally {
            setLoading(prev => ({ ...prev, feederInfo: false }));
        }
    };

    // Generate stats from API data or use defaults
    const getStats = () => {
        if (instantaneousStatsData && Object.keys(instantaneousStatsData).length > 0) {
            return [
                { title: 'R-Phase Voltage', value: instantaneousStatsData.rphVolt?.toString() || '257.686', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8', valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE },
                { title: 'Y-Phase Voltage', value: instantaneousStatsData.yphVolt?.toString() || '255.089', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-warning-alt)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
                { title: 'B-Phase Voltage', value: instantaneousStatsData.bphVolt?.toString() || '254.417', icon: '/icons/r-phase-voltage.svg', subtitle1: 'Volts', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
                { title: 'Apparent Power', value: instantaneousStatsData.instantKVA?.toString() || '19.527', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
                { title: 'MD-kVA', value: instantaneousStatsData.mdKVA?.toString() || '52.220', icon: '/icons/consumption.svg', subtitle1: 'kVA' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
                { title: 'R-Phase Current', value: instantaneousStatsData.rphCurr?.toString() || '15.892', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
                { title: 'Y-Phase Current', value: instantaneousStatsData.yphCurr?.toString() || '27.644', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-warning-alt)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
                { title: 'B-Phase Current', value: instantaneousStatsData.bphCurr?.toString() || '33.984', icon: '/icons/r-phase-current.svg', subtitle1: 'Amps', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-3 h-3', width: 'w-8', height: 'h-8',valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base' ,iconStyle: FILTER_STYLES.WHITE},
                { title: 'Neutral Current', value: instantaneousStatsData.neutralCurrent?.toString() || '12.980', icon: '/icons/consumption.svg', subtitle1: 'Amps' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
                { title: 'Frequency', value: instantaneousStatsData.freqHz?.toString() || '49.980', icon: '/icons/frequency.svg', subtitle1: 'Hz' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
                { title: 'R-Phase PF', value: instantaneousStatsData.rphPF?.toString() || '1.000', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-danger)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE}, 
                { title: 'Y-Phase PF', value: instantaneousStatsData.yphPF?.toString() || '-0.987', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-warning-alt)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
                { title: 'B-Phase PF', value: instantaneousStatsData.bphPF?.toString() || '0.998', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor', bg: 'bg-[var(--color-primary)]', iconClassName: 'w-4 h-4', width: 'w-8', height: 'h-8' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.WHITE},
                { title: 'Avg PF', value: instantaneousStatsData.avgPF?.toString() || '-0.999', icon: '/icons/power-factor.svg', subtitle1: 'Power Factor' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
                { title: 'Cummulative kVAh', value: instantaneousStatsData.cumulativeKVAh?.toString() || '77902.296', icon: '/icons/consumption.svg', subtitle1: 'kVAh' ,valueFontSize: 'text-lg lg:text-xl md:text-lg sm:text-base',iconStyle: FILTER_STYLES.BRAND_GREEN},
            ];
        }
        return defaultStats;
    };

    // Monthly consumption data - will be updated from API
    const getMonthlyConsumptionData = () => {
        if (consumptionAnalyticsData && consumptionAnalyticsData.monthly) {
            return {
                xAxisData: consumptionAnalyticsData.monthly.xAxisData || [
                    'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025',
                ],
                seriesData: consumptionAnalyticsData.monthly.seriesData || [
                    {
                        name: 'Consumption',
                        data: [0, 0, 0, 0, 0, 0, 0, 6000, 14000, 18000, 17000, 16000, 0],
                    },
                ],
            };
        }
        return {
            xAxisData: [
                'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025',
            ],
            seriesData: [
                {
                    name: 'Consumption',
                    data: [0, 0, 0, 0, 0, 0, 0, 6000, 14000, 18000, 17000, 16000, 0],
                },
            ],
        };
    };

    // Load data on component mount
    useEffect(() => {
        if (dtrId) {
            fetchInstantaneousStats();
            fetchConsumptionAnalytics();
            fetchFeederInfo();
        }
    }, [dtrId]);

    // Enhanced data for Alerts Table with more entries
    const [alertsData] = useState([
        {
            alertId: 'ALRT-001',
            type: 'Over Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-30 21:15:00',
        },
        {
            alertId: 'ALRT-002',
            type: 'Under Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-29 18:45:00',
        },
        {
            alertId: 'ALRT-003',
            type: 'Power Failure',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-28 14:30:00',
        },
        {
            alertId: 'ALRT-004',
            type: 'Phase Imbalance',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-27 10:20:00',
        },
        {
            alertId: 'ALRT-005',
            type: 'Over Current',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-26 08:10:00',
        },
        {
            alertId: 'ALRT-006',
            type: 'Frequency Deviation',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-25 16:45:00',
        },
        {
            alertId: 'ALRT-007',
            type: 'Power Factor Low',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-24 12:30:00',
        },
        {
            alertId: 'ALRT-008',
            type: 'Over Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-23 09:15:00',
        },
        {
            alertId: 'ALRT-009',
            type: 'Communication Loss',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-22 07:20:00',
        },
        {
            alertId: 'ALRT-010',
            type: 'Under Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-21 15:40:00',
        },
        {
            alertId: 'ALRT-011',
            type: 'Phase Imbalance',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-20 11:25:00',
        },
        {
            alertId: 'ALRT-012',
            type: 'Over Current',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-19 13:50:00',
        },
        {
            alertId: 'ALRT-013',
            type: 'Power Failure',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-18 20:35:00',
        },
        {
            alertId: 'ALRT-014',
            type: 'Frequency Deviation',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-17 18:10:00',
        },
        {
            alertId: 'ALRT-015',
            type: 'Power Factor Low',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-16 14:45:00',
        },
        {
            alertId: 'ALRT-016',
            type: 'Over Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-15 10:20:00',
        },
        {
            alertId: 'ALRT-017',
            type: 'Communication Loss',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-14 08:55:00',
        },
        {
            alertId: 'ALRT-018',
            type: 'Under Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-13 16:30:00',
        },
        {
            alertId: 'ALRT-019',
            type: 'Phase Imbalance',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-12 12:15:00',
        },
        {
            alertId: 'ALRT-020',
            type: 'Over Current',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-11 19:40:00',
        },
        {
            alertId: 'ALRT-021',
            type: 'Power Failure',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-10 22:05:00',
        },
        {
            alertId: 'ALRT-022',
            type: 'Frequency Deviation',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-09 17:30:00',
        },
        {
            alertId: 'ALRT-023',
            type: 'Power Factor Low',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-08 13:45:00',
        },
        {
            alertId: 'ALRT-024',
            type: 'Over Voltage',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-07 09:20:00',
        },
        {
            alertId: 'ALRT-025',
            type: 'Communication Loss',
            feederName: 'D1F1(32500114)',
            occuredOn: '2025-06-06 11:35:00',
        },
    ]);

    // Replace feederDescriptions and feederInfo with feederData and lastComm   
    const [_feederData, _setFeederData] = useState([
        { title: 'Feeder Name', description: 'D1F1(32500114)' },
        { title: 'Rating', description: '25.00 kVA' },
        { title: 'Address', description: 'Waddepally, Warangal, Telangana, India, 506001' },
    ]);

    // Handle Excel download for daily consumption chart
    const handleDailyChartDownload = () => {
        // Use consumption analytics data if available, otherwise use demo data
        const xAxisData = consumptionAnalyticsData.xAxisData || [
            '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul',
        ];
        const seriesData = consumptionAnalyticsData.seriesData || [
            {
                name: 'Consumption',
                data: [
                    572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 610, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572,
                ],
            },
        ];
        exportChartData(xAxisData, seriesData, 'feeder-daily-consumption-data');
    };

    // Handle Excel download for monthly consumption chart
    const handleMonthlyChartDownload = () => {
        const monthlyData = getMonthlyConsumptionData();
        exportChartData(monthlyData.xAxisData, monthlyData.seriesData, 'feeder-monthly-consumption-data');
    };

    return (
        <Page
            sections={[
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'w-full',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'w-full',
                                columns: [
                                    {
                                        name: 'PageHeader',
                                        props: {
                                            title: isIndividualFeeder ? `Feeder ${feederData?.feederName || currentFeederId}` : 'Feeder Information',
                                            onBackClick: () => {
                                                if (isIndividualFeeder) {
                                                    // Go back to the specific DTR detail page if we have the DTR ID
                                                    if (passedData?.dtrId) {
                                                        navigate(`/dtr-detail/${passedData.dtrId}`);
                                                    } else {
                                                        navigate('/dtr-dashboard');
                                                    }
                                                } else {
                                                    window.history.back();
                                                }
                                            },
                                            backButtonText: isIndividualFeeder ? (passedData?.dtrName ? `Back to ${passedData.dtrName}` : 'Back to DTR Dashboard') : 'Back to Dashboard',
                                            buttonsLabel: 'Export Data',
                                            variant: 'primary',
                                            onClick: () => handleDailyChartDownload(),
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 3,
                        className: 'border border-primary-border rounded-3xl bg-white p-4',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 3, row: 1 },
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: isIndividualFeeder ? `Feeder ${feederData?.feederName || currentFeederId} Information` : 'DTR Information',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                            defaultTitleHeight:'0',
                                        },
                                    },
                                ],
                            },
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 3, row: 1 },
                                columns: [
                                    {   
                                       name: 'PageInformation',
                                       props: {
                                        gridColumns: 3,
                                        rows: [
                                            {
                                                layout: 'row',
                                                className: 'justify-between w-full',
                                                span: { col: 3, row: 1 },
                                                items: [
                                                    {
                                                        title: 'DTR Number',
                                                        value: feederInfoData?.dtr?.dtrNumber || 'DTR-007',
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Capacity',
                                                        value: `${feederInfoData?.dtr?.capacity || 100} kVA`,
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Status',
                                                        value: feederInfoData?.dtr?.status || 'ACTIVE',
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    },
                                                    {
                                                        title: 'Total Feeders',
                                                        value: feederInfoData?.totalFeeders?.toString() || '1',
                                                        align: 'start',
                                                        gap: 'gap-1'
                                                    }
                                                ]
                                            }
                                        ]
                                       }
                                    }
                                ]
                            }
                        ],
                    },
                },
              
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'w-full p-4 border border-primary-border rounded-3xl',
                        rows: [
                            {
                                layout: 'row' as const,
                                className: 'justify-between w-full',
                                span: { col: 1, row: 1 },
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: isIndividualFeeder ? `Feeder ${feederData?.feederName || currentFeederId} Information` : 'Instantaneous Stats',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                            className:'w-full',
                                            rightComponent: { name: 'LastComm', props: { value: instantaneousStatsData?.lastCommDate ? new Date(instantaneousStatsData.lastCommDate).toLocaleString() : '2024-01-15 14:30:00' } },
                                        },
                                        span: { col: 1, row: 1 },
                                    },
                                ],
                            },
                            {
                                layout: 'grid' as const,
                                gridColumns: 5,
                                className: 'w-full gap-4',
                                columns: getStats().map((stat: any) => ({
                                    name: 'Card',
                                    props: {
                                        title: stat.title,
                                        value: stat.value,
                                        subtitle1: stat.subtitle1,
                                        icon: stat.icon,
                                        bg: stat.bg ,
                                        iconClassName: stat.iconClassName || 'w-4 h-4',
                                        iconStyle: stat.iconStyle || FILTER_STYLES.WHITE,
                                        width: stat.width || 'w-8',
                                        height: stat.height || 'h-8',
                                        valueFontSize: stat.valueFontSize || 'text-lg lg:text-xl md:text-lg sm:text-base',
                                    },
                                    span: { col: 1, row: 1 },
                                })),
                            },
                        ],
                    },
                },
               
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        rows: [
                            {
                                layout: 'grid' as const,
                                className:"w-full",
                                columns: [
                                    {
                                        name: 'BarChart',
                                        props: {
                                            xAxisData: getMonthlyConsumptionData().xAxisData,
                                            seriesData: getMonthlyConsumptionData().seriesData,
                                            height: 320,
                                            showHeader: true,  
                                            headerTitle: 'Consumption Metrics Bar Chart',
                                            className: 'w-full',
                                            dateRange: 'Last 30 days',
                                            showDownloadButton: true,
                                            onDownload: () => handleMonthlyChartDownload(),
                                            showXAxisLabel: true,
                                            xAxisLabel: 'kWAh',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        rows: [
                            {
                                layout: 'grid' as const,
                                gridColumns:1,
                                columns: [
                                    {
                                        name: 'BarChart',
                                        props: {
                                            xAxisData: [
                                                '6 May', '7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May', '14 May', '15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May', '22 May', '23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May', '1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul',
                                            ],
                                            seriesData: [
                                                {
                                                    name: 'Consumption',
                                                    data: [
                                                        572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 610, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572, 572,
                                                    ],
                                                },
                                            ],
                                            height: 320,
                                            ariaLabel: ' kVA Metrics Bar Chart',
                                            showHeader: true,
                                            handleDownload: handleDailyChartDownload,
                                            headerTitle: 'kVA Metrics',
                                            className: 'w-full',
                                            dateRange: 'Last 30 days',
                                            availableTimeRanges: ['Daily', 'Monthly', 'Yearly'],
                                            initialTimeRange: 'Daily',
                                            onTimeRangeChange: (range: string) => console.log('Time range changed to:', range),
                                            showDownloadButton: true,
                                            onDownload: () => handleDailyChartDownload(),
                                            showXAxisLabel: true,
                                            xAxisLabel: 'kVA',
                                        },
                                        span: { col: 1, row: 1 },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: 'border border-primary-border rounded-3xl p-4',
                        rows: [
                            {
                                layout: 'row' as const,
                                columns: [
                                    {
                                        name: 'SectionHeader',
                                        props: {
                                            title: 'Feeder Location',
                                            titleLevel: 2,
                                            titleSize: 'md',
                                            titleVariant: 'primary',
                                            titleWeight: 'bold',
                                            titleAlign: 'left',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    layout: {
                        type: 'grid' as const,
                        columns: 1,
                        className: '',
                        rows: [
                            {
                                layout: 'grid' as const,
                                gridColumns:1,
                                className:'pb-4',
                                columns: [
                                    {
                                        name: 'Table',
                                        props: {
                                            columns: [
                                                { key: 'alertId', label: 'Alert ID' },
                                                { key: 'type', label: 'Type' },
                                                { key: 'feederName', label: 'Feeder Name' },
                                                { key: 'occuredOn', label: 'Occured On' },
                                            ],
                                            data: alertsData,
                                            searchable: true,
                                            pagination: true,
                                            initialRowsPerPage: 10,
                                            rowsPerPageOptions: [5, 10, 15, 20, 25],
                                            emptyMessage: 'No Alerts Found',
                                            showActions: true,
                                            showHeader: 'true',
                                            headerTitle: 'Alerts',
                                            showPaginationInfo: true,
                                            showRowsPerPageSelector: true,
                                            className: 'w-full',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ]}
        />
    );
};

export default Feeders;
