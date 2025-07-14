import React, { useState } from 'react';

const SubLogin = () => {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-primary-dark">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-primary-dark-light p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary dark:text-white">Sub-App Login</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded dark:bg-dark-secondary dark:text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded dark:bg-dark-secondary dark:text-white"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default SubLogin; 