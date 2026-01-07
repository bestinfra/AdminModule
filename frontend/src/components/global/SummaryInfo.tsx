import React from 'react';
import Button from './Button';

interface SummaryItem {
  label: string;
  value: string | React.ReactNode;
}

interface SummaryInfoProps {
  title: string;
  titleColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral' | 'text-primary' | 'text-secondary' | 'text-tertiary' | 'text-quaternary';
  status?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  };
  rightStatus?: {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
    onClick?: () => void;
  };
  buttons?: Array<{
    label: string;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
    onClick?: () => void;
    className?: string;
  }>;
  data: {
    leftColumn: SummaryItem[];
    rightColumn: SummaryItem[];
  };
  className?: string;
  titleClassName?: string;
}

const SummaryInfo: React.FC<SummaryInfoProps> = ({
  title,
  titleColor = 'text-primary',
  status,
  rightStatus,
  buttons,
  data = { leftColumn: [], rightColumn: [] },
  className = '',
  titleClassName = ''
}) => {
  const getStatusVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-secondary-light text-secondary';
      case 'warning':
        return 'bg-warning-light text-warning';
      case 'error':
        return 'bg-warning-light text-danger';
      case 'info':
        return 'bg-accent-light text-accent';
      default:
        return 'bg-primary-light text-text-primary';
    }
  };

  const getRightStatusStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-secondary text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'info':
        return 'bg-accent text-white';
      default:
        return 'bg-warning-light text-warning';
    }
  };

  // Map title color to CSS custom properties
  const getTitleColorClass = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-[var(--color-primary)]';
      case 'secondary':
        return 'text-[var(--color-secondary)]';
      case 'success':
        return 'text-[var(--color-secondary)]';
      case 'warning':
        return 'text-[var(--color-warning)]';
      case 'danger':
        return 'text-[var(--color-danger)]';
      case 'accent':
        return 'text-[var(--color-accent)]';
      case 'neutral':
        return 'text-[var(--color-neutral)]';
      case 'text-primary':
        return 'text-[var(--color-text-primary)]';
      case 'text-secondary':
        return 'text-[var(--color-text-secondary)]';
      case 'text-tertiary':
        return 'text-[var(--color-text-tertiary)]';
      case 'text-quaternary':
        return 'text-[var(--color-text-quaternary)]';
      default:
        return 'text-[var(--color-text-primary)]';
    }
  };

  // Map button variants to Button component variants
  const mapButtonVariant = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'outline':
        return 'outline';
      case 'secondary':
        return 'secondary';
      default:
        return 'primary';
    }
  };


  return (
    <section className={`rounded-lg  p-6 flex flex-col gap-4 ${className} w-full`}>
      {/* Header */}
      <header className="flex justify-between items-start gap-4">
        <div className="flex items-center space-x-4">
          <h3 className={`text-md font-bold ${getTitleColorClass(titleColor)} ${titleClassName}`}>{title}</h3>
          {status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusVariantStyles(
                status.variant || 'default'
              )}`}
            >
              {status.text}
            </span>
          )}
        </div>
        {rightStatus && (
          <span
            onClick={rightStatus.onClick}
            className={`px-2 py-1 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm ${getRightStatusStyles(
              rightStatus.variant || 'default'
            )}`}
          >
            {rightStatus.text}
          </span>
        )}
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {data?.leftColumn?.map((item, index) => (
            <article key={index} className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </article>
          )) || []}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {data?.rightColumn?.map((item, index) => (
            <article key={index} className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-600">{item.value}</span>
            </article>
          )) || []}
        </div>
      </div>

      {/* Action Buttons */}
      {buttons && buttons.length > 0 && (
        <footer className="flex justify-end space-x-3 ">
          {buttons.map((button, index) => (
            <Button
              key={index}
              label={button.label}
              onClick={button.onClick}
              variant={mapButtonVariant(button.variant || 'primary')}
              className={button.className || ''}
            />
          ))}
        </footer>
      )}
    </section>
  );
};

export default SummaryInfo;
