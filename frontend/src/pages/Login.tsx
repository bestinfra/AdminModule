import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/global/Logo';

const MIN_PASSWORD_LENGTH = 6;
const INPUT_BASE_CLASSES = "w-full px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-300 outline-none transition-all placeholder-gray-400 text-sm";
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-gray-200">
              <Logo width={40} />
            </div>
          </div>

          {Object.entries(errors).map(([field, message]) => 
            message && (
              <div key={field} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-red-700">{message}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button type="button" onClick={() => clearError(field)} className="inline-flex text-red-400 hover:text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={formData.identifier}
                onChange={handleInputChange}
                className={getInputClasses(!!errors.identifier)}
                placeholder="Username or Email Address"
                required
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={getInputClasses(!!errors.password)}
                placeholder="Password"
                required
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-white border border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Remember Me</span>
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-600 hover:text-blue-800">
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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