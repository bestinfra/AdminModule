import type { AccessControlData, AccessControlErrors } from './components/AccessControl';
import { 
  INITIAL_APP_BASICS_DATA, 
  INITIAL_BRANDING_DATA, 
  INITIAL_MODULE_DATA 
} from './constants';

export type AppBasicsData = typeof INITIAL_APP_BASICS_DATA;
export type AppBasicsErrors = Partial<Record<keyof AppBasicsData, string>>;

export type BrandingData = typeof INITIAL_BRANDING_DATA;
export type BrandingErrors = Partial<Record<keyof BrandingData, string>>;

export type ModuleData = typeof INITIAL_MODULE_DATA;
export type ModuleErrors = Partial<Record<keyof ModuleData, string>>;

export type AllFormData = AppBasicsData & AccessControlData & BrandingData & ModuleData;

export type StepData = {
  appBasics: AppBasicsData;
  adminAccess: AccessControlData;
  branding: BrandingData;
  modules: ModuleData;
};

export type StepErrors = {
  appBasics: AppBasicsErrors;
  adminAccess: AccessControlErrors;
  branding: BrandingErrors;
  modules: ModuleErrors;
};

export type HeaderConfig = {
  title: string;
  showMenu: boolean;
  menuItems: Array<{
    id: string;
    label: string;
    isDestructive?: boolean;
  }>;
  onMenuItemClick: (itemId: string) => void;
  onBackClick: () => void;
  backButtonText: string;
};

export type { AccessControlData, AccessControlErrors }; 