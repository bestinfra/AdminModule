import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '@components/global/PageHeader';
import Button from '@components/global/Button';

interface UsageData {
    previous_reading: string;
    final_reading: string;
    electricity_usage: string;
    electricity_charges: string;
    tariff_applied: string;
    previous_reading_timestamp: string;
    final_reading_timestamp: string;
    items: Array<{
        label: string;
        cost: string;
        isExpandable: boolean;
        type: string;
    }>;
    finalAmount: Array<{
        label: React.ReactNode;
        cost: string;
    }>;
}

interface UsageSummaryPageProps {
    // currentStep?: number;
    onStepChange?: (step: number) => void;
    meter_no?: string;
    unit_id?: string;
    previous_reading?: string;
    final_reading?: string;
    electricity_usage?: string;
    electricity_charges?: string;
    onDataUpdate?: (data: any) => void;
    className?: string;
}

const UsageSummaryPage: React.FC<UsageSummaryPageProps> = ({
    // currentStep = 2,
    // currentStep = 2,
    onStepChange,
    meter_no: propMeterNo,
    unit_id: propUnitId,
    previous_reading: propPreviousReading,
    final_reading: propFinalReading,
    electricity_usage: propElectricityUsage,
    electricity_charges: propElectricityCharges,
    onDataUpdate,
    className = ''
}) => {
    const navigate = useNavigate();
    const { meter_no: paramMeterNo } = useParams<{ meter_no: string }>();
    const location = useLocation();
    const { unit_id: locationUnitId } = location.state || {};
    
    // Use props data if available, otherwise fall back to params/location
    const finalMeterNo = propMeterNo || paramMeterNo;
    const finalUnitId = propUnitId || locationUnitId;
    
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOtherCharges, setShowOtherCharges] = useState(false);
    const [showAdvanceAmount, setShowAdvanceAmount] = useState(false);
    // const [paymentType, setPaymentType] = useState('prepaid');
    // const [advanceAmount, setAdvanceAmount] = useState('0.00');
    // const [adhocCreditCharges, setAdhocCreditCharges] = useState('0.00');
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState({
        previous_reading: '',
        final_reading: '',
        electricity_usage: '',
        electricity_charges: ''
    });
    const [usageData, setUsageData] = useState<UsageData>({
        previous_reading: propPreviousReading || '',
        final_reading: propFinalReading || '',
        electricity_usage: propElectricityUsage || '',
        electricity_charges: propElectricityCharges || '',
        tariff_applied: '',
        previous_reading_timestamp: '',
        final_reading_timestamp: '',
        items: [],
        finalAmount: []
    });
    // const [advanceAmountDetails, setAdvanceAmountDetails] = useState<any[]>([
    //     { id: 1, date: '2024-03-15', amount: '2000.00', type: 'Prepaid', status: 'Completed', description: 'Last Month Bill' },
    //     { id: 2, date: '2024-03-10', amount: '2500.00', type: 'Prepaid', status: 'Completed', description: 'Payment Made' },
    //     { id: 3, date: '2024-03-05', amount: '5000.00', type: 'Prepaid', status: 'Pending', description: 'Balance Amount' }
    // ]);

    const formatTimestamp = (timestamp: string): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const isTimestampMoreThan3Hours = (timestamp: string): boolean => {
        if (!timestamp) return false;
        const timestampDate = new Date(timestamp);
        const currentDate = new Date();
        const diffInHours = (currentDate.getTime() - timestampDate.getTime()) / (1000 * 60 * 60);
        return diffInHours >= 3;
    };

    const handleRefresh = () => {
        setLastUpdated(new Date());
        fetchUsageSummary();
    };

    const toggleOtherCharges = () => {
        setShowOtherCharges(!showOtherCharges);
    };

    const toggleAdvanceAmount = () => {
        setShowAdvanceAmount(!showAdvanceAmount);
    };

    const handleEditClick = (field: string) => {
        setEditingField(field);
        setEditedValues(prev => ({  
            ...prev,
            [field]: usageData[field as keyof UsageData] as string
        }));
    };

    const handleSaveEdit = async (field: string) => {
        try {
            setLoading(true);
            // Here you would typically make an API call to update the reading
            const updatedData = {
                ...usageData,
                [field]: editedValues[field as keyof typeof editedValues],
                [`${field}_timestamp`]: new Date().toISOString()
            };
            setUsageData(updatedData);
            
            // Update parent component data
            if (onDataUpdate) {
                onDataUpdate(updatedData);
            }
            
            setEditingField(null);
            handleRefresh();
        } catch (err) {
            console.error('Error updating reading:', err);
            setError('Failed to update reading. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingField(null);
        setEditedValues({
            previous_reading: '',
            final_reading: '',
            electricity_usage: '',
            electricity_charges: ''
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFreezeAndFinalize = () => {
        if (onStepChange) {
            // Use step navigation if available
            onStepChange(3); // Navigate to Payment step
        } else if (finalMeterNo) {
            // Fallback to traditional navigation
            navigate('/occupancy/payment', { 
                state: { 
                    unit_id: finalUnitId,
                    meter_no: finalMeterNo,
                    totalAmount: `₹${usageData.electricity_charges}`,
                    dueDate: new Date().toISOString().split('T')[0],
                    final_reading: usageData.final_reading,
                    electricity_charges: usageData.electricity_charges,
                    electricity_usage: usageData.electricity_usage
                } 
            });
        }
    };

    const renderEditableField = (field: string, label: string, unit: string = '') => {
        const isEditing = editingField === field;
        const isEditable = field === 'final_reading';
        const timestamp = field === 'final_reading' ? usageData.final_reading_timestamp : usageData[`${field}_timestamp` as keyof UsageData] as string;
        const canEdit = isEditable && isTimestampMoreThan3Hours(timestamp);

        const getFieldValue = (fieldName: string): string => {
            const value = usageData[fieldName as keyof UsageData];
            return typeof value === 'string' ? value : '';
        };

        const getTimestampValue = (fieldName: string): string => {
            const timestampField = `${fieldName}_timestamp` as keyof UsageData;
            const value = usageData[timestampField];
            return typeof value === 'string' ? value : '';
        };

        return (
            <article className="bg-background-secondary rounded-lg flex flex-col">
                <header className="flex flex-row items-start px-4 py-4 justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
                    {isEditable && !isEditing ? (
                        <button 
                            className={`flex flex-row gap-2 cursor-pointer ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => canEdit && handleEditClick(field)}
                            disabled={!canEdit}
                            aria-label={`Edit ${label.toLowerCase()}`}
                        >
                            <span className="h-4 w-6">
                                <img src="/icons/edit-icon.svg" alt="" className="w-6 h-6" />
                            </span>
                        </button>
                    ) : isEditable && isEditing ? (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleSaveEdit(field)} 
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                                aria-label="Save changes"
                            >
                                Save
                            </button>
                            <button 
                                onClick={handleCancelEdit} 
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                aria-label="Cancel editing"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : null}
                </header>
                <hr className="border-primary-border h-px" />
                <section className="p-4">
                    {isEditable && isEditing ? (
                        <div className="flex items-start gap-2">
                            <input
                                type="number"
                                value={editedValues[field as keyof typeof editedValues]}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                className="px-2 py-1 border border-primary-border rounded text-base w-32"
                                aria-label={`Edit ${label.toLowerCase()}`}
                            />
                            <span className="text-gray-600 text-sm">{unit}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-2xl font-extrabold text-stat-color font-manrope">
                                {field.includes('charges') ? '₹' : ''}{getFieldValue(field)} {unit}
                            </span>
                            {getTimestampValue(field) && (
                                <time className="text-sm font-normal text-grey-info opacity-70">
                                    {formatTimestamp(getTimestampValue(field))}
                                </time>
                            )}
                        </div>
                    )}
                </section>
            </article>
        );
    };

    const renderAdvanceAmountDetails = () => {
        return (
            <aside className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start py-2 text-sm">
                        <span className="text-gray-700 font-medium">Available Balance:</span>
                        <span className="font-semibold text-gray-800">₹5,000.00</span>
                    </div>
                    <div className="flex justify-between items-start py-2 text-sm">
                        <span className="text-gray-700 font-medium">Last Month Bill:</span>
                        <span className="font-semibold text-red-500">₹2,500.00</span>
                    </div>
                    <hr className="bg-gray-200 my-3" />
                    <div className="flex justify-between items-start py-2 text-base font-semibold mt-2">
                        <span className="text-gray-700">Total Balance:</span>
                        <span className="text-green-500">₹2,500.00</span>
                    </div>
                </div>
            </aside>
        );
    };

    const fetchUsageSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Mock API call - replace with actual API client
            // Example: const response = await fetch(`/api/occupancy/${finalMeterNo}`);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data for demonstration
            const mockData = {
                previous_reading: propPreviousReading || '1000.00',
                final_reading: propFinalReading || '1200.00',
                electricity_usage: propElectricityUsage || '200.00',
                electricity_charges: propElectricityCharges || '1500.00',
                tariff_applied: '7.50',
                previous_reading_timestamp: new Date(Date.now() - 86400000).toISOString(),
                final_reading_timestamp: new Date().toISOString(),
            };

            const updatedUsageData = {
                ...mockData,
                items: [
                    { 
                        label: 'Advance Amount',
                        cost: `₹0.00`, // Fixed: was using undefined advanceAmount
                        isExpandable: true,
                        type: 'advance'
                    },
                    {
                        label: 'Other Charges',
                        cost: '₹0.00',
                        isExpandable: true,
                        type: 'other'
                    }
                ],
                finalAmount: [
                    {
                        label: (
                            <span className="text-base font-extrabold text-primary-dark flex flex-row">
                                Total Amount
                            </span>
                        ),
                        cost: `₹${mockData.electricity_charges}`,
                    },
                ],
            };

            setUsageData(updatedUsageData);
            
            // Update parent component data
            if (onDataUpdate) {
                onDataUpdate(updatedUsageData);
            }
        } catch (err) {
            console.error('Error fetching usage summary:', err);
            setError('Failed to load usage summary. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsageSummary();
    }, [finalMeterNo]);

    return (
        <main className={`min-h-full flex justify-center items-start w-full bg-background-secondary ${className}`}>
            <article className="rounded-2xl p-6 w-full max-w-xl bg-white flex flex-col gap-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <section className="flex flex-col gap-6 overflow-y-auto scrollbar-hide">
                    <header>
                        <Header
                            title="Final Usage Summary"
                            rightImageSrc="/icons/refresh.svg"
                            onBackClick={() => navigate(-1)}
                            verticalLayout={true}
                            onRightImageClick={handleRefresh}
                            headerContent={
                                <div className="flex flex-row items-center gap-2">
                                    <time className="text-sm text-text-secondary whitespace-nowrap">
                                        Last Updated on {lastUpdated.toLocaleString('en-IN', { 
                                            day: '2-digit',
                                            month: '2-digit', 
                                            year: 'numeric',
                                            hour: '2-digit',    
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </time>
                                </div>
                            }   
                        />
                    </header>

                    {error && (
                        <aside className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium text-red-800">Usage Summary Error</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button 
                                        onClick={() => setError(null)}
                                        className="inline-flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                                        aria-label="Close error message"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    )}

                    {loading ? (
                        <section className="flex items-center justify-center py-8" aria-live="polite">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="status" aria-label="Loading"></div>
                            <span className="ml-2 text-text-secondary">Loading...</span>
                        </section>
                    ) : (
                        <>
                            <section className="grid grid-cols-2 gap-6">
                                {renderEditableField('previous_reading', 'Previous Meter Reading', 'kWh')}
                                {renderEditableField('final_reading', 'Final / Last Meter Reading', 'kWh')}
                                {renderEditableField('electricity_usage', 'Electricity Usage', 'kWh')}
                                {renderEditableField('electricity_charges', 'Electricity Charges', '')}
                            </section>

                            <section className="rounded-lg border border-primary-border">
                                {usageData.items.map((item, idx) => (
                                    <article key={idx}>
                                        <div className="flex justify-between items-start p-4 border-b border-primary-border last:border-b-0">
                                            <div className="text-text-secondary flex flex-row gap-3 items-start text-sm">
                                                <span>{item.label}</span>
                                                {item.isExpandable && (
                                                    <button 
                                                        className="h-6 w-6 bg-brand-blue rounded-full flex items-center justify-center cursor-pointer transition-colors"
                                                        onClick={item.type === 'advance' ? toggleAdvanceAmount : toggleOtherCharges}
                                                        aria-label={item.type === 'advance' ? (showAdvanceAmount ? "collapse advance amount" : "expand advance amount") : (showOtherCharges ? "collapse other charges" : "expand other charges")}
                                                    >
                                                        <img 
                                                            src={`/icons/${item.type === 'advance' ? (showAdvanceAmount ? 'minus' : 'plus') : (showOtherCharges ? 'minus' : 'plus')}.svg`}
                                                            alt=""
                                                            className="h-3 w-3 brightness-0 invert"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            <span className="text-2xl font-extrabold text-stat-color">{item.cost}</span>
                                        </div>
                                        {item.type === 'advance' && showAdvanceAmount && (
                                            renderAdvanceAmountDetails()
                                        )}
                                        {item.type === 'other' && showOtherCharges && (
                                            <aside className="p-4 bg-background-secondary rounded-lg mx-4 mb-4 max-h-75 overflow-y-auto scrollbar-hide">
                                                <div className="flex justify-between items-start py-2 text-sm">
                                                    <span className="text-gray-600">Water</span>
                                                    <span className="text-gray-600 font-medium">₹0.00</span>
                                                </div>
                                                <div className="flex justify-between items-start py-2 text-sm">
                                                    <span className="text-gray-600">Gas</span>
                                                    <span className="text-gray-600 font-medium">₹0.00</span>
                                                </div>
                                                <div className="flex justify-between items-start py-2 text-sm">
                                                    <span className="text-gray-600">Solar</span>
                                                    <span className="text-gray-600 font-medium">₹0.00</span>
                                                </div>
                                            </aside>
                                        )}
                                    </article>
                                ))}
                            </section>

                            <section className="bg-background-secondary rounded-lg">
                                {usageData.finalAmount.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start p-4 border-b border-border-color last:border-b-0">
                                        <span className="text-text-secondary flex flex-row gap-3 items-start text-sm">{item.label}</span>
                                        <span className="text-2xl font-extrabold text-stat-color">{item.cost}</span>
                                    </div>
                                ))}
                            </section>

                            <section className="flex items-start gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                                    id="confirmation-checkbox"
                                />
                                <label htmlFor="confirmation-checkbox" className="text-sm text-text-secondary">
                                    I confirm the consumer has vacated and approve final bill generation and usage freeze.
                                </label>
                            </section>

                            <footer className="flex justify-center gap-4">
                                <Button
                                    label="Freeze Account & Finalize"
                                    variant="primary"
                                    onClick={handleFreezeAndFinalize}
                                    disabled={!isConfirmed}
                                    className="w-full"
                                />
                            </footer>
                        </>
                    )}
                </section>
            </article>
        </main>
    );
};

export default UsageSummaryPage;
