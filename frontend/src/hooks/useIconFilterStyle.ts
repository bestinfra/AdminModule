import { useFilterStyle } from '@/contexts/FilterStyleContext';

/**
 * Simple hook to get the current global icon filter style
 * Use this for components that need the current global style
 * 
 * @returns The current icon filter style object
 * 
 * @example
 * const iconStyle = useIconFilterStyle();
 * return <img src="/icon.svg" style={iconStyle} />;
 */
export const useIconFilterStyle = () => {
  const { currentFilterStyle } = useFilterStyle();
  return currentFilterStyle;
}; 