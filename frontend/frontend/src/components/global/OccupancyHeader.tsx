import React from 'react';
import Steps from './Steps';

interface OccupancyHeaderProps {
  // Logo prop - passed as icon path string
  logo?: string; // Icon path like "/icons/image1.svg"
  logoClassName?: string;
  onLogoClick?: () => void; // Logo click handler
  
  // Steps props - using the Steps component
  steps: Array<{
    id: number;
    label: string;
    isActive: boolean;
    isCompleted: boolean;
  }>;
  currentStep: number;
  onStepClick?: (step: number) => void;
  stepsClassName?: string;
  
  // Right section - can be action buttons or any custom component
  rightComponent?: React.ReactNode;
  rightClassName?: string;
  
  // Close functionality props
  showCloseButton?: boolean;
  closeButtonText?: string;
  closeButtonIcon?: React.ReactNode;
  onClose?: () => void;
  closeButtonClassName?: string;
  
  // Dark mode toggle props
  showDarkModeToggle?: boolean;
  onDarkModeToggle?: () => void;
  darkModeToggleClassName?: string;
  
  // Container props
  className?: string;
  containerClassName?: string;
}

const OccupancyHeader: React.FC<OccupancyHeaderProps> = ({
  // Logo prop
  logo,
  logoClassName = '',
  onLogoClick,
  
  // Steps props
  steps,
  currentStep,
  onStepClick,
  stepsClassName = '',
  
  // Right section
  rightComponent,
  rightClassName = '',
  
  // Close functionality props
  showCloseButton = true,
  closeButtonText,
  closeButtonIcon,
  onClose,
  closeButtonClassName = '',
  
  // Dark mode toggle props
  showDarkModeToggle = true,
  onDarkModeToggle,
  darkModeToggleClassName = '',
  
  // Container props
  className = '',
  containerClassName = ''
}) => {
  // Default right component (for backward compatibility)
  const defaultRightComponent = () => (
    <div className="flex items-center space-x-3">
      {/* Dark Mode Toggle */}
      {showDarkModeToggle && (
        <button
          onClick={onDarkModeToggle}
          className={`w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 ${darkModeToggleClassName}`}
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
      )}

      {/* Close Button */}
      {showCloseButton && (
        <button
          onClick={onClose}
          className={`w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 ${closeButtonClassName}`}
          aria-label={closeButtonText || "Close"}
        >
          {closeButtonIcon || (
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
          )}
        </button>
      )}
    </div>
  );

  return (
    <header className={`bg-white border-b border-primary-border py-4 w-full   ${className}`}>
      <nav className={`flex items-center justify-between px-4${containerClassName}`}>
        {/* Logo Section */}
        <section className="flex items-center">
          {logo && (
            <div 
              className={`flex items-center space-x-2 ${logoClassName} ${onLogoClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              onClick={onLogoClick}
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </div>
          )}
        </section>

        {/* Steps Section */}
        <section className={`flex-1 flex justify-center ${stepsClassName}`}>
          <Steps
            steps={steps}
            currentStep={currentStep}
            onStepClick={onStepClick}
            className="w-full justify-center"
          />
        </section>

        {/* Right Section */}
        <section className={`flex items-center ${rightClassName}`}>
          {rightComponent || defaultRightComponent()}
        </section>
      </nav>
    </header>
  );
};

export default OccupancyHeader; 