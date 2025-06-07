"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Adjust path if necessary
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in and is an admin, redirect to dashboard
    // Also handles the case after successful login by this page
    if (!authLoading && currentUser?.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (!authLoading && currentUser && currentUser.role !== 'admin') {
      // If logged in but not admin, redirect to home or show access denied on this page.
      // For now, redirecting to home.
      // router.push('/');
      // Or, to prevent non-admins from even seeing the login form if they land here while logged in:
       setError("Access Denied. You are not an admin.");
    }
  }, [currentUser, authLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // The useEffect above will handle redirection if login is successful and user is admin.
      // If login is successful but user is NOT admin, the useEffect will also handle it (e.g. show error).
      // If login fails, the catch block below handles it.
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials or ensure you are an admin.');
    } finally {
      setLoading(false);
    }
  };

  // If auth is loading, or if user is already an admin (and redirecting), show a loading indicator or nothing
  if (authLoading || (currentUser?.role === 'admin')) {
      return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Admin Portal Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="admin@example.com"
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              placeholder="Password"
            />
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <p style={{marginTop: '20px', fontSize: '14px', color: '#777'}}>
          Note: This login is for authorized administrators only.
      </p>
    </div>
  );
};

export default AdminLoginPage;
