import React from 'react';

interface OccupancyHeaderProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  onDarkModeToggle?: () => void;
  onClose?: () => void;
  className?: string;
}

const OccupancyHeader: React.FC<OccupancyHeaderProps> = ({
  currentStep = 1,
  onStepClick,
  onDarkModeToggle,
  onClose,
  className = ''
}) => {
  const steps = [
    { id: 1, label: 'Confirmation', isActive: currentStep === 1, isCompleted: currentStep > 1 },
    { id: 2, label: 'Usage-Summary', isActive: currentStep === 2, isCompleted: currentStep > 2 },
    { id: 3, label: 'Payment', isActive: currentStep === 3, isCompleted: currentStep > 3 },
    { id: 4, label: 'Freeze-Status', isActive: currentStep === 4, isCompleted: currentStep > 4 }
  ];

  const getStepColor = (step: typeof steps[0]) => {
    if (step.isCompleted || step.isActive) {
      return step.isActive ? 'text-green-600' : 'text-green-600';
    }
    return 'text-gray-500';
  };

  const getStepCircleColor = (step: typeof steps[0]) => {
    if (step.isCompleted || step.isActive) {
      return step.isActive ? 'bg-green-500' : 'bg-green-500';
    }
    return 'bg-gray-300';
  };

  const getConnectorColor = (index: number) => {
    if (index === 0) return 'bg-green-500';
    if (currentStep > index + 1) return 'bg-green-500';
    return 'bg-gray-300';
  };

  return (
    <header className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo Section */}
        <section className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-800">BI</span>
              <span className="text-2xl font-bold text-green-600 ml-1">Best</span>
              <span className="text-2xl font-bold text-green-600">Infra</span>
            </div>
          </div>
        </section>

        {/* Stepper Section */}
        <section className="flex-1 flex justify-center">
          <div className="flex items-center space-x-4 relative">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <button
                  onClick={() => onStepClick?.(step.id)}
                  disabled={!onStepClick}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-200 ${
                    getStepCircleColor(step)
                  } ${
                    onStepClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                  }`}
                  aria-label={`Go to step ${step.id}: ${step.label}`}
                  aria-current={step.isActive ? 'step' : undefined}
                >
                  {step.isCompleted ? (
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </button>

                {/* Step Label */}
                <span className={`text-sm font-medium mt-2 whitespace-nowrap ${getStepColor(step)}`}>
                  {step.label}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${getConnectorColor(index)} absolute top-5 left-12`} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Action Icons Section */}
        <section className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={onDarkModeToggle}
            className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            <svg 
              className="w-5 h-5 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
            aria-label="Close"
          >
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </section>
      </nav>
    </header>
  );
};

export default OccupancyHeader; 