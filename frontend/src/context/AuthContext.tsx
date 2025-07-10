import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Verify token is still valid
            verifyToken(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    // Verify token with backend
    const verifyToken = async (tokenToVerify: string) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenToVerify}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setUser(data.data.user);
                    setToken(tokenToVerify);
                } else {
                    // Token is invalid, clear storage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');
                    setUser(null);
                    setToken(null);
                }
            } else {
                // Token is invalid, clear storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                setUser(null);
                setToken(null);
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setUser(null);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Login function
    const login = async (identifier: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const { user: userData, token: userToken } = data.data;
                
                // Store in state
                setUser(userData);
                setToken(userToken);
                
                // Store in localStorage
                localStorage.setItem('authToken', userToken);
                localStorage.setItem('authUser', JSON.stringify(userData));
                
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    // Register function
    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const { user: userData, token: userToken } = data.data;
                
                // Store in state
                setUser(userData);
                setToken(userToken);
                
                // Store in localStorage
                localStorage.setItem('authToken', userToken);
                localStorage.setItem('authUser', JSON.stringify(userData));
                
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    // Update user function
    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 