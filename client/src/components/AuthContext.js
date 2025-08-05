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

  const getUserData = () => {
    return {
      userId: sessionStorage.getItem("userId"),
      userRole: sessionStorage.getItem("userRole"),
    };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);