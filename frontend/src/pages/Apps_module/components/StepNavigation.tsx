import React from 'react';
import { STEP_LABELS } from '../constants';

interface StepNavigationProps {
  currentStep: number;
  onBack: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ currentStep, onBack }) => {
  return (
    <div className="flex flex-col">
      <div className="createSteps bg-primary-lightest p-4 rounded-2xl">
        <div className="flex items-center justify-between gap-4">
          {STEP_LABELS.map((step: { label: string; sub: string }, idx: number) => {
            const isActive = idx === currentStep - 1;
            const isCompleted = idx < currentStep - 1;
            
            return (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div
                    className={`p-4 rounded-lg transition-all dark:border-dark-border flex flex-row items-start gap-4 w-full ${
                      isActive 
                        ? 'bg-white dark:bg-primary-dark shadow-[0px_5px_5px_-2px_rgba(220,228,239,1)]' 
                        : isCompleted 
                          ? 'bg-white dark:bg-primary-dark'
                          : 'bg-white dark:bg-primary-dark opacity-60'
                    }`}
                  >
                    <div className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-full text-white text-sm font-semibold ${
                      isActive 
                        ? 'bg-primary' 
                        : isCompleted 
                          ? 'bg-secondary' 
                          : 'bg-gray-400'
                    }`}>
                      {isCompleted ? (
                        <img src={'icons/checkmark.svg'} alt="check" className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                      <h2 className={`text-base font-semibold ${
                        isActive 
                          ? 'font-extrabold text-primary dark:text-white' 
                          : isCompleted 
                            ? 'font-semibold text-secondary dark:text-secondary' 
                            : 'font-semibold text-main dark:text-white'
                      }`}>{step.label}</h2>
                      <h3 className={`text-base ${
                        isActive 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : isCompleted 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-500 dark:text-gray-400'
                      }`}>{step.sub}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Connector line between steps */}
                {idx < STEP_LABELS.length - 1 && (
                  <div className="flex items-center justify-center pt-4">
                    <div className={`h-0.5 w-8 ${
                      isCompleted ? 'bg-secondary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-4">
     
      </div>
    </div>
  );
};

export default StepNavigation; 