import React from 'react';
import { FilterStyleProvider } from '@/contexts/FilterStyleContext';

interface FederatedWrapperProps {
  children: React.ReactNode;
}

/**
 * FederatedWrapper - Provides necessary context providers for federated modules
 * 
 * This component wraps federated modules with the required context providers
 * so they can access shared state and functionality.
 */
const FederatedWrapper: React.FC<FederatedWrapperProps> = ({ children }) => {
  return (
    <FilterStyleProvider initialStyle="BRAND_GREEN">
      {children}
    </FilterStyleProvider>
  );
};

export default FederatedWrapper; 