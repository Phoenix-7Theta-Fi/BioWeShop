"use client";

import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjusted path
import { useRouter } from 'next/navigation'; // next/navigation for App Router
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, loading, logout } = useAuth(); // Added logout here directly
  const router = useRouter();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <div style={{fontSize: '1.5em', color: '#333'}}>Loading Admin Area...</div>
      </div>
    );
  }

  if (!currentUser) {
    router.replace('/admin/login');
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{fontSize: '1.2em', color: '#555'}}>Redirecting to admin login...</div>
        </div>
    );
  }

  if (currentUser.role !== 'admin') {
    router.replace('/');
     return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{fontSize: '1.2em', color: 'red'}}>Access Denied. Redirecting...</div>
        </div>
    );
  }

  // Navigation items
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Manage Users" },
    // Add more admin links here as objects
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <aside style={{
          width: '260px',
          backgroundColor: '#2c3e50', // Slightly darker sidebar
          color: '#ecf0f1', // Lighter text for contrast
          padding: '25px 20px',
          display: 'flex',
          flexDirection: 'column'
      }}>
        <h2 style={{
            marginBottom: '35px',
            borderBottom: '1px solid #34495e',
            paddingBottom: '15px',
            fontSize: '1.6em',
            textAlign: 'center',
            color: '#ffffff' // White title
        }}>Admin Panel</h2>
        <nav style={{ flexGrow: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {navItems.map((item) => (
            <li key={item.href} style={{ marginBottom: '18px' }}>
              <Link href={item.href} style={{
                  color: '#ecf0f1',
                  textDecoration: 'none',
                  fontSize: '1.15em',
                  display: 'block',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34495e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {item.label}
              </Link>
            </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '25px', borderTop: '1px solid #34495e' }}>
          <button
            onClick={async () => {
              try {
                await logout();
                router.push('/admin/login');
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#e74c3c', // Red logout button
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.05em',
              transition: 'background-color 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#ecf0f1' }}> {/* Lighter main background */}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
