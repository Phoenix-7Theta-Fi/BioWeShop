"use client"; // Required for Next.js App Router client components

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as necessary
import { useRouter } from 'next/navigation'; // For navigation

const ProfilePage = () => {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  useEffect(() => {
    // If auth is still loading, don't do anything yet.
    if (authLoading) {
      return;
    }
    // If not loading and no user, redirect to login.
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // router.push('/login'); // onAuthStateChanged in AuthContext should handle redirect indirectly if needed
      // For explicit redirect after logout, you can uncomment the line above.
      // However, the useEffect above will also trigger a redirect when currentUser becomes null.
    } catch (error: any) {
      console.error('Logout failed:', error);
      alert('Logout failed: ' + error.message); // Simple error display
    } finally {
      setLoggingOut(false);
    }
  };

  if (authLoading || !currentUser) {
    // Display a loading message or spinner while checking auth state or if redirecting
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>User Profile</h2>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Email:</strong> {currentUser.email || 'Not available'}</p>
        <p><strong>UID:</strong> {currentUser.uid}</p>
        {/* Add other user information if available and needed */}
        {currentUser.displayName && <p><strong>Display Name:</strong> {currentUser.displayName}</p>}
      </div>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{ padding: '10px 20px', cursor: loggingOut ? 'not-allowed' : 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {loggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default ProfilePage;
