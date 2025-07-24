import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/global/PageC';
// import Table from '@components/global/Table';
// Removed: import BACKEND_URL from '../config';

const MeterDetails: React.FC = () => {
    const navigate = useNavigate();

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

    const meterInfo = [
        { label: 'Meter SI No.', value: meter.serialNumber || 'N/A' },
        {
            label: 'Modem SI No',
            value: meter.modem?.modem_sl_no || 'N/A',
        },
        { label: 'UID', value: meter.meterNumber || 'N/A' },
        { label: 'Assigned To', value: meter.consumer?.name || 'N/A' },
        { label: 'Meter Make', value: meter.manufacturer || 'N/A' },
        {
            label: 'Meter CT Ratio',
            value: meter.config?.ctRatio || 'N/A',
        },
        {
            label: 'Meter PT Ratio',
            value: meter.config?.ptRatio || 'N/A',
        },
        {
            label: 'External CT Ratio',
            value: meter.config?.adoptedCTRatio || 'N/A',
        },
        {
            label: 'External PT Ratio',
            value: meter.config?.adoptedPTRatio || 'N/A',
        },
        {
            label: 'Multiplication Factor',
            value: meter.config?.mf || 'N/A',
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
                                },
                            })),
                        },
                    ]}
                />
                {/* Custom sections outside of PageC */}
                <div className="mt-6 space-y-6">
                    {/* Meter Information Section */}
                    <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-6">
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
                    </div>
                    {/* Meter History Section */}
                    <div className="bg-white dark:bg-primary-dark border border-primary-border dark:border-dark-border rounded-3xl p-4">
                        <h2 className="text-xl font-semibold text-neutral-darker mb-4">
                            Meter History
                        </h2>
                        <div className="bg-white dark:bg-primary-dark">
                            <div className="p-4">
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
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default MeterDetails;
