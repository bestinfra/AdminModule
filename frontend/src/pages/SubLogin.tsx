import React, { useState } from 'react';
import Page from '@components/global/Page';
import type { Section } from '@components/global/Page';

const SubLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // TODO: Replace with real authentication logic (API call)
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@example.com' && password === 'password') {
        localStorage.setItem('token', 'dummy-token');
        window.location.href = '/';
      } else {
        setError('Invalid credentials');
      }
    }, 1000);
  };

  // Login Form Section
  const loginFormSection: Section = {
    id: 'login-form',
    component: (
      <div className="flex items-center justify-center min-h-screen bg-neutral-light dark:bg-primary-dark">
        <div className="bg-white dark:bg-primary-dark-light rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">Sub-App Login</h2>
          {error && <div className="mb-4 text-danger text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  };

  return (
    <Page
      layout="single-column"
      sections={[loginFormSection]}
      className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-primary-dark"
      containerClassName="flex items-center justify-center"
    />
  );
};

export default SubLogin; 