import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if email is admin
  const checkAdminEmail = (email) => {
    const adminEmails = ['admin@servicegiving.com'];
    return adminEmails.includes(email.toLowerCase());
  };

  // Get user data from local storage
  const getUserFromLocalStorage = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };

  // Save user data to local storage
  const saveUserToLocalStorage = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Clear user data from local storage
  const clearUserFromLocalStorage = () => {
    localStorage.removeItem('userData');
  };

  // Fetch user role and data
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Create or update user document
  const updateUserDocument = async (uid, email, role) => {
    const userRef = doc(db, 'users', uid);
    const userData = {
      email,
      role,
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        // New user
        userData.createdAt = serverTimestamp();
      }
      await setDoc(userRef, userData, { merge: true });
      return userData;
    } catch (error) {
      console.error('Error updating user document:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const { user: authUser } = await signInWithEmailAndPassword(auth, email, password);
      const role = checkAdminEmail(email) ? 'admin' : 'client';
      const userData = await updateUserDocument(authUser.uid, email, role);
      
      const userWithRole = {
        ...authUser,
        role,
        ...userData
      };
      
      setUser(userWithRole);
      saveUserToLocalStorage(userWithRole);
      return { role };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user: authUser } = await signInWithPopup(auth, provider);
      const role = checkAdminEmail(authUser.email) ? 'admin' : 'client';
      const userData = await updateUserDocument(authUser.uid, authUser.email, role);
      
      const userWithRole = {
        ...authUser,
        role,
        ...userData
      };
      
      setUser(userWithRole);
      saveUserToLocalStorage(userWithRole);
      return { role };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (email, password, role = 'client') => {
    try {
      const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password);
      // Override role if email is admin
      const finalRole = checkAdminEmail(email) ? 'admin' : role;
      const userData = await updateUserDocument(authUser.uid, email, finalRole);
      
      const userWithRole = {
        ...authUser,
        role: finalRole,
        ...userData
      };
      
      setUser(userWithRole);
      saveUserToLocalStorage(userWithRole);
      return { role: finalRole };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      clearUserFromLocalStorage();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Check local storage first
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // If user exists in auth but not in state/storage
        const currentUser = storedUser;
        if (!currentUser) {
          const userData = await fetchUserData(authUser.uid);
          const role = userData?.role || (checkAdminEmail(authUser.email) ? 'admin' : 'client');
          const userWithRole = {
            ...authUser,
            role,
            ...userData
          };
          setUser(userWithRole);
          saveUserToLocalStorage(userWithRole);
        }
      } else {
        setUser(null);
        clearUserFromLocalStorage();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // We don't need user in dependencies as we're using closure

  const value = {
    user,
    login,
    signup,
    logout,
    googleSignIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
