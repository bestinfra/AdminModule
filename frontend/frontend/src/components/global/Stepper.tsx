import React from 'react';

interface StepperStep {
    label: string;
    description: string;
    isActive: boolean;
    isCompleted: boolean;
    isClickable: boolean;
    onClick?: () => void;
}

interface StepperProps {
    steps: StepperStep[];
    className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, className = '' }) => {
    return (
        <aside className={`w-full lg:w-auto lg:min-w-fit lg:max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit ${className}`}>
            <nav className="w-full flex flex-col space-y-6">
                {steps.map((step, idx) => (
                    <div
                        key={step.label}
                        className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-200 ${
                            step.isClickable 
                                ? 'cursor-pointer hover:bg-gray-50' 
                                : 'cursor-default'
                        } ${
                            step.isActive ? 'bg-green-50 border border-green-200' : ''
                        }`}
                        onClick={step.onClick}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 flex-shrink-0 ${
                                step.isCompleted
                                    ? 'bg-green-500 text-white'
                                    : step.isActive
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-500 text-white'
                            }`}
                        >
                            {step.isCompleted ? (
                                <svg 
                                    className="w-5 h-5" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            ) : (
                                <span>{idx + 1}</span>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                            <h3 className={`font-semibold text-base mb-1 ${
                                step.isActive ? 'text-green-700' : 'text-gray-900'
                            }`}>
                                {step.label}
                            </h3>
                            <p className={`text-sm leading-relaxed ${
                                step.isActive ? 'text-green-600' : 'text-gray-600'
                            }`}>
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Stepper; 