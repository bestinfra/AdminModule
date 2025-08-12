    import React from 'react';

const LastComm: React.FC<{ value?: string; description?: string }> = ({ value, description }) => {
  if (description && (!value || value === '')) {
    return <span className="text-sm text-gray-500">{description}</span>;
  }
  return (
    <span className="text-sm text-gray-500">
      {description ? `${description}: ` : 'Last Communication: '}{value}
    </span>
  );
};

export default LastComm; 