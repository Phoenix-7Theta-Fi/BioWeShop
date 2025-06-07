"use client"; // Required for Next.js App Router client components

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as necessary
import { useRouter } from 'next/navigation'; // For navigation
import Link from 'next/link'; // For linking to login page

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For email/password signup
  const [googleLoading, setGoogleLoading] = useState(false); // For Google Sign-In
  const { signup, signInWithGoogle } = useAuth(); // Added signInWithGoogle
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password);
      router.push('/'); // Redirect to homepage or a dashboard after signup
    } catch (err: any) {
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/'); // Redirect to homepage or a dashboard
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google. Please try again.');
      setGoogleLoading(false); // Ensure loading state is reset on error
    }
    // setLoading(false) will be handled by AuthProvider or if error
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading || googleLoading} style={{ padding: '10px 15px', cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer', width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}>
          {loading ? 'Signing up...' : 'Signup with Email'}
        </button>
        <button onClick={handleGoogleSignIn} disabled={loading || googleLoading} style={{ padding: '10px 15px', cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}>
          {googleLoading ? 'Signing in...' : 'Sign up with Google'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
