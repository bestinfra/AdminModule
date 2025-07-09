// Form component constants
export const CLASSES = {
  grid: { 1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4', 5: 'col-span-5', 6: 'col-span-6' },
  cols: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' },
  layout: { vertical: 'flex flex-col space-y-6', horizontal: 'flex flex-col space-y-4', grid: 'grid gap-6' },
  container: {
    card: 'bg-[var(--color-surface)] dark:bg-[var(--color-primary-dark)] p-8 rounded-lg shadow-sm',
    minimal: 'bg-transparent p-0',
    default: 'bg-gradient-to-br from-[var(--color-primary-lightest)] to-[var(--color-primary-bg-light)] dark:from-[var(--color-primary-dark)] dark:to-[var(--color-primary-dark-light)] p-8 rounded-lg'
  }
} as const; 