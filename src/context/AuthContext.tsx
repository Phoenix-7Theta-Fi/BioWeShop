"use client"; // Added "use client" directive

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Added GoogleAuthProvider, signInWithPopup
import { auth } from '../lib/firebase'; // Adjust path as necessary

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const googleProvider = new GoogleAuthProvider(); // Create a provider instance

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    // setLoading(true); // Optional: manage loading state specifically for login if needed
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // User is signed in, onAuthStateChanged will handle setting currentUser and loading.
      console.log('User logged in:', userCredential.user);
      // You might want to set loading to false here if you had a specific login loading state
    } catch (error) {
      console.error("Error logging in: ", error);
      // setLoading(false); // Reset loading state in case of error
      throw error; // Re-throw the error so the UI can catch it
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // setCurrentUser(null) will be handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out: ", error);
      // setLoading(false) will be handled by onAuthStateChanged if user state changes,
      // or handle error appropriately if sign out fails
    }
    // setLoading(false) is effectively handled by onAuthStateChanged
  };

  const signup = async (email: string, pass: string) => {
    // setLoading(true); // Optional: manage loading state specifically for signup if needed
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // User is signed in, onAuthStateChanged will handle setting currentUser and loading.
      console.log('User signed up:', userCredential.user);
      // You might want to set loading to false here if you had a specific signup loading state
    } catch (error) {
      console.error("Error signing up: ", error);
      // setLoading(false); // Reset loading state in case of error
      throw error; // Re-throw the error so the UI can catch it
    }
  };

  const signInWithGoogle = async () => {
    // setLoading(true); // Optional
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      // User is signed in, onAuthStateChanged will handle setting currentUser and loading.
      console.log('User signed in with Google:', userCredential.user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // setLoading(false);
      throw error; // Re-throw so UI can catch it
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    signup,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
