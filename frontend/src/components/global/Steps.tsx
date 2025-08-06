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
  const getStepCircleStyle = (step: Step) => {
    if (step.isCompleted) {
      return 'bg-green-500 text-white border-green-500';
    }
    if (step.isActive) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    return 'bg-white text-gray-400 border-gray-300';
  };

  const getStepLabelStyle = (step: Step) => {
    if (step.isCompleted) {
      return 'text-green-600';
    }
    if (step.isActive) {
      return 'text-blue-600';
    }
    return 'text-gray-400';
  };

  const getConnectorStyle = (index: number) => {
    if (index === 0) return 'bg-green-500'; // First connector is always green
    if (currentStep > index + 1) return 'bg-green-500'; // Completed steps
    return 'bg-gray-300'; // Pending steps
  };

  return (
    <nav 
      className={`flex items-center justify-center space-x-4 ${className}`}
      aria-label="Progress steps"
    >
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col gap-2 items-center">
            {/* Step Circle */}
            <button
              onClick={() => onStepClick?.(step.id)}
              disabled={!onStepClick}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center 
                font-bold text-sm border-2 transition-all duration-200
                ${getStepCircleStyle(step)}
                ${onStepClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
              `}
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
            <span className={`text-sm font-medium whitespace-nowrap ${getStepLabelStyle(step)}`}>
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div 
              className={`w-50 h-0.5 ${getConnectorStyle(index)}`} 
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Steps; 