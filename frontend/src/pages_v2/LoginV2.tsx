import React, { useState, useCallback, useMemo } from 'react';
// import { useAuth } from '@context/AuthContext';
import Logo from '@components/global/Logo';
import Form from '@components/Form/Form';
import type { FormInputConfig, FormInputValue } from '@components/Form/types';

export interface LoginV2Props {
  minPasswordLength?: number;
  logo?: React.ReactNode;
  buttonLabel?: string;
  getErrorMessage?: (error: any) => string;
  onForgotPassword?: () => void;
  onSuccess?: () => void;
  rememberMeLabel?: string;
  identifierPlaceholder?: string;
  passwordPlaceholder?: string;
  inputs?: FormInputConfig[];

  onSubmit?: (data: Record<string, FormInputValue>) => Promise<void> | void;
}

const DEFAULT_MIN_PASSWORD_LENGTH = 6;

const defaultGetErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  const message = error?.message?.toLowerCase() || '';
  if (message.includes('invalid credentials') || message.includes('wrong password') || message.includes('incorrect password')) {
    return 'Invalid username/email or password. Please check your credentials and try again.';
  }
  if (message.includes('user not found') || message.includes('user does not exist')) {
    return 'No account found with this username/email. Please check your credentials or contact support.';
  }
  if (message.includes('too many attempts') || message.includes('rate limit') || message.includes('too many failed')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.';
  }
  if (message.includes('network') || message.includes('connection') || message.includes('connect')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'Request timed out. Please try again.';
  }
  if (message.includes('server error') || message.includes('internal error') || message.includes('500')) {
    return 'Server error occurred. Please try again later or contact support if the problem persists.';
  }
  return error?.message || 'An unexpected error occurred. Please try again.';
};

const LoginV2: React.FC<LoginV2Props> = ({
  minPasswordLength = DEFAULT_MIN_PASSWORD_LENGTH,
  logo = <Logo width={56} />,
  buttonLabel = 'Login',
  getErrorMessage = defaultGetErrorMessage,
  onForgotPassword,
  // onSuccess,
  rememberMeLabel = 'Remember Me',
  identifierPlaceholder = 'Username or Email Address',
  passwordPlaceholder = 'Password',
  inputs,
  onSubmit,
}) => {
    // const { login,  isLoading } = useAuth();
  // const _navigate = useNavigate();
  const [_errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React.useEffect(() => {
  //   if (isAuthenticated) {
  //     if (onSuccess) onSuccess();
  //     else navigate('/');
  //   }
  // }, [isAuthenticated, navigate, onSuccess]);

  const handleForgotPassword = useCallback(() => {
    if (onForgotPassword) onForgotPassword();
    else setErrors({ submit: 'Forgot password functionality will be implemented soon.' });
  }, [onForgotPassword]);

//   const clearError = useCallback((fieldName: string) => {
//     setErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
//   }, []);

  const defaultLoginFields: FormInputConfig[] = useMemo(() => [
    // {
    //   name: 'identifier',
    //   type: 'text',
    //   placeholder: identifierPlaceholder,
    //   required: true,
    //   row: 1,
    //   col: 1,
    //   colSpan: 2,
    //   validation: {
    //     minLength: 1,
    //     custom: (value) => !value ? 'Username or email is required' : null,
    //   },
    // },
    // {
    //   name: 'password',
    //   type: 'password',
    //   placeholder: passwordPlaceholder,
    //   required: true,
    //   showPasswordToggle: true,
    //   row: 2,
    //   col: 1,
    //   colSpan: 2,
    //   validation: {
    //     minLength: minPasswordLength,
    //     custom: (value) => {
    //       if (!value) return 'Password is required';
    //       if (typeof value === 'string' && value.length < minPasswordLength) return `Password must be at least ${minPasswordLength} characters`;
    //       return null;
    //     },
    //   },
    // },
    // {
    //   name: 'rememberMe',
    //   type: 'checkbox',
    //   label: rememberMeLabel,
    //   defaultValue: false,
    //   row: 3,
    //   col: 1,
    //   colSpan: 1,
    //   className: 'justify-start',
    // },
    // {
    //   name: 'label',
    //   type: 'label',
    //   label: 'Label',
    //   required: false,
    //   row: 0,
    //   col: 1,
    //   colSpan: 2,
    // },
  ], [identifierPlaceholder, passwordPlaceholder, minPasswordLength, rememberMeLabel, handleForgotPassword]);

  const loginFields: FormInputConfig[] = inputs ?? defaultLoginFields;
  
  // Debug logging
  console.log('LoginV2 - inputs prop:', inputs);
  console.log('LoginV2 - defaultLoginFields:', defaultLoginFields);
  console.log('LoginV2 - loginFields:', loginFields);

  const handleLoginSubmit = useCallback(async (data: Record<string, FormInputValue>) => {
    setErrors({});
    setIsSubmitting(true);
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(data);
      }
    } catch (error) {
      setErrors({ submit: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [getErrorMessage, onSubmit]);

  return (
    <div className=" flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-primary-border shadow-md p-8 flex flex-col gap-4 ">
          {logo}
          {/* Remove external error display, let Form handle errors */}
           <Form
             inputs={loginFields}
             onSubmit={handleLoginSubmit}
             submitLabel={isSubmitting ? 'Signing in...' : buttonLabel}
             showFormActions={true}
             cancelLabel=""
             formBackground=''
             padding='p-0'
             border='none'
             actionsClassName='flex items-center justify-center w-full space-x-4'
             className=""
             gridLayout={{
               gridRows: 4,
               gridColumns: 2,
               gap: "gap-4",
               className: "grid-cols-2",
             }}
           />

        </div>
      </div>
    </div>
  );
};

export default LoginV2; 