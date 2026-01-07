import React from 'react';

interface Step {
  id: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = ''
}) => {
  const getStepClass = (step: Step) => {
    if (step.isCompleted) {
      return 'done';
    }
    if (step.isActive) {
      return 'active';
    }
    return '';
  };

  const getStepNumberClass = (step: Step) => {
    if (step.isCompleted) {
      return 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white bg-secondary border-2 border-secondary mb-2 relative z-10';
    }
    if (step.isActive) {
      return 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white bg-primary border-2 border-primary mb-2 relative z-10';
    }
    return 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-gray-500 bg-white border-2 border-gray-300 mb-2 relative z-10';
  };

  const getStepLabelClass = (step: Step) => {
    if (step.isCompleted) {
      return 'text-sm text-secondary font-medium text-center whitespace-nowrap';
    }
    if (step.isActive) {
        return 'text-sm text-primary font-medium text-center whitespace-nowrap';
    }
    return 'text-sm text-gray-500 text-center whitespace-nowrap';
  };

  const getConnectorClass = (index: number) => {
    if (index === 0) return 'bg-secondary'; // First connector is always green
    if (currentStep > index + 1) return 'bg-secondary'; // Completed steps
    return 'bg-gray-300'; // Pending steps
  };

  const getConnectorWidth = (index: number) => {
    if (index === 0) return 'w-[calc(90%-1rem)]';
    if (index === steps.length - 2) return 'w-[calc(100%-2rem)]';
    return 'w-[calc(100%-2rem)]';
  };

  return (
    <div className={`flex items-center relative w-full max-w-2xl mx-auto px-4 ${className}`}>
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className={`flex flex-col items-center relative z-10 flex-1 px-4 ${getStepClass(step)}`}
        >
          {/* Connector Line - positioned absolutely */}
          {index < steps.length - 1 && (
            <div 
              className={`absolute top-4 left-[calc(50%+1rem)] h-0.5 ${getConnectorClass(index)} z-0 ${getConnectorWidth(index)}`}
            />
          )}
          
          {/* Step Circle */}
          <button
            onClick={() => onStepClick?.(step.id)}
            disabled={!onStepClick}
            className={getStepNumberClass(step)}
            aria-label={`Go to step ${step.id}: ${step.label}`}
            aria-current={step.isActive ? 'step' : undefined}
          >
            {step.isCompleted ? (
              <svg 
                className="w-4 h-4" 
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
          <span className={getStepLabelClass(step)}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Steps; 