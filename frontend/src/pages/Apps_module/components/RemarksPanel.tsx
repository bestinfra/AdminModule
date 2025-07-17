import React from 'react';

interface RemarksPanelProps {
  hasSubmitted: boolean;
  isValid: boolean;
  validationErrors: Record<string, string>;
  remarks: string[];
}

const RemarksPanel: React.FC<RemarksPanelProps> = ({ 
  hasSubmitted, 
  isValid, 
  validationErrors, 
  remarks 
}) => {
  // Helper function to extract icon and text from remark
  const parseRemark = (remark: string) => {
    if (remark.includes('⚠️')) {
      return { icon: 'triangle-warning', text: remark.replace('⚠️', '').trim() };
    } else if (remark.includes('💡')) {
      return { icon: 'info', text: remark.replace('💡', '').trim() };
    } else if (remark.includes('✓')) {
      return { icon: 'checkmark', text: remark.replace('✓', '').trim() };
    }
    return { icon: null, text: remark };
  };

  return (
    <aside className="col-span-1 bg-primary-lightest rounded-xl p-4">
      <div className="flex flex-col gap-4">
        <header>
          <h2 className="text-base font-semibold text-primary">Remarks</h2>
        </header>
        
        <section className="rounded text-sm font-medium">
          {!hasSubmitted ? (
            <div className="text-info bg-blue-100 border border-blue-300 rounded p-2 flex items-center gap-2">
              <img src='icons/info.svg' alt='info' className='w-4 h-4' />
              Fill in the form and click "Next Step" to validate
            </div>
          ) : isValid ? (
            <div className="text-secondary bg-secondary-light border border-secondary rounded p-2 flex items-center gap-2">
              <img src='icons/check.svg' alt='success' className='w-4 h-4' />
              Form is valid and ready to proceed
            </div>
          ) : (
            <div className="text-danger bg-danger-light border border-danger rounded p-2 flex items-center gap-2">
              <img src='icons/triangle-warning.svg' alt='warning' className='w-4 h-4' />
              Please fix {Object.keys(validationErrors).length} validation error(s) to continue
            </div>
          )}
        </section>
        
        <section className="space-y-2 max-h-96 overflow-y-auto">
          {remarks.length > 0 ? (
            <ul className="space-y-2">
              {remarks.map((remark, index) => {
                const { icon, text } = parseRemark(remark);
                const isWarning = icon === 'triangle-warning';
                const isTip = icon === 'info';
                const isSuccess = icon === 'checkmark';
                
                let borderColor = 'border-secondary';
                let bgColor = 'bg-secondary-light';
                let iconColor = 'text-secondary';
                
                if (isWarning) {
                  borderColor = 'border-warning';
                  bgColor = 'bg-warning-alt';
                  iconColor = 'text-warning';
                } else if (isTip) {
                  borderColor = 'border-accent';
                  bgColor = 'bg-accent-light';
                  iconColor = 'text-accent';
                } else if (isSuccess) {
                  borderColor = 'border-secondary';
                  bgColor = 'bg-secondary-light';
                  iconColor = 'text-secondary';
                }
                
                return (
                  <li key={index} className={`text-sm text-neutral-darker p-3 ${bgColor} rounded ${borderColor} flex items-start gap-3`}>
                    {icon && (
                      <span className="bg-white rounded p-1 flex-shrink-0">
                        <img 
                          src={`icons/${icon}.svg`} 
                          alt={icon} 
                          className={`w-4 h-4 ${iconColor}`}
                        />
                      </span>
                    )}
                    <span 
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: text }} 
                    />
                  </li>
                );
              })}
            </ul>
          ) : !hasSubmitted ? null : (
            <div className="text-base text-neutral bg-surface rounded p-2">
              No additional remarks available.
            </div>
          )}
        </section>
      </div>
    </aside>
  );
};

export default RemarksPanel; 