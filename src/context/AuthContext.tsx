"use client"; // Added "use client" directive

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Added GoogleAuthProvider, signInWithPopup
import { auth, db } from '../lib/firebase'; // Adjust path as necessary, Added db
import { AppUser } from '../types'; // Verify path
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Add these

interface AuthContextType {
  currentUser: AppUser | null; // Changed from User | null
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const googleProvider = new GoogleAuthProvider(); // Create a provider instance

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null); // Changed from User | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // make async
      if (user) {
        // User is signed in, see if they are in our 'users' collection
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // User exists in Firestore, merge Firebase user data with Firestore data
          const firestoreData = userDocSnap.data() as Omit<AppUser, 'uid' | 'email' | 'displayName' | 'photoURL'>; // Cast to ensure role is present
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: firestoreData.role || 'user', // Default to 'user' if role is missing for some reason
            // Add any other fields from AppUser that are stored in Firestore
            // For example, if createdAt is stored:
            // createdAt: firestoreData.createdAt
          });
        } else {
          // User does not exist in Firestore, create them with default 'user' role
          const newUserDoc: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'user',
            createdAt: serverTimestamp(), // Add a creation timestamp
          };
          try {
            await setDoc(userDocRef, newUserDoc);
            setCurrentUser(newUserDoc);
            console.log('New user document created in Firestore:', newUserDoc);
          } catch (error) {
            console.error("Error creating new user document in Firestore:", error);
            // Decide how to handle this error - maybe set a user with default role anyway or show an error
            // For now, setting user with default role even if Firestore write fails for robustness
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: 'user', // Fallback role
            });
          }
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // login, logout, signup, signInWithGoogle methods remain largely the same
  // as onAuthStateChanged will now handle fetching/creating the AppUser object.
  // Ensure they don't have conflicting logic for currentUser.

  const login = async (email: string, pass: string) => {
    // setLoading(true); // setLoading(true) is managed by onAuthStateChanged's initial loading
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting currentUser with role
    } catch (error) {
      console.error("Error logging in: ", error);
      throw error;
    }
  };

  const signup = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle creating user doc in Firestore and setting currentUser
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle creating user doc in Firestore and setting currentUser
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  const logout = async () => {
    // setLoading(true); // setLoading(true) is managed by onAuthStateChanged's initial loading
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set currentUser to null
    } catch (error) {
      console.error("Error signing out: ", error);
      // setLoading(false) // Handled by onAuthStateChanged
      throw error; // Re-throw to allow UI to handle if needed
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
