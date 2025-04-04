
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { getCurrentUser, login as performLogin, logout as performLogout, initializeLocalStorage } from "@/services/mockData";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data on startup
    initializeLocalStorage();
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(`Attempting login for: ${email}`);
      // Always initialize storage before login
      initializeLocalStorage();
      
      const user = performLogin(email, password);
      
      if (user) {
        console.log(`Login successful for: ${user.name}`);
        setUser(user);
        toast.success(`Welcome back, ${user.name}!`);
        return true;
      } else {
        console.log(`Login failed for: ${email}`);
        toast.error("Invalid credentials. Please check your email and try again.");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("There was a problem with login. Please try again.");
      return false;
    }
  };

  const logout = () => {
    performLogout();
    setUser(null);
    toast.success("You have been logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
