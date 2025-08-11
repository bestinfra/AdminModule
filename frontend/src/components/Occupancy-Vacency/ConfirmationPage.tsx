
import { useNavigate, useLocation } from 'react-router-dom';
import Buttons from '../global/Button';

interface ConfirmationPageProps {
  onStepChange?: (step: number) => void;
  onBack?: () => void;
  unit_id?: string;
  meter_no?: string;
  consumer_name?: string;
  property_address?: string;
  className?: string;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
//   currentStep = 1,
  onStepChange,
  // onBack,
  unit_id,
  meter_no,
//   consumer_name,
//   property_address,
  className = ''
}: ConfirmationPageProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { unit_id: locationUnitId, meter_no: locationMeterNo } = location.state || {};
    
    // Use props data if available, otherwise fall back to location state
    const finalUnitId = unit_id || locationUnitId;
    const finalMeterNo = meter_no || locationMeterNo;

    const handleReview = () => {
        if (onStepChange) {
            // Use step navigation if available
            onStepChange(2); // Navigate to Usage Summary step
        } else if (finalMeterNo) {
            // Fallback to traditional navigation
            navigate(`/occupancy/usage-summary/${finalMeterNo}`, {
                state: {
                    unit_id: finalUnitId,
                    meter_no: finalMeterNo
                }
            });
        }
    };

    return (
        <main className={`min-h-full flex justify-center items-start w-full bg-background-secondary ${className}`}>
            <article className="rounded-2xl bg-white p-6 md:p-8 w-full max-w-2xl border border-primary-border bg-neutral-lightest flex flex-col gap-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <section className="flex flex-col gap-6 overflow-y-auto scrollbar-hide">
                    <header>
                        <h1 className="font-semibold text-text-primary text-xl md:text-2xl">
                            You're about to mark this consumer as{' '}
                            <mark className="text-warning bg-transparent">Vacant</mark>
                        </h1>
                    </header>
                    
                    <section>
                        <p className="text-text-secondary font-medium">
                            Please review the usage summary before confirming.
                        </p>
                    </section>
                    
                    <section className="text-text-secondary leading-relaxed">
                        <p>This action will:</p>
                        <ul className="list-none p-0" role="list">
                            <li className="flex items-center gap-4 text-sm py-2" role="listitem">
                                <img
                                    src={"/icons/check-circle.svg"}
                                    alt="Check mark icon"
                                    className="w-5 h-5 filter-[invert(0.33)_sepia(0.5)_saturate(2.5)_hue-rotate(100deg)_brightness(1.5)]"
                                    aria-hidden="true"
                                />
                                <span>Freeze final meter reading and disable usage at
                                the time of consumer checkout</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm py-2" role="listitem">
                                <img
                                    src={"/icons/check-circle.svg"}
                                    alt="Check mark icon"
                                    className="w-5 h-5 filter-[invert(0.33)_sepia(0.5)_saturate(2.5)_hue-rotate(100deg)_brightness(1.5)]"
                                    aria-hidden="true"
                                />
                                <span>Generate the consumer's final bill based on
                                recorded usage.</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm py-2" role="listitem">
                                <img
                                    src={"/icons/check-circle.svg"}
                                    alt="Check mark icon"
                                    className="w-5 h-5 filter-[invert(0.33)_sepia(0.5)_saturate(2.5)_hue-rotate(100deg)_brightness(1.5)]"
                                    aria-hidden="true"
                                />
                                <span>Further bill generation for this meter shall
                                be disabled.</span>
                            </li>
                        </ul>
                    </section>
                </section>
                
                <footer className="flex justify-center gap-4">
                    <Buttons
                        label="Yes, Review"
                        variant="primary"
                        onClick={handleReview}
                        className="w-full"
                    />
                    <Buttons
                        label="Cancel"
                        variant="outline"
                        onClick={() => {
                            navigate(-1);
                        }}
                        className="w-full"
                    />
                </footer>
            </article>
        </main>
    );
};

export default ConfirmationPage;
