import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '@components/global/Logo';

const MIN_PASSWORD_LENGTH = 6;
const INPUT_BASE_CLASSES = "w-full px-4 py-3 border border-gray-200 rounded-full focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400";
const INPUT_ERROR_CLASSES = "ring-2 ring-red-500 bg-red-50 border-red-300";

const getErrorMessage = (error: any): string => {
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

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'Username or email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < MIN_PASSWORD_LENGTH) newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.identifier, formData.password]);

  const getInputClasses = useMemo(() => (hasError: boolean) => 
    `${INPUT_BASE_CLASSES} ${hasError ? INPUT_ERROR_CLASSES : ''}`, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await login(formData.identifier, formData.password);
      if (!result.success) setErrors({ submit: getErrorMessage(result.message) });
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: getErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.identifier, formData.password, login, validateForm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
  }, [errors]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleForgotPassword = useCallback(() => {
    setErrors({ submit: 'Forgot password functionality will be implemented soon.' });
  }, []);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-md p-8 flex flex-col gap-4 ">
          <div className="flex justify-center">
            <div className="bg-stat-icon-gradient p-4 rounded-full rotate-180 flex items-center justify-center w-[160px] h-[160px]">
              <div className="bg-white rounded-full flex items-center justify-center w-[120px] h-[120px] shadow-md border border-gray-200 p-2 rotate-180">
                <div className="transition-transform duration-300 hover:scale-105 flex items-center justify-center w-[100px] h-[100px]">
                  <Logo width={56} />
                </div>
              </div>
            </div>
          </div>

          {Object.entries(errors).map(([field, message]) => 
            message && (
              <div key={field} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-red-700 leading-relaxed">{message}</p>
                  </div>
                  <div className="ml-auto pl-3 flex items-center">
                    <button type="button" onClick={() => clearError(field)} className="inline-flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={formData.identifier}
                onChange={handleInputChange}
                className={getInputClasses(!!errors.identifier) + 'bg-white pr-12'}
                placeholder="Username or Email Address"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="-42 0 512 512.002">
                  <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/>
                  <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/>
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={getInputClasses(!!errors.password) + ' bg-white pr-12'}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                    <g id="Layer_16" data-name="Layer 16">
                      <path d="m419.72 419.72-327.46-327.45-.07-.08a19 19 0 0 0 -26.78 27l28.67 28.67a332.64 332.64 0 0 0 -88.19 89 34.22 34.22 0 0 0 0 38.38c59.97 88.76 155.04 140.76 250.11 140.11a271.6 271.6 0 0 0 90.46-15.16l46.41 46.41a19 19 0 0 0 26.94-26.79zm-163.72-55.98a107.78 107.78 0 0 1 -98.17-152.18l29.95 29.95a69.75 69.75 0 0 0 82.71 82.71l29.95 29.95a107.23 107.23 0 0 1 -44.44 9.57z"/>
                      <path d="m506.11 236.81c-59.97-88.81-155.04-140.81-250.11-140.16a271.6 271.6 0 0 0 -90.46 15.16l46 46a107.78 107.78 0 0 1 142.63 142.63l63.74 63.74a332.49 332.49 0 0 0 88.2-89 34.22 34.22 0 0 0 0-38.37z"/>
                      <path d="m256 186.26a69.91 69.91 0 0 0 -14.49 1.52l82.71 82.7a69.74 69.74 0 0 0 -68.22-84.22z"/>
                    </g>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 519.643 519.643">
                    <circle cx="259.823" cy="259.866" r="80"/>
                    <path d="m511.673 237.706c-61.494-74.31-154.579-145.84-251.85-145.84-97.29 0-190.397 71.58-251.85 145.84-10.63 12.84-10.63 31.48 0 44.32 15.45 18.67 47.84 54.71 91.1 86.2 108.949 79.312 212.311 79.487 321.5 0 43.26-31.49 75.65-67.53 91.1-86.2 10.599-12.815 10.654-31.438 0-44.32zm-251.85-89.84c61.76 0 112 50.24 112 112s-50.24 112-112 112-112-50.24-112-112 50.24-112 112-112z"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center select-none cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="peer sr-only"
                />
                <span className="w-6 h-6 rounded-lg border-2 border-gray-300 bg-transparent flex items-center justify-center mr-2 transition peer-checked:bg-blue-900 peer-checked:border-blue-900">
                  {formData.rememberMe && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="text-base text-gray-700">Remember Me</span>
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-base text- hover:text- font-medium">
                Forgot Password?
              </button>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-50 bg-secondary hover:bg-secondary-light text-white py-3 px-4 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 