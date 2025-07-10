import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/global/Button';
import Logo from '../components/global/Logo';

const Login: React.FC = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        identifier: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        identifier: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const { login, register, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const validateForm = () => {
        const newErrors = { username: '', identifier: '', email: '', password: '' };
        let isValid = true;

        // For login mode, validate identifier (username or email)
        if (isLoginMode) {
            if (!formData.identifier) {
                newErrors.identifier = 'Username or email is required';
                isValid = false;
            }
        } else {
            // For registration mode, validate email and username separately
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) {
                newErrors.email = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
                isValid = false;
            }

            if (!formData.username) {
                newErrors.username = 'Username is required';
                isValid = false;
            } else if (formData.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
                isValid = false;
            }
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let result;
            if (isLoginMode) {
                result = await login(formData.identifier, formData.password);
            } else {
                result = await register(formData.username, formData.email, formData.password);
            }

            if (result.success) {
                setMessage(result.message);
                // Navigation will be handled by useEffect when isAuthenticated changes
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormData({ username: '', identifier: '', email: '', password: '' });
        setErrors({ username: '', identifier: '', email: '', password: '' });
        setMessage('');
    };

    return (
        <div className="min-h-screen flex bg-primary-lightest dark:bg-gray-900">
            {/* Left Side - Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary dark:bg-gradient-to-br dark:from-primary-dark dark:to-primary-dark-light flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"></div>
                <div className="relative z-10 text-center text-white">
                    <div className="mb-8">
                        <Logo width={180} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Welcome to AdminModule</h1>
                    <p className="text-xl opacity-90 mb-8">
                        Your comprehensive dashboard for managing applications, users, and analytics
                    </p>
                    <div className="flex items-center justify-center gap-8 opacity-80">
                        <div className="flex items-center gap-2">
                            <img src="/icons/shield.svg" alt="Security" className="w-6 h-6" />
                            <span className="text-sm">Secure & Reliable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/icons/zap.svg" alt="Fast" className="w-6 h-6" />
                            <span className="text-sm">Lightning Fast</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <img src="/icons/user-gear.svg" alt="Management" className="w-6 h-6" />
                            <span className="text-sm">Easy Management</span>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Logo width={120} />
                    </div>

                    {/* Login Card */}
                    <div className="bg-white dark:bg-primary-dark rounded-3xl shadow-xl dark:shadow-2xl border border-primary-border dark:border-dark-border p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-main dark:text-white mb-2">
                                {isLoginMode ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {isLoginMode ? 'Sign in to access your dashboard' : 'Join us and start managing your projects'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isLoginMode && (
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-main dark:text-white mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } text-main dark:text-white`}
                                            placeholder="Enter your username"
                                        />
                                        <div className="absolute right-3 top-3">
                                            <img src="/icons/user-profile.svg" alt="User" className="w-5 h-5 opacity-50" />
                                        </div>
                                    </div>
                                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                                </div>
                            )}

                            {isLoginMode ? (
                                <div>
                                    <label htmlFor="identifier" className="block text-sm font-medium text-main dark:text-white mb-2">
                                        Username or Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="identifier"
                                            name="identifier"
                                            type="text"
                                            autoComplete="username"
                                            value={formData.identifier}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                errors.identifier ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } text-main dark:text-white`}
                                            placeholder="Enter your username or email"
                                        />
                                        <div className="absolute right-3 top-3">
                                            <img src="/icons/user-profile.svg" alt="User" className="w-5 h-5 opacity-50" />
                                        </div>
                                    </div>
                                    {errors.identifier && <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-main dark:text-white mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } text-main dark:text-white`}
                                            placeholder="Enter your email"
                                        />
                                        <div className="absolute right-3 top-3">
                                            <img src="/icons/email.svg" alt="Email" className="w-5 h-5 opacity-50" />
                                        </div>
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-main dark:text-white mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                            errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } text-main dark:text-white`}
                                        placeholder="Enter your password"
                                    />
                                    <div className="absolute right-3 top-3">
                                        <img src="/icons/shield.svg" alt="Password" className="w-5 h-5 opacity-50" />
                                    </div>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl border ${
                                    message.includes('successful') || message.includes('Login successful') 
                                        ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                                        : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src={message.includes('successful') ? '/icons/check-circle.svg' : '/icons/warning-icon.svg'} 
                                            alt="" 
                                            className="w-5 h-5" 
                                        />
                                        {message}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    variant="primary"
                                    label={isSubmitting ? 
                                        (isLoginMode ? 'Signing in...' : 'Creating account...') :
                                        (isLoginMode ? 'Sign In' : 'Create Account')
                                    }
                                />
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors duration-200"
                                >
                                    {isLoginMode ? 'Create one here' : 'Sign in here'}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <img src="/icons/shield.svg" alt="Secure" className="w-4 h-4" />
                        <span>Secured with industry-standard encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 