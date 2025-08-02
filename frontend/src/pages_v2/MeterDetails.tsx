import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
// Meter Information Data (moved outside component)
const METER_INFO_ROW_1 = [
    { title: 'Meter Sl No.', value: 'A9345417' },
    { title: 'Modem Sl No', value: 'RFDCU_DCU101' },
    { title: 'UID', value: 'BI25GMRA002' },
    { title: 'Assigned To', value: 'Neo Travels' },
    { title: 'Meter Make', value: 'Secure Meters Ltd' },
];

const METER_INFO_ROW_2 = [
    { title: 'Meter CT Ratio', value: '200/5' },
    { title: 'Meter PT Ratio', value: '11000/110' },
    { title: 'External CT Ratio', value: '150/5' },
    { title: 'External PT Ratio', value: '11000/110' },
    { title: 'Multiplication Factor', value: '40' },
];

const MeterDetails: React.FC = () => {
    const navigate = useNavigate();
    const meterDetailAction = [
        {
          label: "View",
          icon: "/icons/eye.svg",
        },
        {
            label:'edit',
            icon:'/icons/edit.svg'

        },
        {
            label:'delete',
            icon:'/icons/delete.svg'
            
        }
      ];
    // Always use demo data
    const DEMO_METER = {
            serialNumber: 'A9211434',
        meterNumber: 'BI25GMRA001',
        readings: [
            {
                kWh: 180,
                readingDate: '2024-07-24T10:00:00Z',
            },
        ],
        status: 'Active',
        type: 'Prepaid',
        phase: 'Three Phase',
        location: { name: 'Main Building' },
        installationDate: '2023-01-01T00:00:00Z',
        modem: { modem_sl_no: 'MDM123456' },
        consumer: { name: 'Current Consumer' },
        manufacturer: 'Secure',
        config: {
            ctRatio: '200/5',
            ptRatio: '11000/110',
            adoptedCTRatio: '200/5',
            adoptedPTRatio: '11000/110',
            mf: '40',
        },
    };

    const meter = DEMO_METER;

    // Prepare summary cards and info from API data - Using BRAND_GREEN (default) for all cards
    const summaryCards = [
        {
            title: 'Current Reading',
            value: meter.readings?.[0]?.kWh
                ? `${meter.readings[0].kWh} kWh`
                : 'N/A',
            icon: '/icons/current-reading.svg',
            subtitle1: meter.readings?.[0]
                ? `Last Reading: ${meter.readings[0].kWh || 'N/A'} kWh`
                : '',
            subtitle2: 'Consumption: 160.99 kWh',
        },
        {
            title: 'Status',
            value: meter.status || 'N/A',
            icon: '/icons/status.svg',
            subtitle1: meter.readings?.[0]?.readingDate
                ? `Last Communication: ${new Date(
                      meter.readings[0].readingDate
                  ).toLocaleString()}`
                : '',
            subtitle2: '',
        },
        {
            title: 'Meter Type',
            value: meter.type || 'N/A',
            icon: '/icons/units.svg',
            subtitle1: `Phase Type: ${meter.phase || 'N/A'}`,
            subtitle2: '',
        },
        {
            title: 'Location',
            value: meter.location?.name || '',
            icon: '/icons/location.svg',
            subtitle1: `Installation Date: ${
                meter.installationDate
                    ? new Date(meter.installationDate).toLocaleDateString()
                    : 'N/A'
            }`,
            subtitle2: '',
        },
    ];

    // Dummy columns and data for Meter Information Table
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
    // Example data showing differences for demonstration
    const meterInfoData = [
        { 
            slNo: 1, 
            meterSlNo: meter.serialNumber, 
            modemSlNo: meter.modem?.modem_sl_no, 
            meterType: meter.type, 
            meterMake: meter.manufacturer, 
            consumerName: meter.consumer?.name, 
            location: meter.location?.name, 
            installationDate: meter.installationDate 
        },
        { 
            slNo: 2, 
            meterSlNo: "A9345417", 
            modemSlNo: "RFDCU_DCU101", 
            meterType: "Prepaid", 
            meterMake: "LnT DLMS", 
            consumerName: "Neo Travels", 
            location: "NA", 
            installationDate: "NA" 
        },
        { 
            slNo: 3, 
            meterSlNo: "A9211433", 
            modemSlNo: "RFDCU_DCU101", 
            meterType: "Prepaid", 
            meterMake: "LnT DLMS", 
            consumerName: "Mobikins", 
            location: "NA", 
            installationDate: "NA" 
        },
        { 
            slNo: 4, 
            meterSlNo: "A9211434", 
            modemSlNo: "RFDCU_DCU101", 
            meterType: "Prepaid", 
            meterMake: "LnT DLMS", 
            consumerName: "Airborne General Store", 
            location: "NA", 
            installationDate: "NA" 
        },
        { 
            slNo: 5, 
            meterSlNo: "A9211435", 
            modemSlNo: "RFDCU_DCU102", 
            meterType: "Postpaid", 
            meterMake: "Genus", 
            consumerName: "Test Consumer", 
            location: "Test Location", 
            installationDate: "2023-12-01" 
        },
        { 
            slNo: 6, 
            meterSlNo: "A9211436", 
            modemSlNo: "RFDCU_DCU103", 
            meterType: "Prepaid", 
            meterMake: "Genus", 
            consumerName: "Another Consumer", 
            location: "Another Location", 
            installationDate: "2024-01-15" 
        },
        { 
            slNo: 7, 
            meterSlNo: "A9211437", 
            modemSlNo: "RFDCU_DCU104", 
            meterType: "Postpaid", 
            meterMake: "Secure", 
            consumerName: "Sample Name", 
            location: "Sample Location", 
            installationDate: "2024-02-20" 
        },
        { 
            slNo: 8, 
            meterSlNo: "A9211438", 
            modemSlNo: "RFDCU_DCU105", 
            meterType: "Prepaid", 
            meterMake: "Secure", 
            consumerName: "Demo User", 
            location: "Demo Location", 
            installationDate: "2024-03-10" 
        },
        { 
            slNo: 9, 
            meterSlNo: "A9211439", 
            modemSlNo: "RFDCU_DCU106", 
            meterType: "Prepaid", 
            meterMake: "Genus", 
            consumerName: "Test User", 
            location: "Test Area", 
            installationDate: "2024-04-05" 
        },
    ];
   
    // const historyColumns = [
    //     { key: 'consumerName', label: 'Consumer Name' },
    //     { key: 'startDate', label: 'Start Date' },
    //     { key: 'endDate', label: 'End Date' },
    //     { key: 'paymentStatus', label: 'Payment Status' },
    //     { key: 'status', label: 'Status' },
    // ];

    // // Dummy history data (replace with real API data if available)
    // const historyData = [
    //     {
    //         consumerName: 'John Doe',
    //         startDate: '2023-01-01',
    //         endDate: '2023-06-30',
    //         paymentStatus: 'Completed',
    //         status: 'Completed',
    //     },
    //     {
    //         consumerName: 'Jane Smith',
    //         startDate: '2023-07-01',
    //         endDate: '2023-12-31',
    //         paymentStatus: 'Overdue',
    //         status: 'Completed',
    //     },
    //     {
    //         consumerName: 'Current Consumer',
    //         startDate: '2024-01-01',
    //         endDate: 'Present',
    //         paymentStatus: 'Pending',
    //         status: 'Active',
    //     },
    // ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen">
                <Page
                    sections={[
                        // Meter Details Header
                        {
                            layout: {
                                type: 'column',
                                gap: 'gap-6',
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
                                                        items: METER_INFO_ROW_1.map(item => ({
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
                                                        items: METER_INFO_ROW_2.map(item => ({
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
                                        dateRange: 'Last 7 Days',
                                        availableTimeRanges: ['Daily', 'Weekly', 'Monthly'],
                                        initialTimeRange: 'Daily',
                                        showDownloadButton: true,
                                        showViewToggle: true,
                                        viewToggleOptions: ['Graph', 'Table'],
                                        initialViewType: 'Graph',
                                        height: '400px',
                                        xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                        seriesData: [
                                            {
                                                name: 'Energy Consumption (kWh)',
                                                data: [180, 195, 210, 185, 200, 175, 190]
                                            },
                                            {
                                                name: 'Peak Demand (kW)',
                                                data: [45, 52, 48, 43, 50, 38, 42]
                                            }
                                        ],
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
                                        data:meterInfoData,
                                        columns:meterInfoColumns,
                                        actions:meterDetailAction,
                                        showActions:false,
                                        showHeader: true,
                                        headerTitle: 'Meter History',
                                        searchable:true,
                                        pagination:true,
                                        initialRowsPerPage:10,
                                        className:"[&_.relative]:mt-0",
                                        emptyMessage:"No Meter Information Found",
                                        onRowClick:()=>{
                                            navigate(`/meters/${meter.serialNumber}`)
                                        },
                                        availableTimeRanges: [],                                        
                                    }
                                }
                            ]
                        }
                        
                    ]}
                />
                {/* Custom sections outside of PageC */}
                {/* <div className="mt-6 space-y-6"> */}
                    {/* Meter Information Section */}
                    {/* <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-6">
                        <h2 className="text-xl font-semibold text-neutral-darker mb-4">
                            Meter Information
                        </h2>
                        <div className="grid grid-cols-5 gap-4">
                            {meterInfo.map((infoItem, index) => (
                                <div key={index} className="mb-2">
                                    <div className="text-neutral text-sm mb-1">
                                        {infoItem.label}
                                    </div>
                                    <div className="text-base font-semibold text-neutral-darker">
                                        {infoItem.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                    {/* Meter History Section */}
                    {/* <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-4">
                        <h2 className="text-xl font-semibold text-neutral-darker mb-4">
                            Meter History
                        </h2>
                        <div className="bg-white dark:bg-primary-dark">
                            <div className="p-4"> */}
                                {/* <Table
                                    data={historyData}
                                    columns={historyColumns}
                                    loading={false}
                                    searchable={true}
                                    pagination={true}
                                    showActions={false}
                                    className="[&_.relative]:mt-0"
                                /> */}
                            </div>
                        {/* </div>
                    </div>
                </div> */}
            {/* </div> */}
        </Suspense>
    );
};

export default MeterDetails;
