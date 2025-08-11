import React from 'react';
import Button from './Button';

export interface StatusMetric {
  icon: string;
  label: string;
  value: string;
  // Optional progress bar properties
  progressBar?: {
    percentage: number;
    color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'gray';
  };
}

export interface TitleProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: 'gray' | 'slate' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';
  shade?: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';
  className?: string;
}

export interface StatusCardProps {
  title: string;
  titleProps?: TitleProps;
  metrics: StatusMetric[];
  chartData?: {
    label: string;
    value: string;
    data: number[];
    icon?: string;
  };
  buttons?: Array<{
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'outlineSecondary' | 'primarysmall' | 'danger' | 'warning' | 'test' | 'asset' | 'success';
    onClick?: () => void;
    className?: string;
  }>;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  titleProps = {},
  metrics,
  chartData,
  buttons,
  className = ''
}) => {
  const {
    size = '2xl',
    weight = 'bold',
    color = 'gray',
    shade = '900',
    className: titleClassName = ''
  } = titleProps;

  const titleClasses = titleClassName ? `text-${size} font-${weight} text-${color}-${shade} ${titleClassName}` : '';

  // Function to get Tailwind height class based on percentage
  const getHeightClass = (percentage: number): string => {
    if (percentage <= 10) return 'h-1';
    if (percentage <= 20) return 'h-2';
    if (percentage <= 30) return 'h-3';
    if (percentage <= 40) return 'h-4';
    if (percentage <= 50) return 'h-5';
    if (percentage <= 60) return 'h-6';
    if (percentage <= 70) return 'h-7';
    if (percentage <= 80) return 'h-8';
    if (percentage <= 90) return 'h-9';
    return 'h-10';
  };

  // Function to get button variant styles - REMOVED as we're using Button component now

  return (
    <section className={`  flex flex-col gap-4 ${className}`}>
      {/* Title */}
      <header className=''>
        <h2 className={titleClasses || undefined}>{title}</h2>
      </header>
      
      {/* Metrics Grid */}
      <main className="grid grid-cols-2 gap-4 ">
        {metrics.map((metric, index) => (
          <article key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <figure className="w-8 h-8 flex items-center justify-center">
                <img 
                  src={metric.icon} 
                  alt={metric.label}
                  className="w-6 h-6"
                />
              </figure>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900 mb-2">{metric.value}</p>
                
                {/* Progress Bar within metric if specified */}
                {metric.progressBar && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.progressBar.color === 'primary' ? 'bg-primary' :
                        metric.progressBar.color === 'secondary' ? 'bg-secondary' :
                        metric.progressBar.color === 'warning' ? 'bg-warning' :
                        metric.progressBar.color === 'danger' ? 'bg-danger' :
                        'bg-gray-600'
                      }`}
                      style={{ width: `${metric.progressBar.percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </main>
      
      {/* Chart Section */}
      {chartData && (
        <aside className="bg-white rounded-lg p-4 shadow-sm">
          <header className="flex items-center justify-between ">
            <div className="flex items-center space-x-2">
              {chartData.icon && (
                <figure className="w-5 h-5">
                  <img 
                    src={chartData.icon} 
                    alt={chartData.label}
                    className="w-5 h-5"
                  />
                </figure>
              )}
              <span className="text-sm text-gray-600">{chartData.label}</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">{chartData.value}</span>
          </header>
          
          {/* Bar Chart */}
          <figure className="flex items-end space-x-1 h-16">
            {chartData.data.map((value, index) => {
              const maxValue = Math.max(...chartData.data);
              const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              const heightClass = getHeightClass(heightPercentage);
              
              return (
                <div
                  key={index}
                  className={`flex-1 bg-gray-300 rounded-t ${heightClass}`}
                />
              );
            })}
          </figure>
        </aside>
      )}

      {/* Action Buttons */}
      {buttons && buttons.length > 0 && (
        <footer className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buttons.map((button, index) => (
              <Button
                key={index}
                label={button.label}
                variant={button.variant || 'primary'}
                onClick={button.onClick}
                className={button.className || ''}
              />
            ))}
          </div>
        </footer>
      )}
    </section>
  );
};

export default StatusCard;
