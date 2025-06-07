"use client";

import React from 'react';
import { useAuth } from '../../../context/AuthContext'; // Adjust path
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminDashboardPage = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard...</div>;
  }

  // Basic protection: if not loading and no current user or user is not admin, redirect.
  // More robust protection will be in a layout/HOC.
  if (!currentUser) {
    router.push('/admin/login'); // Redirect to admin login if not authenticated
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Redirecting to login...</div>;
  }

  if (currentUser.role !== 'admin') {
    // This should ideally be caught by a wrapper, but as a fallback:
    router.push('/'); // Redirect to home page if not admin
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Access Denied. Redirecting...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Admin Dashboard</h1>
      <p>Welcome, {currentUser.displayName || currentUser.email}!</p>
      <p>This is the central hub for administrative tasks.</p>

      <nav style={{ marginTop: '30px' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link href="/admin/users" style={{ textDecoration: 'none', color: '#007bff', fontSize: '18px' }}>
              Manage Users
            </Link>
          </li>
          {/* Add more links here as other admin sections are created */}
        </ul>
      </nav>

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <h2 style={{fontSize: '1.2em'}}>Quick Stats (Placeholder)</h2>
        <p>Total Users: N/A</p>
        <p>Recent Signups: N/A</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
