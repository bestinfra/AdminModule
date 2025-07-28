import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';

// Removed: import BACKEND_URL from '../config';

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
        type: 'Three Phase',
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

    // Add Feeder Information section (modeled after Feeders.tsx)
    const [meterData2,_setMeterData2] = useState([
        { title: 'Meter CT Ratio', description: 'N/A' },
        { title: 'Meter PT Ratio', description: '25.00 kVA' },
        { title: 'External CT Ratio', description: 'N/A' },
        { title: 'External PT Ratio', description: 'N/A' },
        { title: 'Multiplication Factor', description: 'N/A' },
    ]);
    const [meterData, _setMeterData] = useState([
        { title: 'Meter Sl No.', description: 'A9345417' },
        { title: 'Modem Sl No', description: 'RFDCU_DCU101' },
        { title: 'UID', description: 'BI25GMRA002' },
        { title: 'Assigned To', description: 'Neo Travels' },
        { title: 'Meter Make', description: 'N/A' },
    ]);
        // const _lastComm = meter.readings?.[0]?.readingDate
        //     ? new Date(meter.readings[0].readingDate).toLocaleString()
        //     : 'N/A';

    // Prepare summary cards and info from API data
    const summaryCards = [
        {
            title: 'Current Reading',
            value: meter.readings?.[0]?.kWh
                ? `${meter.readings[0].kWh} kWh`
                : 'N/A',
            icon: '/icons/reading.svg',
            subtitle1: meter.readings?.[0]
                ? `Last Reading: ${meter.readings[0].kWh || 'N/A'} kWh`
                : '',
            subtitle2: '',
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
            icon: '/icons/meter-type.svg',
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
                                className: 'mb-6 border border-primary-border rounded-3xl bg-white p-8',
                                rows: [
                                    // {
                                    //     layout: 'row',
                                    //     className: 'justify-between w-full',
                                    //     span: { col: 3, row: 1 },
                                    //     columns: [
                                    //         {

                                    //         }
                                    //     ],
                                    // },
                                    {
                                        layout: 'grid',
                                        gridColumns: 5,
                                        span: { col: 3, row: 1 },
                                        columns: meterData.map((item) => ({
                                            name: 'SectionHeader',
                                            props: {
                                                title: item.title,
                                                value: item.description,
                                                titleLevel: 2,
                                                titleSize: 'md',
                                                titleVariant: 'primary',
                                                titleWeight: 'bold',
                                                titleAlign: 'left',
                                                layout: 'vertical',
                                                rightComponent: {
                                                    name: 'LastComm',
                                                    props: { description: item.description },
                                                },
                                            },
                                            span: { col: 1, row: 1 },
                                        })),
                                    },
                                    {
                                        layout: 'grid',
                                        gridColumns: 5,
                                        span: { col: 3, row: 1 },
                                        columns: meterData2.map((item) => ({
                                            name: 'SectionHeader',
                                            props: {
                                                title: item.title,
                                                value: item.description,
                                                titleLevel: 2,
                                                titleSize: 'md',
                                                titleVariant: 'primary',
                                                titleWeight: 'bold',
                                                titleAlign: 'left',
                                                layout: 'vertical',
                                                rightComponent: {
                                                    name: 'LastComm',
                                                    props: { description: item.description },
                                                },
                                            },
                                            span: { col: 1, row: 1 },
                                        })),
                                    },
                                    // Meter Config Ratios row (now inside Feeder Information)
                                    // {
                                    //     layout: 'grid',
                                    //     gridColumns: 5,
                                    //     span: { col: 5, row: 1 },
                                    //     columns: [
                                    //         {
                                    //             name: 'SectionHeader',
                                    //             props: {
                                    //                 title: 'Meter CT Ratio',
                                    //                 value: meter.config?.ctRatio || 'N/A',
                                    //                 titleLevel:2,
                                    //                 titleSize: 'sm',
                                    //                 titleVariant: 'primary',
                                    //                 titleWeight: 'bold',
                                    //                 titleAlign: 'left',
                                    //                 layout: 'vertical',
                                    //                 rightComponent: { name: 'LastComm', props: { value: lastComm } },
                                    //             },
                                    //             // span: { col: 1, row: 1 },
                                    //         },
                                    //         {
                                    //             name: 'SectionHeader',
                                    //             props: {
                                    //                 title: 'Meter PT Ratio',
                                    //                 value: meter.config?.ptRatio || 'N/A',
                                    //                 titleLevel: 2,
                                    //                 titleSize: 'sm',
                                    //                 titleVariant: 'primary',
                                    //                 titleWeight: 'bold',
                                    //                 titleAlign: 'left',
                                    //                 layout: 'vertical',
                                                    
                                    //             },
                                    //         },
                                    //         {
                                    //             name: 'SectionHeader',
                                    //             props: {
                                    //                 title: 'External CT Ratio',
                                    //                 value: meter.config?.adoptedCTRatio || 'N/A',
                                    //                 titleLevel: 2,
                                    //                 titleSize: 'sm',
                                    //                 titleVariant: 'primary',
                                    //                 titleWeight: 'bold',
                                    //                 titleAlign: 'left',
                                    //                 layout: 'vertical',
                                    //             },
                                    //             span: { col: 1, row: 1 },
                                    //         },
                                    //         {
                                    //             name: 'SectionHeader',
                                    //             props: {
                                    //                 title: 'External PT Ratio',
                                    //                 value: meter.config?.adoptedPTRatio || 'N/A',
                                    //                 titleLevel: 2,
                                    //                 titleSize: 'sm',
                                    //                 titleVariant: 'primary',
                                    //                 titleWeight: 'bold',
                                    //                 titleAlign: 'left',
                                    //                 layout: 'vertical',
                                    //             },
                                    //             span: { col: 1, row: 1 },
                                    //         },
                                    //         {
                                    //             name: 'SectionHeader',
                                    //             props: {
                                    //                 title: 'Multiplication Factor',
                                    //                 value: meter.config?.mf || 'N/A',
                                    //                 titleLevel: 2,
                                    //                 titleSize: 'sm',
                                    //                 titleVariant: 'primary',
                                    //                 titleWeight: 'bold',
                                    //                 titleAlign: 'left',
                                    //                 layout: 'vertical',
                                    //             },
                                    //             span: { col: 1, row: 1 },
                                    //         },
                                    //     ],
                                    // },
                                ],
                            },
                        },
                        // Meter History Section
                        {
                            layout:{
                                type:"column" as const,
                                className:"mb-8"
                            },
                            components:[
                                {
                                    name:"Heading",
                                    props:{
                                        text:"Meter History",
                                        level:2,
                                        className:"text-lg font-semibold mb-4"
                                    }
                                },
                                {
                                    name:'Table',
                                    props:{
                                        data:meterInfoData,
                                        columns:meterInfoColumns,
                                        actions:meterDetailAction,
                                        showActions:true,
                                        searchable:true,
                                        pagination:true,
                                        initialRowsPerPage:10,
                                        className:"[&_.relative]:mt-0",
                                        emptyMessage:"No Meter Information Found",
                                        onRowClick:()=>{
                                            navigate(`/meters/${meter.serialNumber}`)
                                        }
                                        
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
