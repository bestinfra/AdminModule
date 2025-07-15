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
  return (
    <div className="col-span-1 bg-primary-lightest rounded-xl p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-primary">Remarks</h2>
        <div className="rounded text-sm font-medium">
          {!hasSubmitted ? (
            <div className="text-blue-700 bg-blue-100 border border-blue-300 rounded p-2">
              ℹ️ Fill in the form and click "Next Step" to validate
            </div>
          ) : isValid ? (
            <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2">
              ✓ Form is valid and ready to proceed
            </div>
          ) : (
            <div className="text-red-700 bg-red-100 border border-red-300 rounded p-2">
              ⚠️ Please fix {Object.keys(validationErrors).length} validation error(s) to continue
            </div>
          )}
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {remarks.length > 0 ? (
            remarks.map((remark, index) => {
              const isWarning = remark.includes('⚠️');
              const isTip = remark.includes('💡');
              const isSuccess = remark.includes('✓');
              
              let borderColor = 'border-green-500';
              let bgColor = 'bg-green-50';
              
              if (isWarning) {
                borderColor = 'border-yellow-500';
                bgColor = 'bg-yellow-50';
              } else if (isTip) {
                borderColor = 'border-blue-500';
                bgColor = 'bg-blue-50';
              } else if (isSuccess) {
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50';
              }
              
              return (
                <div key={index} className={`text-sm text-gray-700 p-2 ${bgColor} rounded ${borderColor}`}>
                  <span dangerouslySetInnerHTML={{ __html: remark }} />
                </div>
              );
            })
          ) : !hasSubmitted ? null : (
            <div className="text-base text-gray-500 p-2 bg-gray-50 rounded">
              No additional remarks available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemarksPanel; 