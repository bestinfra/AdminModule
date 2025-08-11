# ElectricalMetricsCard Component

A reusable React component for displaying electrical system metrics with fully rounded borders and consistent height control.

## Features

- **Fully Rounded Borders**: Uses `rounded-3xl` (1.5rem) for a modern, pill-like appearance
- **Height Control**: Main container has `min-h-[200px]`, individual metrics have `min-h-[120px]`
- **Status Indicators**: Color-coded status indicators for different metric states
- **Responsive Design**: Adapts to different screen sizes with responsive grid layout
- **Customizable Colors**: Supports custom colors via CSS variables or hex codes
- **Hover Effects**: Subtle shadow transitions on metric cards

## Props

```typescript
interface ElectricalMetricsCardProps {
  metrics: ElectricalMetric[];
  className?: string;
  title?: string;
}

interface ElectricalMetric {
  label: string;
  value: string;
  unit?: string;
  status: 'good' | 'warning' | 'critical' | 'neutral';
  color?: string;
}
```

## Usage

```tsx
import { ElectricalMetricsCard } from '@/components/global';

const metrics = [
  {
    label: 'PF Avg',
    value: '0.90',
    status: 'good',
    color: 'var(--color-secondary)'
  },
  {
    label: 'Freq',
    value: '50.1',
    unit: 'Hz',
    status: 'good',
    color: 'var(--color-primary)'
  },
  {
    label: 'V Imbalance',
    value: '0.7',
    unit: '%',
    status: 'neutral',
    color: 'var(--color-grey)'
  }
];

<ElectricalMetricsCard 
  metrics={metrics}
  title="Electrical System Metrics"
  className="w-full"
/>
```

## Status Colors

- **Good**: Green (`var(--color-secondary)`)
- **Warning**: Orange (`var(--color-warning)`)
- **Critical**: Red (`#ef4444`)
- **Neutral**: Grey (`var(--color-grey)`)

## Styling

- **Main Container**: `rounded-3xl`, `min-h-[200px]`, white background with gray border
- **Metric Cards**: `rounded-3xl`, `min-h-[120px]`, light gray background
- **Padding**: Main container uses `p-6`, metric cards use `p-4`
- **Grid Layout**: Responsive 3-column grid on medium+ screens, single column on small screens

## Design Decisions

The component was updated based on user feedback to have:
1. **Fully Rounded Borders**: Changed from `rounded-lg` to `rounded-3xl` for a more modern, pill-shaped appearance
2. **Explicit Height Control**: Added `min-h-[200px]` for main container and `min-h-[120px]` for individual metrics to ensure consistent sizing
3. **Consistent Styling**: Follows the project's existing patterns found in `Card.tsx` component

## Integration with PageC

This component is fully integrated with the PageC system and can be used in page configurations:

```tsx
{
  name: 'ElectricalMetricsCard',
  props: {
    metrics: electricalMetrics,
    title: 'Electrical System Metrics',
    className: 'w-full'
  }
}
```
