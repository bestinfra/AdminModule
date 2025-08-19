import React from 'react';

interface ChartSkeletonProps {
  height?: string | number;
  className?: string;
}

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  height = '320px', 
  className = '' 
}) => {
  const skeletonHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`w-full flex items-center justify-center bg-white dark:bg-primary-dark ${className}`}
      style={{ height: skeletonHeight }}
    >
      <div className="w-12 h-12 border-4 border-primary-bg-light border-b-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default ChartSkeleton;
