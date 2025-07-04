import React, { createContext, useEffect, useState } from "react";
import { checkAuth, loginRequest, logoutRequest, updateSettingsRequest } from "@/services/api";

interface Admin {
  id: number;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateSettings: (email: string, currentPassword: string, newPassword?: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  admin: null,
  login: async () => false,
  logout: async () => {},
  updateSettings: async () => false
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const check = async () => {
      try {
        const data = await checkAuth();
        if (data.success && data.authenticated) {
          setIsAuthenticated(true);
          setAdmin(data.admin);
        } else {
          setIsAuthenticated(false);
          setAdmin(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    check();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginRequest(email, password);
      if (data.success) {
        setIsAuthenticated(true);
        setAdmin(data.admin);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
      setIsAuthenticated(false);
      setAdmin(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateSettings = async (
    email: string,
    currentPassword: string,
    newPassword?: string
  ): Promise<boolean> => {
    try {
      const data = await updateSettingsRequest(email, currentPassword, newPassword);
      if (data.success) {
        // Update admin email if changed
        if (admin && email !== admin.email) {
          setAdmin({ ...admin, email });
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Settings update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        admin,
        login,
        logout,
        updateSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
