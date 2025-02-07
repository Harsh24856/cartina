import React, { createContext, useState, useContext } from 'react';

// Create a default context value with empty functions and initial state
const defaultContextValue = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {}
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const contextValue = {
    isAuthenticated, 
    user, 
    login, 
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Add a check to prevent null context
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 