import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '@/core/auth.service';
import { UserService } from '@/core/user.service.ts'; // Corrected path
import { Player } from '@/core/types';

interface AuthContextType {
  currentUser: FirebaseUser | null; // Raw Firebase user
  currentAppUser: Player | null; // Full app user profile from Firestore
  loading: boolean;
  error: Error | null;
  authService: AuthService; // Expose service for direct calls if needed by components
  register: (email: string, pass: string, username: string) => Promise<Player | null>;
  login: (email: string, pass: string) => Promise<Player | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Instantiate services here. In a larger app, this might be done via a DI container or a service locator.
const userService = new UserService();
const authService = new AuthService(userService); // AuthService now depends on UserService

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentAppUser, setCurrentAppUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        try {
          const appUser = await userService.getUserProfile(firebaseUser.uid);
          setCurrentAppUser(appUser);
          if (appUser) {
            // Optionally update lastLoginAt, but this might be better as a Cloud Function or backend trigger
            // await userService.updateUserProfile(firebaseUser.uid, { lastLoginAt: new Date() });
          }
        } catch (e: any) {
          console.error("Error fetching app user profile in AuthProvider:", e);
          setError(e);
          setCurrentAppUser(null); // Ensure app user is cleared on error
        }
      } else {
        setCurrentAppUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const register = async (email: string, pass: string, username: string): Promise<Player | null> => {
    setLoading(true);
    setError(null);
    try {
      const appUser = await authService.register(email, pass, username);
      // Auth state change will update currentUser and currentAppUser via useEffect
      setLoading(false);
      return appUser;
    } catch (e: any) {
      console.error("Registration failed in AuthContext:", e);
      setError(e);
      setLoading(false);
      throw e; // Re-throw for form to handle
    }
  };

  const login = async (email: string, pass: string): Promise<Player | null> => {
    setLoading(true);
    setError(null);
    try {
      const appUser = await authService.login(email, pass);
      // Auth state change will update currentUser and currentAppUser via useEffect
      setLoading(false);
      return appUser;
    } catch (e: any) {
      console.error("Login failed in AuthContext:", e);
      setError(e);
      setLoading(false);
      throw e; // Re-throw for form to handle
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      // Auth state change will clear users via useEffect
      setLoading(false);
    } catch (e: any) {
      console.error("Logout failed in AuthContext:", e);
      setError(e);
      setLoading(false);
      throw e;
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setLoading(false);
    } catch (e: any) {
      console.error("Forgot password failed in AuthContext:", e);
      setError(e);
      setLoading(false);
      throw e;
    }
  };

  const value = {
    currentUser,
    currentAppUser,
    loading,
    error,
    authService, // Exposing the service instance itself
    register,
    login,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
