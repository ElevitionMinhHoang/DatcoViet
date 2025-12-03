import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authAPI, usersAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user and token in localStorage
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('AuthContext useEffect - checking localStorage:', { savedUser: !!savedUser, token: !!token });
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        userData.createdAt = new Date(userData.createdAt);
        setUser(userData);
        console.log('AuthContext - user loaded from localStorage:', userData);
        
        // Verify token is still valid by fetching profile
        usersAPI.getProfile().then(profile => {
          console.log('AuthContext - token verified, profile:', profile);
        }).catch((error) => {
          console.error('AuthContext - token invalid:', error);
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }).finally(() => {
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('AuthContext - no saved user or token found');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const data = await authAPI.login(email, password);
      
      // Save token to localStorage
      localStorage.setItem('token', data.access_token);
      
      // Get user profile after successful login
      const userProfile = await usersAPI.getProfile();
      
      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const data = await authAPI.register({
        email,
        password,
        name,
        phone,
      });
      
      // Save token to localStorage
      localStorage.setItem('token', data.access_token);
      
      // Get user profile after successful registration
      const userProfile = await usersAPI.getProfile();
      
      setUser(userProfile);
      localStorage.setItem('user', JSON.stringify(userProfile));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      throw error; // Re-throw the error to be handled by the component
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = async (data: Partial<User>) => {
    console.log('AuthContext.updateProfile called with data:', data);
    if (user) {
      try {
        console.log('Calling usersAPI.updateProfile...');
        const updatedUser = await usersAPI.updateProfile(data);
        console.log('AuthContext.updateProfile - updatedUser received:', updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('AuthContext.updateProfile - user state updated and localStorage saved');
      } catch (error) {
        console.error('Profile update failed:', error);
        throw error;
      }
    } else {
      console.warn('AuthContext.updateProfile - no user found, skipping');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    isLoggedIn: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}