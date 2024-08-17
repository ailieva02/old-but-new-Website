import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateAuthState = () => {
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
    setIsAuthenticated(!!userId);
    setIsAdmin(userRole === "admin");
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  const login = (userId, role) => {
    sessionStorage.setItem("userId", userId);
    sessionStorage.setItem("userRole", role);
    updateAuthState();
  };

  const logout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRole");
    updateAuthState();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
