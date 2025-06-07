"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Adjust path
import { useRouter } from 'next/navigation';
import { db } from '../../../lib/firebase'; // Adjust path
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AppUser } from '../../../types'; // Adjust path
import Link from 'next/link';

const AdminUsersPage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth state to be determined
    }

    if (!currentUser) {
      router.push('/admin/login');
      return;
    }
    if (currentUser.role !== 'admin') {
      router.push('/'); // Or an access denied page
      return;
    }

    const fetchUsers = async () => {
      setLoadingUsers(true);
      setError(null);
      try {
        const usersCollectionRef = collection(db, 'users');
        // Optionally, order users by a field, e.g., createdAt or email
        const q = query(usersCollectionRef, orderBy('email', 'asc')); // Example: order by email
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => ({
          ...doc.data() as AppUser, // Already AppUser from AuthContext, but casting for safety from Firestore
          uid: doc.id // Ensure UID is from doc.id if not explicitly stored identically
        }));
        setUsers(usersList);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. " + err.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUser, authLoading, router]);

  if (authLoading || loadingUsers) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading users...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  }

  // Fallback check if redirection hasn't happened yet for non-admins
  if (!currentUser || currentUser.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Access Denied.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Manage Users</h1>
        <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>UID</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Display Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.uid} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{user.uid}</td>
                <td style={{ padding: '10px' }}>{user.email || 'N/A'}</td>
                <td style={{ padding: '10px' }}>{user.displayName || 'N/A'}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: user.role === 'admin' ? '#dc3545' : '#28a745',
                    color: 'white',
                    fontSize: '0.9em'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {user.createdAt ? new Date((user.createdAt as any).seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
